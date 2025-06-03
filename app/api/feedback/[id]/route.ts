import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const feedback = await prisma.interviewFeedback.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found or does not belong to this user',
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.feedbackCategory.deleteMany({ where: { feedbackId: id } });
      await tx.feedbackStrength.deleteMany({ where: { feedbackId: id } });
      await tx.feedbackImprovement.deleteMany({ where: { feedbackId: id } });
      await tx.transcriptEntry.deleteMany({ where: { feedbackId: id } });
      await tx.interviewFeedback.delete({ where: { id } });
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
