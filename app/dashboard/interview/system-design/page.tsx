'use client';

import { useState } from 'react';
import { Transcript } from 'ultravox-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  VideoContainer,
  InterviewHeader
} from '@/components/interview';

// This is a simulated interview page for system design interviews
export default function SystemDesignInterviewPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Ready to start');
  const [callTranscript, setCallTranscript] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startInterview = async () => {
    try {
      setError(null);
      setAgentStatus('Starting system design interview...');
      setCallTranscript([]);
      
      // Simulate starting the interview
      setAgentStatus('Interview started');
      setIsCallActive(true);
      
      // Simulate receiving transcript entries
      setTimeout(() => {
        setCallTranscript([
          {
            speaker: 'agent',
            text: 'Hello and welcome to this system design interview. Today I\'ll ask you to design a scalable system and explain your architectural choices. Let\'s start with a brief overview of how you approach system design problems.',
            timestamp: new Date().toISOString()
          }
        ]);
      }, 2000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Interview error:', error);
      setError(errorMessage);
      setAgentStatus('Error occurred');
    }
  };

  const endInterview = async () => {
    try {
      setError(null);
      setAgentStatus('Ending interview...');
      
      // Add final transcript entry
      setCallTranscript(prev => [
        ...prev,
        {
          speaker: 'agent',
          text: 'Thank you for walking me through your system design approach. I appreciate the clarity in your architectural decisions.',
          timestamp: new Date().toISOString()
        }
      ]);
      
      setTimeout(() => {
        setIsCallActive(false);
        setAgentStatus('Interview ended');
      }, 1000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('End interview error:', error);
      setError(errorMessage);
      setAgentStatus('Error ending interview');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <InterviewHeader 
        title="System Design Interview" 
        type="system-design"
      />
      
      <div className="w-full space-y-6">
        <VideoContainer isCallActive={isCallActive} />
        
        <Card className="border-border/50 w-full">
          <CardContent className="pt-6">
            {callTranscript.length > 0 ? (
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {callTranscript.map((t, i) => (
                  <div key={i} className="mb-4">
                    <p className="text-sm text-muted-foreground font-aldrich">
                      {t.speaker === 'agent' ? 'AI Interviewer' : 'You'}
                    </p>
                    <p className="mt-1 font-aldrich">{t.text}</p>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="h-[300px] rounded-md border flex items-center justify-center">
                <p className="text-muted-foreground">
                  Transcript will appear here once the interview begins.
                </p>
              </div>
            )}
            
            <div className="mt-6 flex flex-col items-center">
              <div className="space-y-4 max-w-md w-full">
                <div className="text-center text-muted-foreground font-aldrich">
                  Status: {agentStatus}
                </div>

                {error && (
                  <div className="p-4 text-red-500 bg-red-50 rounded-md font-aldrich">
                    Error: {error}
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {!isCallActive ? (
                    <Button className="font-aldrich w-full" onClick={startInterview}>
                      Start Interview
                    </Button>
                  ) : (
                    <Button
                      className="font-aldrich w-full"
                      variant="destructive"
                      onClick={endInterview}
                    >
                      End Interview
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}