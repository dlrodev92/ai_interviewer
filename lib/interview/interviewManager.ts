
import {
    startCall,
    endCall,
    createBehavioralCall,
  } from '@/modules/ultravox/ultravox';
  import {
    Transcript,
    UltravoxSessionStatus,
  } from 'ultravox-client';
  
  type EventHandlers = {
    onStatusChange: (status: string) => void;
    onTranscriptChange: (transcripts: Transcript[]) => void;
  };
  
  export class InterviewManager {
    private transcript: Transcript[] = [];
    private isRunning = false;
    private handlers: EventHandlers;
  
    constructor(handlers: EventHandlers) {
      this.handlers = handlers;
    }
  
    public async start() {
      this.transcript = [];
      this.isRunning = true;
      this.handlers.onStatusChange('Starting interview...');
  
      const callData = await createBehavioralCall(false);
      if (!callData?.systemPrompt || !callData?.model) {
        throw new Error('Invalid response from Ultravox API');
      }
  
      await startCall(
        {
          onStatusChange: (status) =>
            this.handlers.onStatusChange(status || 'off'),
          onTranscriptChange: (transcripts) => {
            this.transcript = [...(transcripts || [])];
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
      this.scheduleEndCall();
    }
  
    public async end() {
      this.isRunning = false;
      this.handlers.onStatusChange('Ending interview...');
      await endCall();
      this.handlers.onStatusChange('Interview ended');
      this.clearScheduleEndCall();
    }
  
    public getTranscript() {
      return this.transcript;
    }
  
    public isInterviewActive() {
      return this.isRunning;
    }

    private scheduleEndCall() {
      setTimeout(() => {
        if (this.isRunning) {
          this.end();
        }
      }, 6 * 60 * 1000); 
    }

    private clearScheduleEndCall() {
      this.isRunning = false;
      this.handlers.onStatusChange('Interview ended');
    }
  }
  