import prisma from '@/lib/prisma';
import type { UserSettings } from '@prisma/client';

export const userSettingsServer = {
  getByUserId: async (userId: string): Promise<UserSettings | null> => {
    return prisma.userSettings.findUnique({
      where: { userId },
    });
  },

  getOrCreate: async (userId: string): Promise<UserSettings> => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (settings) {
      return settings;
    }

    return prisma.userSettings.create({
      data: { userId },
    });
  },

  update: async (
    userId: string,
    data: {
      isFirstTimeUser?: boolean;
      hasWatchedTutorial?: boolean;
    }
  ): Promise<UserSettings> => {
    return prisma.userSettings.update({
      where: { userId },
      data,
    });
  },
};
