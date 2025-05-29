'use client';

import { useState, useEffect } from 'react';
import { userSettingsClient } from '@/services/client/clientUserSettings';
import TutorialPrompt from './TutorialPrompt';

interface DashboardClientProps {
  initialSettings: any;
  userId: string | null;
}

export default function DashboardClient({
  initialSettings,
  userId,
}: DashboardClientProps) {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (
      initialSettings &&
      initialSettings.isFirstTimeUser &&
      !initialSettings.hasWatchedTutorial
    ) {
      setShowTutorial(true);
    }
  }, [initialSettings]);

  const handleTutorialComplete = async () => {
    try {
      await userSettingsClient.markTutorialAsWatched();
      setShowTutorial(false);
    } catch (error) {
      console.error('Failed to update tutorial status:', error);
    }
  };

  const handleTutorialDismiss = async () => {
    if (!userId) return;

    try {
      await userSettingsClient.markTutorialAsWatched();
      setShowTutorial(false);
      console.log('Tutorial dismissed');
    } catch (error) {
      console.error('Failed to update tutorial status:', error);
    }
  };

  if (!showTutorial) {
    return null;
  }

  return (
    <TutorialPrompt
      onComplete={handleTutorialComplete}
      onDismiss={handleTutorialDismiss}
    />
  );
}
