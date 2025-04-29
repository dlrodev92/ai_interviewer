'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoContainerProps {
  isCallActive: boolean;
  interviewerImage?: string;
  candidateImage?: string;
}

export default function VideoContainer({ 
  isCallActive, 
  interviewerImage = '/interviewer.webp',
  candidateImage = '/candidate.webp'
}: VideoContainerProps) {
  const [speaking, setSpeaking] = useState<'interviewer' | 'candidate' | null>(null);
  
  useEffect(() => {
    if (!isCallActive) {
      setSpeaking(null);
      return;
    }
    
    // Simulate speaking animation
    const interval = setInterval(() => {
      setSpeaking(prev => prev === 'interviewer' ? 'candidate' : 'interviewer');
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isCallActive]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[350px] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800"
    >
      {/* Zoom Header */}
      <div className="absolute top-0 w-full bg-zinc-800 px-4 py-2 flex items-center gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-zinc-400 text-sm ml-2">
          {isCallActive ? 'Interview in Progress' : 'Interview Room'}
        </span>
        {isCallActive && (
          <div className="ml-auto px-2 py-1 bg-red-500/20 rounded-full flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
            <span className="text-red-500 text-xs">LIVE</span>
          </div>
        )}
      </div>

      {/* Participants Grid */}
      <div className="inset-0 mt-10 p-4 grid grid-cols-2 gap-4">
        {/* Interviewer */}
        <div className={`relative transition-all duration-300 ${speaking === 'interviewer' ? 'ring-2 ring-primary' : ''}`}>
          <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
            <Image
              src={interviewerImage}
              alt="Interviewer"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              AI Interviewer
            </div>
            {speaking === 'interviewer' && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                {[1,2,3].map(i => (
                  <div 
                    key={i} 
                    className="w-1 bg-green-500 rounded-full animate-pulse" 
                    style={{ 
                      height: `${6 + (i * 2)}px`,
                      animationDelay: `${i * 0.1}s` 
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Candidate */}
        <div className={`relative transition-all duration-300 ${speaking === 'candidate' ? 'ring-2 ring-primary' : ''}`}>
          <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
            <Image
              src={candidateImage}
              alt="Candidate"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              You
            </div>
            {speaking === 'candidate' && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                {[1,2,3].map(i => (
                  <div 
                    key={i} 
                    className="w-1 bg-green-500 rounded-full animate-pulse" 
                    style={{ 
                      height: `${6 + (i * 2)}px`,
                      animationDelay: `${i * 0.1}s` 
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-0 w-full bg-zinc-800 px-4 py-3 flex items-center justify-center gap-4">
        <button className="p-2 bg-zinc-700 hover:bg-zinc-600 transition-colors rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
        <button className="p-2 bg-zinc-700 hover:bg-zinc-600 transition-colors rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </button>
        <button className="p-2 bg-zinc-700 hover:bg-zinc-600 transition-colors rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}