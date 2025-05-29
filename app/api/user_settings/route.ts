// app/api/user/settings/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.settings) {
      const settings = await prisma.userSettings.create({
        data: {
          userId: user.id,
        },
      });

      return NextResponse.json(settings);
    }

    return NextResponse.json(user.settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        isFirstTimeUser:
          data.isFirstTimeUser !== undefined ? data.isFirstTimeUser : undefined,
        hasWatchedTutorial:
          data.hasWatchedTutorial !== undefined
            ? data.hasWatchedTutorial
            : undefined,
      },
      create: {
        userId: user.id,
        isFirstTimeUser:
          data.isFirstTimeUser !== undefined ? data.isFirstTimeUser : true,
        hasWatchedTutorial:
          data.hasWatchedTutorial !== undefined
            ? data.hasWatchedTutorial
            : false,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}
