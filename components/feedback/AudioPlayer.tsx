// /components/feedback/detail/AudioPlayer.tsx

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PauseIcon, PlayIcon } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle audio playback
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">
          Interview Recording
        </CardTitle>
        <CardDescription className="text-zinc-400 text-xs sm:text-sm">
          Audio recording of your interview session
        </CardDescription>
      </CardHeader>
      <CardContent className="text-zinc-300 pt-0">
        <div className="bg-zinc-800 rounded-lg p-4 sm:p-6 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm text-zinc-400">00:00</div>
              <div className="text-xs sm:text-sm text-zinc-400">05:00</div>
            </div>

            <div className="w-full h-1.5 sm:h-2 bg-zinc-700 rounded-full overflow-hidden mb-4 sm:mb-6">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: '0%' }}
              />
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-primary hover:bg-primary/90"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </Button>
            </div>

            <audio ref={audioRef} className="hidden">
              <source src="/mock-interview-audio.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <div className="text-center mt-4 sm:mt-6 text-zinc-400 text-xs sm:text-sm">
              Note: This is a mock audio player. In a real implementation, you
              would connect this to actual audio recordings.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
