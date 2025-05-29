import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// DELETE handler for feedback
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the feedback ID from the route parameters
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback ID is required',
        },
        { status: 400 }
      );
    }

    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Get the user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check if the feedback exists and belongs to the user
    const feedback = await prisma.interviewFeedback.findUnique({
      where: {
        id,
        userId: user.id, // Ensure the feedback belongs to the current user
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

    // Delete all related records in a transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // Delete categories
      await tx.feedbackCategory.deleteMany({
        where: {
          feedbackId: id,
        },
      });

      // Delete strengths
      await tx.feedbackStrength.deleteMany({
        where: {
          feedbackId: id,
        },
      });

      // Delete improvements
      await tx.feedbackImprovement.deleteMany({
        where: {
          feedbackId: id,
        },
      });

      // Delete transcript entries
      await tx.transcriptEntry.deleteMany({
        where: {
          feedbackId: id,
        },
      });

      // Delete the feedback itself
      await tx.interviewFeedback.delete({
        where: {
          id,
        },
      });
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
