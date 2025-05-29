'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Mic, MicOff, Phone } from 'lucide-react';
import { useState } from 'react';

interface InterviewControlsProps {
  isCallActive: boolean;
  agentStatus: string;
  error: string | null;
  onStart: () => Promise<void>;
  onEnd: () => Promise<void>;
}

export default function InterviewControls({
  isCallActive,
  agentStatus,
  error,
  onStart,
  onEnd,
}: InterviewControlsProps) {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2 py-1 bg-card">
            Status
          </Badge>
          <span className="text-sm text-muted-foreground">{agentStatus}</span>
        </div>

        {isCallActive && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={
                isMuted ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''
              }
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          <p className="text-sm font-medium">Error: {error}</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!isCallActive ? (
          <Button
            onClick={onStart}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group px-6"
          >
            <span className="mr-2">Start Interview</span>
            <Phone size={16} className="group-hover:animate-pulse" />
          </Button>
        ) : (
          <Button variant="destructive" onClick={onEnd} className="group px-6">
            <span className="mr-2">End Interview</span>
            <Phone
              size={16}
              className="group-hover:rotate-135 transition-transform duration-300"
            />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
