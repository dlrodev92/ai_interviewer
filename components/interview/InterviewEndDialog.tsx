'use client';

import { useState, useEffect } from 'react';
import { Transcript as BaseTranscript } from 'ultravox-client';

interface Transcript extends BaseTranscript {
  timestamp?: string;
}
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { apiHandler } from '@/core/apiHandler';

interface InterviewEndDialogProps {
  open: boolean;
  onClose: () => void;
  transcript: Transcript[];
  interviewId: string | null;
  autoGenerateFeedback?: boolean;
  interviewType?: 'behavioral' | 'technical' | 'systemdesign';
}

// Helper function to format timestamps if missing
function formatTranscriptForAPI(transcript: Transcript[]) {
  return transcript.map((entry, index) => {
    // Create a properly formatted transcript entry
    return {
      speaker: entry.speaker, // 'agent' or 'user'
      text: entry.text,
      // Add timestamp if missing (format as MM:SS)
      timestamp: entry.timestamp || formatTimestamp(index),
    };
  });
}

// Helper to create MM:SS timestamps based on entry index (estimating 15s per turn)
function formatTimestamp(index: number) {
  const seconds = index * 15;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper to detect interview type based on interviewId
function detectInterviewType(
  interviewId: string | null
): 'behavioral' | 'technical' | 'systemdesign' {
  if (!interviewId) return 'behavioral';

  // Technical interviews have a specific prefix pattern
  if (interviewId.startsWith('tech_interview_')) {
    return 'technical';
  }

  // System design interviews have a specific prefix pattern
  if (interviewId.startsWith('system_design_interview_')) {
    return 'systemdesign';
  }

  return 'behavioral';
}

export default function InterviewEndDialog({
  open,
  onClose,
  transcript,
  interviewId,
  autoGenerateFeedback = false,
  interviewType,
}: InterviewEndDialogProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('Initializing');

  // Determine the interview type if not provided
  const detectedType = interviewType || detectInterviewType(interviewId);

  // Automatically start feedback generation if enabled
  useEffect(() => {
    // If the dialog opens and auto-generate is enabled, start generating
    if (open && autoGenerateFeedback && !isGenerating) {
      console.log('Auto-generating feedback...');
      handleGenerateFeedback();
    }
  }, [open, autoGenerateFeedback]);

  // Handle feedback generation
  const handleGenerateFeedback = async () => {
    if (!interviewId) {
      setError('Interview ID is missing. Cannot generate feedback.');
      return;
    }

    if (transcript.length === 0) {
      setError('No transcript data available. Cannot generate feedback.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Show the user we're working
      setProgress('Preparing transcript data');

      // Format the transcript for the API
      const formattedTranscript = formatTranscriptForAPI(transcript);

      // Log the transcript for debugging
      console.log(
        `Sending transcript to API with ${formattedTranscript.length} entries`
      );
      console.log(
        `First transcript entry: ${JSON.stringify(formattedTranscript[0])}`
      );
      console.log(`Interview type: ${detectedType}`);

      // Check if transcript is very large
      const transcriptSize = JSON.stringify(formattedTranscript).length;
      console.log(`Transcript size: ${transcriptSize} bytes`);

      // Show warning for very large transcripts (> 1MB)
      if (transcriptSize > 1000000) {
        console.warn(
          'Transcript is very large, this might cause issues with the API request'
        );
      }

      // Call the appropriate API endpoint based on interview type
      setProgress(`Generating AI feedback for ${detectedType} interview`);

      // Determine the correct API endpoint based on interview type
      const endpoint = `/api/feedback/generate/${detectedType}`;

      // Create payload with type-specific parameters
      interface FeedbackPayload {
        interviewId: string;
        transcript: { speaker: string; text: string; timestamp: string }[];
        programmingLanguage?: string;
      }

      const payload: FeedbackPayload = {
        interviewId,
        transcript: formattedTranscript,
      };

      // Add type-specific parameters if applicable
      if (detectedType === 'technical') {
        // Extract programming language from interviewId if available
        if (interviewId && interviewId.startsWith('tech_interview_')) {
          const parts = interviewId.split('_');
          if (parts.length >= 3) {
            payload.programmingLanguage = parts[2];
          }
        }
      } else if (detectedType === 'systemdesign') {
        // Extract technology stack from interviewId if available
        if (interviewId && interviewId.startsWith('system_design_interview_')) {
          // We could extract tech stack here if it's included in the ID
          // But for now, we don't have a specific pattern for it
        }
      }

      // Call the appropriate API endpoint
      const result = await apiHandler.post<{
        success: boolean;
        feedback?: { id: string };
        error?: string;
      }>(endpoint, payload);

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate feedback');
      }

      // If successful, redirect to the feedback page
      if (result.feedback?.id) {
        setProgress('Feedback generated successfully!');

        // Short delay to show success message before redirecting
        setTimeout(() => {
          if (result.feedback?.id) {
            router.push(`/dashboard/feedback/${result.feedback.id}`);
          } else {
            throw new Error('Generated feedback does not have an ID');
          }
        }, 1000);
      } else {
        throw new Error('Generated feedback does not have an ID');
      }
    } catch (err) {
      console.error('Error generating feedback:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setProgress('Error occurred');
      setIsGenerating(false);
    }
  };

  // Get appropriate dialog title and description based on interview type
  const getDialogTitle = () => {
    switch (detectedType) {
      case 'technical':
        return 'Technical Interview Complete';
      case 'systemdesign':
        return 'System Design Interview Complete';
      case 'behavioral':
      default:
        return 'Behavioral Interview Complete';
    }
  };

  const getDialogDescription = () => {
    switch (detectedType) {
      case 'technical':
        return 'Your technical coding interview session has ended. Would you like to receive AI-generated feedback on your performance?';
      case 'systemdesign':
        return 'Your system design interview session has ended. Would you like to receive AI-generated feedback on your architecture and design decisions?';
      case 'behavioral':
      default:
        return 'Your behavioral interview session has ended. Would you like to receive AI-generated feedback on your performance?';
    }
  };

  // Get appropriate feedback bullet points based on interview type
  const getFeedbackPoints = () => {
    switch (detectedType) {
      case 'technical':
        return (
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Overall technical performance score</li>
            <li>Code quality and best practices assessment</li>
            <li>Technical knowledge evaluation</li>
            <li>Key strengths and areas for improvement</li>
          </ul>
        );
      case 'systemdesign':
        return (
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Overall architecture design score</li>
            <li>Scalability and trade-off analysis</li>
            <li>System design approach evaluation</li>
            <li>Key strengths and areas for improvement</li>
          </ul>
        );
      case 'behavioral':
      default:
        return (
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Overall performance score</li>
            <li>Detailed feedback on communication skills</li>
            <li>Behavioral assessment</li>
            <li>Key strengths and areas for improvement</li>
          </ul>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isGenerating) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{getDialogTitle()}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-md p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="py-2 text-zinc-300 text-sm">
          {isGenerating ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
              <p className="text-center font-medium">{progress}</p>
              <p className="text-xs text-zinc-400 mt-2">
                This may take up to 30 seconds...
              </p>
            </div>
          ) : (
            <>
              Our AI will analyze your {detectedType} interview transcript and
              provide:
              {getFeedbackPoints()}
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {!isGenerating && (
            <>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full sm:w-auto border border-zinc-700 hover:bg-zinc-800"
                disabled={isGenerating}
              >
                No Thanks
              </Button>
              <Button
                onClick={handleGenerateFeedback}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                disabled={isGenerating}
              >
                Generate Feedback
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
