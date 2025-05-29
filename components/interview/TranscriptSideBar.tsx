'use client';

import { Transcript } from 'ultravox-client';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranscriptSidebarProps {
  callTranscript: Transcript[];
}

export default function TranscriptSidebar({
  callTranscript,
}: TranscriptSidebarProps) {
  return (
    <Card className="border-border/50 w-full md:w-1/4 h-full max-h-[calc(100vh-100px)] overflow-y-auto">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2 text-center font-aldrich underline text-secondary">
          Transcript
        </h3>

        {callTranscript.length > 0 ? (
          <ScrollArea className="h-[500px] w-full rounded-md p-2">
            {callTranscript.map((t, i) => (
              <div key={i} className="mb-3">
                <p className="text-xs text-muted-foreground font-aldrich">
                  {t.speaker === 'agent' ? 'AI Interviewer' : 'You'}
                </p>
                <p className="mt-0.5 text-sm font-aldrich">{t.text}</p>
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="h-[500px] rounded-md flex items-center justify-center p-2">
            <p className="text-xs text-muted-foreground text-center">
              Transcript will appear here once the interview begins.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
