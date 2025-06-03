import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
}
