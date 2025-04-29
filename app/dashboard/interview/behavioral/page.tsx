'use client';

import { useState, useRef } from 'react';
import { Transcript } from 'ultravox-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InterviewManager } from '@/lib/interview/interviewManager';
import { 
  VideoContainer,
  InterviewHeader
} from '@/components/interview';

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
    <div className="max-w-4xl h-full mx-auto flex flex-col items-center">
      <InterviewHeader 
        title="Behavioral Interview" 
        type="behavioral"
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
            
            <div className="mt-8 flex flex-col items-center">
              <div className="space-y-6 max-w-md w-full">
                <div className="text-center text-muted-foreground font-aldrich">
                  Status: {agentStatus}
                </div>

                {error && (
                  <div className="p-4 text-red-500 bg-red-50 rounded-md font-aldrich">
                    Error: {error}
                  </div>
                )}

                <div className="flex justify-center gap-4 py-2">
                  {!isCallActive ? (
                    <Button 
                      className="font-aldrich w-full py-6 text-lg bg-primary hover:bg-primary/90 shadow-md hover:shadow-xl transition-all" 
                      onClick={startInterview}
                    >
                      Start Interview
                    </Button>
                  ) : (
                    <Button
                      className="font-aldrich w-full py-6 text-lg bg-destructive hover:bg-destructive/90 shadow-md hover:shadow-xl transition-all"
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