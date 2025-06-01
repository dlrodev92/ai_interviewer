import {
  startCall,
  endCall,
  createBehavioralCall,
} from '@/modules/ultravox/ultravox';
import { Transcript, UltravoxSessionStatus } from 'ultravox-client';
import { behavioralConfig } from '@/ultravox_config/.behavioralConfig';
import { codeRelatedConfig } from '@/ultravox_config/.codeRelatedConfig';
import { systemDesignConfig } from '@/ultravox_config/.systemDesignConfig';
import { apiHandler } from '@/core/apiHandler';

type TranscriptWithTimestamp = Transcript & {
  timestamp?: string;
};

type EventHandlers = {
  onStatusChange: (status: string) => void;
  onTranscriptChange: (transcripts: TranscriptWithTimestamp[]) => void;
  onInterviewEnd?: (
    transcript: TranscriptWithTimestamp[],
    interviewId: string | null
  ) => void;
  onError?: (error: Error) => void;
};

export class InterviewManager {
  private transcript: TranscriptWithTimestamp[] = [];
  private isRunning = false;
  private handlers: EventHandlers;
  private endCallTimeout: NodeJS.Timeout | null = null;
  private interviewId: string | null = null;
  private startTime: number = 0;
  private interviewType: 'behavioral' | 'technical' | 'systemdesign' =
    'behavioral';

  private readonly INTERVIEW_DURATION_MS = 5.5 * 60 * 1000;

  constructor(handlers: EventHandlers) {
    this.handlers = handlers;
  }

  private async useInterviewToken(
    description: string = 'Standard interview session'
  ) {
    try {
      const result = await apiHandler.post<{
        success: boolean;
        balance: number;
        error?: string;
      }>('/api/interviewTokens/use', {
        amount: 1,
        interviewId: this.interviewId || undefined,
        description,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to deduct interview token');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  private processTranscript(
    transcripts: Transcript[]
  ): TranscriptWithTimestamp[] {
    return transcripts.map((entry, index) => {
      const entryWithTimestamp = entry as TranscriptWithTimestamp;
      if (entryWithTimestamp.timestamp) return entryWithTimestamp;

      const estimatedTime = index * 15;
      const minutes = Math.floor(estimatedTime / 60);
      const seconds = estimatedTime % 60;

      return {
        ...entry,
        timestamp: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      };
    });
  }

  public async start() {
    try {
      this.transcript = [];
      this.isRunning = false;
      this.handlers.onStatusChange('Checking interview credits...');
      this.interviewType = 'behavioral';

      await this.useInterviewToken('Standard behavioral interview session');

      this.isRunning = true;
      this.startTime = Date.now();
      this.handlers.onStatusChange('Starting interview...');

      const callData = await createBehavioralCall(false);
      if (!callData?.systemPrompt || !callData?.model) {
        throw new Error('Invalid response from Ultravox API');
      }

      this.interviewId = callData.id || `interview_${Date.now()}`;

      await startCall(
        {
          onStatusChange: (status) =>
            this.handlers.onStatusChange(status || 'off'),
          onTranscriptChange: (transcripts) => {
            this.transcript = this.processTranscript([...(transcripts || [])]);
            this.handlers.onTranscriptChange(this.transcript);
          },
          onDebugMessage: (msg) => {
            console.log('[Ultravox Debug]:', msg);
          },
        },
        {
          systemPrompt: callData.systemPrompt,
          model: callData.model,
          temperature: callData.temperature,
          languageHint: 'en',
          voice: 'terrence',
        },
        false
      );

      this.scheduleAutoEndCall();
      this.scheduleTimeNotifications();
    } catch (error) {
      this.isRunning = false;
      if (this.handlers.onError) {
        this.handlers.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
      throw error;
    }
  }

  public async startTechnicalInterview(programmingLanguage: string) {
    try {
      this.transcript = [];
      this.isRunning = false;
      this.handlers.onStatusChange('Checking interview credits...');
      this.interviewType = 'technical';

      await this.useInterviewToken(
        `Technical ${programmingLanguage} interview session`
      );

      this.handlers.onStatusChange(
        `Preparing ${programmingLanguage} technical interview...`
      );

      // Call the technical prompt generation endpoint
      const promptResult = await apiHandler.post<{
        success: boolean;
        systemPrompt: string;
        programmingLanguage?: string;
      }>('/api/llm/generate-technical-prompt', {
        programmingLanguage,
      });

      if (!promptResult.success || !promptResult.systemPrompt) {
        throw new Error('Failed to generate technical interview prompt');
      }

      this.isRunning = true;
      this.startTime = Date.now();

      this.interviewId = `tech_interview_${programmingLanguage}_${Date.now()}`;

      this.handlers.onStatusChange(
        `Starting ${programmingLanguage} technical interview...`
      );

      // Get the base configuration and replace system prompt
      const configCopy = {
        ...codeRelatedConfig(programmingLanguage).callConfig,
      };
      configCopy.systemPrompt = promptResult.systemPrompt;

      await startCall(
        {
          onStatusChange: (status) =>
            this.handlers.onStatusChange(status || 'off'),
          onTranscriptChange: (transcripts) => {
            this.transcript = this.processTranscript([...(transcripts || [])]);
            this.handlers.onTranscriptChange(this.transcript);
          },
          onDebugMessage: (msg) => {
            console.log('[Ultravox Debug]:', msg);
          },
        },
        configCopy,
        false
      );

      this.scheduleAutoEndCall();
      this.scheduleTimeNotifications();
    } catch (error) {
      this.isRunning = false;
      if (this.handlers.onError) {
        this.handlers.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
      throw error;
    }
  }

  public async startSystemDesignInterview(jobDescription: string) {
    try {
      this.transcript = [];
      this.isRunning = false;
      this.handlers.onStatusChange('Checking interview credits...');
      this.interviewType = 'systemdesign';

      await this.useInterviewToken('System design interview session');

      this.handlers.onStatusChange('Generating system design interview...');

      // Call the correct system design prompt endpoint
      const promptResult = await apiHandler.post<{
        success: boolean;
        systemPrompt: string;
        technologyStack?: string;
      }>('/api/llm/generate-system-design-prompt', {
        jobDescription,
      });

      if (!promptResult.success || !promptResult.systemPrompt) {
        throw new Error('Failed to generate system design interview prompt');
      }

      this.isRunning = true;
      this.startTime = Date.now();

      this.interviewId = `systemdesign_interview_${Date.now()}`;

      this.handlers.onStatusChange(`Starting system design interview...`);

      const technologyStack = promptResult.technologyStack || 'General';
      const configCopy = { ...systemDesignConfig(technologyStack).callConfig };

      configCopy.systemPrompt = promptResult.systemPrompt;

      await startCall(
        {
          onStatusChange: (status) =>
            this.handlers.onStatusChange(status || 'off'),
          onTranscriptChange: (transcripts) => {
            this.transcript = this.processTranscript([...(transcripts || [])]);
            this.handlers.onTranscriptChange(this.transcript);
          },
          onDebugMessage: (msg) => {
            console.log('[Ultravox Debug]:', msg);
          },
        },
        configCopy,
        false
      );

      this.scheduleAutoEndCall();
      this.scheduleTimeNotifications();
    } catch (error) {
      this.isRunning = false;
      if (this.handlers.onError) {
        this.handlers.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
      throw error;
    }
  }

  public async startWithJobDescription(jobDescription: string) {
    try {
      this.transcript = [];
      this.isRunning = false;
      this.handlers.onStatusChange('Checking interview credits...');
      this.interviewType = 'behavioral';

      await this.useInterviewToken('Customized job interview');

      this.handlers.onStatusChange('Generating customized interview...');

      // Call the behavioral prompt generation endpoint
      const promptResult = await apiHandler.post<{
        success: boolean;
        systemPrompt: string;
        interviewerName: string;
      }>('/api/llm/generate-interview-prompt', {
        jobDescription,
        interviewType: 'behavioral',
      });

      if (!promptResult.success || !promptResult.systemPrompt) {
        throw new Error('Failed to generate interview prompt');
      }

      this.isRunning = true;
      this.startTime = Date.now();

      this.interviewId = `job_interview_${Date.now()}`;

      const interviewerName = promptResult.interviewerName || 'Mike';
      this.handlers.onStatusChange(
        `Starting interview with ${interviewerName}...`
      );

      const configCopy = { ...behavioralConfig.callConfig };

      configCopy.systemPrompt = promptResult.systemPrompt;

      await startCall(
        {
          onStatusChange: (status) =>
            this.handlers.onStatusChange(status || 'off'),
          onTranscriptChange: (transcripts) => {
            this.transcript = this.processTranscript([...(transcripts || [])]);
            this.handlers.onTranscriptChange(this.transcript);
          },
          onDebugMessage: (msg) => {
            console.log('[Ultravox Debug]:', msg);
          },
        },
        configCopy,
        false
      );

      this.scheduleAutoEndCall();
      this.scheduleTimeNotifications();
    } catch (error) {
      this.isRunning = false;
      if (this.handlers.onError) {
        this.handlers.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
      throw error;
    }
  }

  private scheduleTimeNotifications() {
    setTimeout(() => {
      if (this.isRunning) {
        this.handlers.onStatusChange('1 minute remaining in the interview');
      }
    }, this.INTERVIEW_DURATION_MS - 60000);

    setTimeout(() => {
      if (this.isRunning) {
        this.handlers.onStatusChange('30 seconds remaining in the interview');
      }
    }, this.INTERVIEW_DURATION_MS - 30000);

    setTimeout(() => {
      if (this.isRunning) {
        this.handlers.onStatusChange('Interview ending in 10 seconds');
      }
    }, this.INTERVIEW_DURATION_MS - 10000);
  }

  public async end() {
    if (!this.isRunning) return;

    try {
      this.isRunning = false;
      this.handlers.onStatusChange('Ending interview...');

      await endCall();

      this.handlers.onStatusChange('Interview ended');
      this.clearScheduleEndCall();

      this.triggerFeedbackDialog();
    } catch (error) {
      console.error('Error ending interview:', error);
      this.triggerFeedbackDialog();
    }
  }

  private triggerFeedbackDialog() {
    const finalTranscript = this.transcript.map((entry, index) => {
      if (!entry.timestamp) {
        const minutes = Math.floor((index * 15) / 60);
        const seconds = (index * 15) % 60;
        return {
          ...entry,
          timestamp: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        };
      }
      return entry;
    });

    if (this.handlers.onInterviewEnd) {
      console.log(
        'Ending interview with transcript length:',
        finalTranscript.length
      );
      console.log('Interview type:', this.interviewType);

      this.handlers.onInterviewEnd([...finalTranscript], this.interviewId);
    }
  }

  public getTranscript() {
    return this.transcript;
  }

  public isInterviewActive() {
    return this.isRunning;
  }

  public getInterviewId() {
    return this.interviewId;
  }

  public getInterviewType() {
    return this.interviewType;
  }

  private scheduleAutoEndCall() {
    this.clearScheduleEndCall();

    this.endCallTimeout = setTimeout(() => {
      if (this.isRunning) {
        console.log('Automatic interview end after scheduled duration');
        this.end();
      }
    }, this.INTERVIEW_DURATION_MS);
  }

  private clearScheduleEndCall() {
    if (this.endCallTimeout) {
      clearTimeout(this.endCallTimeout);
      this.endCallTimeout = null;
    }
  }
}
