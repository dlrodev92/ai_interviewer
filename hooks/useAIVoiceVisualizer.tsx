'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to capture and analyze audio data from the user's microphone
 * @param enabled Whether the hook should actively capture audio
 * @returns Object containing audio data and microphone status
 */
export function useAudioAnalyzer(enabled: boolean = true) {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [micAllowed, setMicAllowed] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // References to maintain audio processing objects between renders
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!enabled) return;

    // Check if the browser supports Web Audio API
    if (
      typeof window === 'undefined' ||
      (!window.AudioContext && !(window as any).webkitAudioContext)
    ) {
      setError("Your browser doesn't support Web Audio API");
      return;
    }

    // Initialize audio context if not already created
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (err) {
        setError('Failed to create audio context');
        console.error('Audio Context Error:', err);
        return;
      }
    }

    // Setup analyzer node
    if (audioContextRef.current && !analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Power of 2, determines frequency domain resolution
    }

    // Request microphone access if not already done
    if (!streamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          setMicAllowed(true);

          // Connect the microphone stream to the analyzer
          if (audioContextRef.current && analyserRef.current) {
            const source =
              audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            setMicActive(true);

            // Start capturing audio data
            startCapturing();
          }
        })
        .catch((err) => {
          setError('Microphone access denied');
          setMicAllowed(false);
          console.error('Microphone Error:', err);
        });
    }

    // Cleanup function
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, [enabled]);

  // Start or stop audio capturing based on enabled state
  useEffect(() => {
    if (enabled && micAllowed) {
      startCapturing();
    } else {
      stopCapturing();
    }

    return () => {
      stopCapturing();
    };
  }, [enabled, micAllowed]);

  // Function to start capturing audio data
  const startCapturing = () => {
    if (!analyserRef.current || frameIdRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const captureAudioData = () => {
      if (!analyserRef.current) return;

      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));

      // Schedule next capture
      frameIdRef.current = requestAnimationFrame(captureAudioData);
    };

    // Start the capture loop
    captureAudioData();
    setMicActive(true);
  };

  // Function to stop capturing audio data
  const stopCapturing = () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
    setMicActive(false);
  };

  // Function to completely clean up audio resources
  const cleanup = () => {
    stopCapturing();

    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setAudioData(null);
    setMicActive(false);
  };

  // Helper function to check if user is speaking
  const isSpeaking = () => {
    if (!audioData) return false;

    // Calculate average volume level
    const sum = Array.from(audioData).reduce((a, b) => a + b, 0);
    const avg = sum / audioData.length;

    // Consider speaking if average volume is above a threshold
    // This threshold may need adjustment based on background noise
    return avg > 30;
  };

  return {
    audioData,
    micAllowed,
    micActive,
    error,
    isSpeaking: isSpeaking(),
    startCapturing,
    stopCapturing,
    cleanup,
  };
}
