'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Transcript } from 'ultravox-client';

interface TranscriptAreaProps {
  transcript: Transcript[];
}

export default function TranscriptArea({ transcript }: TranscriptAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  if (transcript.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[300px] rounded-md border border-zinc-800 flex items-center justify-center bg-card"
      >
        <p className="text-center text-muted-foreground">
          Transcript will appear here once the interview begins.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[300px] rounded-md border border-zinc-800 bg-card"
    >
      <ScrollArea className="h-full p-4" ref={scrollRef}>
        {transcript.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mb-4 ${
              entry.speaker === 'agent' ? 'mr-12' : 'ml-12'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={entry.speaker === 'agent' ? 'default' : 'secondary'}>
                {entry.speaker === 'agent' ? 'AI Interviewer' : 'You'}
              </Badge>
            </div>
            <div
              className={`p-3 rounded-lg ${
                entry.speaker === 'agent'
                  ? 'bg-primary/10 text-primary-foreground'
                  : 'bg-secondary/20 text-secondary-foreground'
              }`}
            >
              <p className="whitespace-pre-line">{entry.text}</p>
            </div>
          </motion.div>
        ))}
      </ScrollArea>
    </motion.div>
  );
}