import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  const feedback = await prisma.interviewFeedback.findUnique({
    where: { id, userId: user.id },
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

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const deletions = [
      tx.feedbackCategory.deleteMany({ where: { feedbackId: id } }),
      tx.feedbackStrength.deleteMany({ where: { feedbackId: id } }),
      tx.feedbackImprovement.deleteMany({ where: { feedbackId: id } }),
      tx.transcriptEntry.deleteMany({ where: { feedbackId: id } }),
      tx.interviewFeedback.delete({ where: { id } }),
    ];
    await Promise.all(deletions);
  });

  return NextResponse.json({
    success: true,
    message: 'Feedback deleted successfully',
  });
}