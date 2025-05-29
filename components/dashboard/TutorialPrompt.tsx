// components/dashboard/TutorialPrompt.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TutorialPromptProps {
  onComplete: () => void;
  onDismiss: () => void;
}

export default function TutorialPrompt({
  onComplete,
  onDismiss,
}: TutorialPromptProps) {
  const [showVideo, setShowVideo] = useState(false);

  const handleWatchTutorial = () => {
    setShowVideo(true);
  };

  const handleFinishTutorial = () => {
    setShowVideo(false);
    onComplete();
  };

  return (
    <Card className="mb-8 border-primary/20 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader>
        <CardTitle>Welcome to MockInterviewerAI!</CardTitle>
        <CardDescription>
          First time here? Watch a quick tutorial to get started.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {showVideo ? (
          <div className="aspect-video bg-zinc-900 rounded-md flex items-center justify-center">
            {/* Video player component */}
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-4">
                How to Use MockInterviewerAI
              </h3>
              <p className="text-muted-foreground mb-4">
                This is where your tutorial video would play.
              </p>
              <ol className="text-left text-sm space-y-2 max-w-md mx-auto">
                <li>
                  1. Choose an interview type from the dashboard: Behavioral,
                  Technical, or System Design
                </li>
                <li>
                  2. Start the interview session and speak naturally with the AI
                  interviewer
                </li>
                <li>
                  3. Complete the interview and receive personalized feedback
                </li>
                <li>
                  4. Review past interviews in the Feedback section to track
                  your progress
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Learn how to get the most out of your practice interviews,
              understand the different interview types, and review your
              feedback.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-secondary/10 rounded-md">
                <h4 className="font-medium mb-2">Practice Interviews</h4>
                <p className="text-muted-foreground">
                  Realistic interviews with our AI interviewer in three formats
                </p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-md">
                <h4 className="font-medium mb-2">Personalized Feedback</h4>
                <p className="text-muted-foreground">
                  Get actionable insights on your performance after each session
                </p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-md">
                <h4 className="font-medium mb-2">Track Progress</h4>
                <p className="text-muted-foreground">
                  See your improvement over time with detailed analytics
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {showVideo ? (
          <Button onClick={handleFinishTutorial}>
            I've Finished the Tutorial
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={onDismiss}>
              Skip Tutorial
            </Button>
            <Button onClick={handleWatchTutorial}>Watch Tutorial</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
