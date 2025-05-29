import { apiHandler } from '@/core/apiHandler';
import type { UserSettings } from '@prisma/client';

type UserSettingsUpdate = {
  isFirstTimeUser?: boolean;
  hasWatchedTutorial?: boolean;
};

export const userSettingsClient = {
  getSettings: () => {
    return apiHandler.get<UserSettings>('/api/user_settings');
  },

  updateSettings: (settings: UserSettingsUpdate) => {
    return apiHandler.put<UserSettings>('/api/user_settings', settings);
  },

  markTutorialAsWatched: () => {
    return apiHandler.put<UserSettings>('/api/user_settings', {
      hasWatchedTutorial: true,
    });
  },
};
