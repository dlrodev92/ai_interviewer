'use client';

import { useState, useRef, useEffect } from 'react';
import { Transcript } from 'ultravox-client';
import { InterviewManager } from '@/lib/interview/interviewManager';
import VideoContainer from '@/components/interview/VideoContainer';
import InterviewHeader from '@/components/interview/InterviewHeader';
import TranscriptSidebar from '@/components/interview/TranscriptSideBar';
import NoTokensMessage from '@/components/interview/NoTokensMessage';
import TechnicalInterviewSettingsForm from '@/components/interview/TechnicalInterviewSettingsForm';
import InterviewEndDialog from '@/components/interview/InterviewEndDialog';
import { getTokenBalance } from '@/services/client/tokenService';

export default function TechnicalInterviewPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Ready to start');
  const [callTranscript, setCallTranscript] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [languageSelection, setLanguageSelection] = useState('');
  const [showInterviewUI, setShowInterviewUI] = useState(false);
  const [isPreparingInterview, setIsPreparingInterview] = useState(false);

  // State for feedback generation dialog
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

  // Fetch tokens using our client service
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        const balance = await getTokenBalance();
        setTokenBalance(balance);
        console.log('Token balance:', balance);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        // Default to 0 tokens on error - this will show the no tokens message
        setTokenBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Handle interview end - show feedback dialog
  const handleInterviewEnd = (
    transcript: Transcript[],
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

    // Store the transcript and interview ID for the feedback dialog
    setFinalTranscript(transcript);
    setCompletedInterviewId(interviewId);
    setInterviewCompleted(true);

    // Show the feedback dialog immediately
    setShowFeedbackDialog(true);

    // Enable auto-generation after 5.5 minutes to make the process seamless
    setAutoGenerateFeedback(true);
  };

  // Handle feedback dialog close
  const handleFeedbackDialogClose = () => {
    setShowFeedbackDialog(false);

    // Reset UI to show settings form again
    setShowInterviewUI(false);

    // Clear transcript
    setCallTranscript([]);
    setFinalTranscript([]);

    // Clear interview ID
    setCompletedInterviewId(null);
    setInterviewCompleted(false);
    setAutoGenerateFeedback(false);
  };

  const handleSettingsSubmit = async (data: {
    programmingLanguage: string;
  }) => {
    try {
      console.log('Programming language selected:', data.programmingLanguage);
      setLanguageSelection(data.programmingLanguage);
      setShowInterviewUI(true);
      setIsPreparingInterview(true);

      await startInterview(data.programmingLanguage);
    } catch (err) {
      setIsPreparingInterview(false);
      const message = err instanceof Error ? err.message : String(err);
      console.error('Interview start error:', err);
      setError(message);
      setAgentStatus('Error occurred');
    }
  };

  const startInterview = async (programmingLanguage: string) => {
    try {
      setError(null);
      setAgentStatus('Initializing...');
      setCallTranscript([]);
      setFinalTranscript([]);
      setInterviewCompleted(false);

      // Initialize InterviewManager with handlers
      interviewRef.current = new InterviewManager({
        onStatusChange: (status) => {
          setAgentStatus(status);

          // Log status changes for debugging
          console.log('Interview status:', status);
        },
        onTranscriptChange: (transcripts) => {
          setCallTranscript([...transcripts]);

          // Log transcript updates for debugging
          if (transcripts.length % 5 === 0) {
            // Don't log every single update
            console.log(`Transcript updated (${transcripts.length} entries)`);
          }
        },
        onInterviewEnd: handleInterviewEnd,
        onError: (error) => {
          console.error('Interview error:', error);
          setError(error.message);
        },
      });

      // Start technical interview with programming language
      await interviewRef.current.startTechnicalInterview(programmingLanguage);
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

      // Get a snapshot of the current transcript before ending
      const currentTranscript = [...callTranscript];
      console.log(
        `Manual end with ${currentTranscript.length} transcript entries`
      );

      // End the interview
      await interviewRef.current.end();

      // UI state updates will be handled by the onInterviewEnd callback
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('End error:', err);
      setError(message);
      setAgentStatus('Error ending interview');

      // Even if there's an error, try to show the feedback dialog
      if (callTranscript.length > 0) {
        const interviewId = interviewRef.current?.getInterviewId() || null;
        handleInterviewEnd(callTranscript, interviewId);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="Technical Interview" type="technical" />
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
        <InterviewHeader title="Technical Interview" type="technical" />
        <NoTokensMessage />
      </div>
    );
  }

  // Preparing interview state
  if (isPreparingInterview) {
    return (
      <div className="h-auto mx-auto">
        <InterviewHeader title="Technical Interview" type="technical" />
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">
              Preparing Your Interview
            </h3>
            <p className="text-muted-foreground">
              We're customizing your technical interview for {languageSelection}
              ...
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
        <InterviewHeader title="Technical Interview" type="technical" />
        <div className="max-w-2xl mx-auto mt-8">
          <TechnicalInterviewSettingsForm
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
      <InterviewHeader title="Technical Interview" type="technical" />

      <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-4">
        <div className="w-full lg:w-4/5">
          <VideoContainer
            isCallActive={isCallActive && !interviewCompleted}
            startInterview={() => startInterview(languageSelection)}
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

      {/* Feedback generation dialog - use finalTranscript to ensure we capture the complete transcript */}
      <InterviewEndDialog
        open={showFeedbackDialog}
        onClose={handleFeedbackDialogClose}
        transcript={
          finalTranscript.length > 0 ? finalTranscript : callTranscript
        }
        interviewId={completedInterviewId}
        autoGenerateFeedback={autoGenerateFeedback}
        interviewType="technical"
      />
    </div>
  );
}
