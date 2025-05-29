'use client';

import { useState, useRef, useEffect } from 'react';
import { Transcript } from 'ultravox-client';
import { InterviewManager } from '@/lib/interview/interviewManager';
import VideoContainer from '@/components/interview/VideoContainer';
import InterviewHeader from '@/components/interview/InterviewHeader';
import TranscriptSidebar from '@/components/interview/TranscriptSideBar';
import { getTokenBalance } from '@/services/client/tokenService';
import NoTokensMessage from '@/components/interview/NoTokensMessage';
import SystemDesignInterviewSettingsForm from '@/components/interview/SystemDesignInterviewSettingsForm';
import InterviewEndDialog from '@/components/interview/InterviewEndDialog';

type TranscriptWithTimestamp = Transcript & {
  timestamp?: string;
};

export default function SystemDesignInterviewPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Ready to start');
  const [callTranscript, setCallTranscript] = useState<TranscriptWithTimestamp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showInterviewUI, setShowInterviewUI] = useState(false);
  const [isPreparingInterview, setIsPreparingInterview] = useState(false);

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [completedInterviewId, setCompletedInterviewId] = useState<
    string | null
  >(null);
  const [finalTranscript, setFinalTranscript] = useState<TranscriptWithTimestamp[]>([]);
  const [autoGenerateFeedback, setAutoGenerateFeedback] = useState(false);

  const interviewRef = useRef<InterviewManager | null>(null);

  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        const balance = await getTokenBalance();
        setTokenBalance(balance);
        console.log('Token balance:', balance);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setTokenBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleInterviewEnd = (
    transcript: TranscriptWithTimestamp[],
    interviewId: string | null
  ) => {
    console.log(
      'Interview ended with transcript:',
      transcript.length,
      'entries'
    );
    console.log(
      'Sample transcript entry:',
      transcript.length > 0 ? JSON.stringify(transcript[0]) : 'No entries'
    );
    console.log('Interview ID:', interviewId);

    setFinalTranscript(transcript);
    setCompletedInterviewId(interviewId);
    setInterviewCompleted(true);

    setShowFeedbackDialog(true);
    setIsCallActive(false);
    setAutoGenerateFeedback(true);
  };

  const handleFeedbackDialogClose = () => {
    setShowFeedbackDialog(false);
    setShowInterviewUI(false);
    setCallTranscript([]);
    setFinalTranscript([]);
    setCompletedInterviewId(null);
    setInterviewCompleted(false);
    setAutoGenerateFeedback(false);
  };

  const handleSettingsSubmit = async (data: { jobDescription: string }) => {
    try {
      console.log('Job Description submitted:', data.jobDescription);
      setJobDescription(data.jobDescription);
      setShowInterviewUI(true);
      setIsPreparingInterview(true);

      await startInterview(data.jobDescription);
    } catch (err) {
      setIsPreparingInterview(false);
      const message = err instanceof Error ? err.message : String(err);
      console.error('Interview start error:', err);
      setError(message);
      setAgentStatus('Error occurred');
    }
  };

  const startInterview = async (jobDesc: string) => {
    try {
      setError(null);
      setAgentStatus('Initializing...');
      setCallTranscript([]);
      setFinalTranscript([]);
      setInterviewCompleted(false);

      interviewRef.current = new InterviewManager({
        onStatusChange: (status) => {
          setAgentStatus(status);
          console.log('Interview status:', status);
        },
        onTranscriptChange: (transcripts) => {
          setCallTranscript([...transcripts]);

          if (transcripts.length % 5 === 0) {
            console.log(`Transcript updated (${transcripts.length} entries)`);
          }
        },
        onInterviewEnd: handleInterviewEnd,
        onError: (error) => {
          console.error('Interview error:', error);
          setError(error.message);
        },
      });

      await interviewRef.current.startSystemDesignInterview(jobDesc);
      setIsCallActive(true);
      setIsPreparingInterview(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Interview error:', err);
      setError(message);
      setAgentStatus('Error occurred');
      setIsPreparingInterview(false);
    }
  };

  const endInterview = async () => {
    if (!interviewRef.current || !interviewRef.current.isInterviewActive()) {
      console.log('Interview already ended or not active');
      return;
    }

    try {
      setError(null);
      setAgentStatus('Ending interview...');

      const currentTranscript = [...callTranscript];
      console.log(
        `Manual end with ${currentTranscript.length} transcript entries`
      );

      await interviewRef.current.end();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('End error:', err);
      setError(message);
      setAgentStatus('Error ending interview');

      if (callTranscript.length > 0) {
        const interviewId = interviewRef.current?.getInterviewId() || null;
        handleInterviewEnd(callTranscript, interviewId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="System Design Interview" type="system-design" />
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (tokenBalance !== null && tokenBalance <= 0) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="System Design Interview" type="system-design" />
        <NoTokensMessage />
      </div>
    );
  }

  if (isPreparingInterview) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="System Design Interview" type="system-design" />
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">
              Preparing Your Interview
            </h3>
            <p className="text-muted-foreground">
              We're customizing your system design interview based on the job
              description...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!showInterviewUI) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="System Design Interview" type="system-design" />
        <div className="max-w-2xl mx-auto mt-8">
          <SystemDesignInterviewSettingsForm
            isOpen={true}
            onClose={() => (window.location.href = '/dashboard')}
            onSubmit={handleSettingsSubmit}
            creditsAvailable={tokenBalance || 0}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto mx-auto">
      <InterviewHeader title="System Design Interview" type="system-design" />

      <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-4">
        <div className="w-full lg:w-4/5">
          <VideoContainer
            isCallActive={isCallActive && !interviewCompleted}
            startInterview={() => startInterview(jobDescription)}
            endInterview={endInterview}
          />

          <div className="mt-6 flex flex-col items-center">
            <div className="space-y-6 max-w-md w-full">
              <div className="text-center text-muted-foreground font-aldrich">
                Status:{' '}
                {interviewCompleted ? 'Interview Completed' : agentStatus}
              </div>

              {error && (
                <div className="p-4 text-red-500 bg-red-50 rounded-md font-aldrich">
                  Error: {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <TranscriptSidebar callTranscript={callTranscript} />
      </div>

      <InterviewEndDialog
        open={showFeedbackDialog}
        onClose={handleFeedbackDialogClose}
        transcript={
          finalTranscript.length > 0 ? finalTranscript : callTranscript
        }
        interviewId={completedInterviewId}
        autoGenerateFeedback={autoGenerateFeedback}
        interviewType="systemdesign"
      />
    </div>
  );
}