'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import MicVisualizerCanvas from '@/components/interview/MicVIsualizerCanvas';
import Webcam from 'react-webcam';

interface VideoContainerProps {
  isCallActive: boolean;
  startInterview: () => void;
  endInterview: () => void;
  candidateImage?: string;
}

export default function VideoContainer({
  isCallActive,
  startInterview,
  endInterview,
  candidateImage = '/candidate.webp',
}: VideoContainerProps) {
  const [speaking, setSpeaking] = useState<'interviewer' | 'candidate' | null>(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraAllowed(true))
      .catch(() => setCameraAllowed(false));
  }, []);

  useEffect(() => {
    if (!isCallActive) {
      setSpeaking(null);
      return;
    }

    const interval = setInterval(() => {
      setSpeaking((prev) => (prev === 'interviewer' ? 'candidate' : 'interviewer'));
    }, 5000);

    return () => clearInterval(interval);
  }, [isCallActive]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[600px] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800"
    >
      {/* Header */}
      <div className="absolute top-0 w-full bg-zinc-800 px-4 py-2 flex items-center gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-zinc-400 text-sm ml-2">
          {isCallActive ? 'Interview in Progress' : 'Interview Room'}
        </span>
        {isCallActive && (
          <div className="ml-auto px-2 py-1 bg-red-500/20 rounded-full flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
            <span className="text-red-500 text-xs">LIVE</span>
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div className="inset-0 mt-10 p-4 grid grid-cols-2 gap-4">
        {/* AI Interviewer */}
        <div className={`relative transition-all duration-300 ${speaking === 'interviewer' ? 'ring-2 ring-primary' : ''}`}>
          <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
        
          <MicVisualizerCanvas active={speaking === 'interviewer'} />
            
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              AI Interviewer
            </div>
            <div className="absolute bottom-2 right-2">
              {speaking === 'interviewer' && (
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-green-500 rounded-full animate-pulse"
                      style={{
                        height: `${6 + i * 2}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Candidate */}
        <div className={`relative transition-all duration-300 ${speaking === 'candidate' ? 'ring-2 ring-primary' : ''}`}>
          <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
            {cameraAllowed ? (
              <Webcam className="object-cover w-full h-full" audio={false} />
            ) : (
              <Image src={candidateImage} alt="Candidate" fill className="object-cover" />
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              You
            </div>
            {speaking === 'candidate' && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500 rounded-full animate-pulse"
                    style={{
                      height: `${6 + i * 2}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 w-full bg-zinc-800 px-4 py-3 flex items-center justify-center gap-4">
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
    </motion.div>
  );
}
