'use client';

import { useState, useRef } from 'react';
import { Transcript } from 'ultravox-client';
import { InterviewManager } from '@/lib/interview/interviewManager';
import  VideoContainer  from '@/components/interview/VideoContainer';
import InterviewHeader  from '@/components/interview/InterviewHeader';
import TranscriptSidebar from '@/components/interview/TranscriptSideBar';

export default function BehavioralInterviewPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Ready to start');
  const [callTranscript, setCallTranscript] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const interviewRef = useRef<InterviewManager | null>(null);

  const startInterview = async () => {
    try {
      setError(null);
      setAgentStatus('Initializing...');
      setCallTranscript([]);
      
      interviewRef.current = new InterviewManager({
        onStatusChange: setAgentStatus,
        onTranscriptChange: setCallTranscript,
      });
      
      await interviewRef.current.start();
      setIsCallActive(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Interview error:', err);
      setError(message);
      setAgentStatus('Error occurred');
    }
  };

  const endInterview = async () => {
    try {
      setError(null);
      setAgentStatus('Ending...');
      await interviewRef.current?.end();
      setIsCallActive(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('End error:', err);
      setError(message);
      setAgentStatus('Error ending interview');
    }
  };

  return (
    <div className="h-auto mx-auto">
      <InterviewHeader 
        title="Behavioral Interview" 
        type="behavioral"
      />
      
      <div className="w-full flex flex-col md:flex-row items-start justify-center gap-4">
        {/* Main video container - 80% of the width */}
        <div className="w-4/5">
          <VideoContainer isCallActive={isCallActive} startInterview={() => startInterview()} endInterview={ () => endInterview()} />
          
          <div className="mt-6 flex flex-col items-center">
            <div className="space-y-6 max-w-md w-full">
              <div className="text-center text-muted-foreground font-aldrich">
                Status: {agentStatus}
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
    </div>
  );
}