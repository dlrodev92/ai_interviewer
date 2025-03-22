'use client';

import React, { useState, useCallback } from 'react';
import {
  Transcript,
  UltravoxExperimentalMessageEvent,
  UltravoxSessionStatus,
} from 'ultravox-client';
import {
  startCall,
  endCall,
  createBehavioralCall,
} from '@/modules/ultravox/ultravox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function InterviewPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('Ready to start');
  const [callTranscript, setCallTranscript] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = useCallback(
    (status: UltravoxSessionStatus | string | undefined) => {
      setAgentStatus(status || 'off');
    },
    []
  );

  const handleTranscriptChange = useCallback(
    (transcripts: Transcript[] | undefined) => {
      if (transcripts) setCallTranscript([...transcripts]);
    },
    []
  );

  const startInterview = async () => {
    try {
      setError(null);
      setAgentStatus('Starting interview...');
      setCallTranscript([]);

      const callData = await createBehavioralCall(false);

      if (!callData?.systemPrompt || !callData?.model) {
        throw new Error('Invalid response from Ultravox API');
      }

      await startCall(
        {
          onStatusChange: handleStatusChange,
          onTranscriptChange: handleTranscriptChange,
          onDebugMessage: (msg) => {
            console.log('Debug:', msg);
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

      setIsCallActive(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Interview error:', error);
      setError(errorMessage);
      setAgentStatus('Error occurred');
    }
  };

  const endInterview = async () => {
    try {
      setError(null);
      setAgentStatus('Ending interview...');
      await endCall();
      setIsCallActive(false);
      setAgentStatus('Interview ended');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('End interview error:', error);
      setError(errorMessage);
      setAgentStatus('Error ending interview');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6 font-aldrich">
            Behavioral Interview
          </h1>

          <div className="space-y-4">
            <div className="text-muted-foreground font-aldrich">
              Status: {agentStatus}
            </div>

            {error && (
              <div className="p-4 text-red-500 bg-red-50 rounded-md font-aldrich">
                Error: {error}
              </div>
            )}

            {callTranscript.length > 0 && (
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {callTranscript.map((transcript, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm text-muted-foreground font-aldrich">
                      {transcript.speaker === 'agent'
                        ? 'AI Interviewer'
                        : 'You'}
                    </p>
                    <p className="mt-1 font-aldrich">{transcript.text}</p>
                  </div>
                ))}
              </ScrollArea>
            )}

            <div className="flex justify-center gap-4">
              {!isCallActive ? (
                <Button className="font-aldrich" onClick={startInterview}>
                  Start Interview
                </Button>
              ) : (
                <Button
                  className="font-aldrich"
                  variant="destructive"
                  onClick={endInterview}
                >
                  End Interview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
