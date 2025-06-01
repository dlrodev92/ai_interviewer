'use client';

import { useState, useRef, useEffect } from 'react';
import { Transcript } from 'ultravox-client';
import { InterviewManager } from '@/lib/interview/interviewManager';
import VideoContainer from '@/components/interview/VideoContainer';
import InterviewHeader from '@/components/interview/InterviewHeader';
import TranscriptSidebar from '@/components/interview/TranscriptSideBar';
import { getUserInterviewTokens } from '@/services/server/userInterviewTokens';
import NoTokensMessage from '@/components/interview/NoTokensMessage';
import InterviewSettingsForm from '@/components/interview/InterviewSettingsForm';
import InterviewEndDialog from '@/components/interview/InterviewEndDialog';

export default function BehavioralInterviewPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Ready to start');
  const [callTranscript, setCallTranscript] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showInterviewUI, setShowInterviewUI] = useState(false);
  const [isPreparingInterview, setIsPreparingInterview] = useState(false);

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [completedInterviewId, setCompletedInterviewId] = useState<
    string | null
  >(null);
  const [finalTranscript, setFinalTranscript] = useState<Transcript[]>([]);
  const [autoGenerateFeedback, setAutoGenerateFeedback] = useState(false);

  const interviewRef = useRef<InterviewManager | null>(null);

  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        const tokens = await getUserInterviewTokens();
        setTokenBalance(tokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleInterviewEnd = (
    transcript: Transcript[],
    interviewId: string | null
  ) => {
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
      setJobDescription(data.jobDescription);
      setShowInterviewUI(true);
      setIsPreparingInterview(true);
      await startInterview(data.jobDescription);
    } catch (err) {
      setIsPreparingInterview(false);
      const message = err instanceof Error ? err.message : String(err);
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
        },

        onTranscriptChange: (transcripts) => {
          setCallTranscript([...transcripts]);

          if (transcripts.length % 5 === 0) {
            console.log(
              `Transcript updated with ${transcripts.length} entries`
            );
          }
        },
        onInterviewEnd: handleInterviewEnd,
        onError: (error) => {
          console.error('Interview error:', error);
          setError(error.message);
        },
      });

      await interviewRef.current.startWithJobDescription(jobDesc);
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
        <InterviewHeader title="Behavioral Interview" type="behavioral" />
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // No tokens message
  if (tokenBalance !== null && tokenBalance <= 0) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="Behavioral Interview" type="behavioral" />
        <NoTokensMessage />
      </div>
    );
  }

  // Preparing interview state
  if (isPreparingInterview) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="Behavioral Interview" type="behavioral" />
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">
              Preparing Your Interview
            </h3>
            <p className="text-muted-foreground">
              We're customizing your interview questions based on the job
              description...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not showing interview UI yet, show settings form right away
  if (!showInterviewUI) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="Behavioral Interview" type="behavioral" />
        <div className="max-w-2xl mx-auto mt-8">
          <InterviewSettingsForm
            isOpen={true}
            onClose={() => (window.location.href = '/dashboard')}
            onSubmit={handleSettingsSubmit}
            creditsAvailable={tokenBalance || 0}
          />
        </div>
      </div>
    );
  }

  // If showing interview UI, render the actual interview interface
  return (
    <div className="h-auto mx-auto">
      <InterviewHeader title="Behavioral Interview" type="behavioral" />

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
        interviewType="behavioral"
      />
    </div>
  );
}
