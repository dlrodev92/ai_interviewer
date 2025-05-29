import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      amount = 1,
      interviewId,
      description = 'Used for interview',
    } = data;

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be positive' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, interviewTokenBalance: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.interviewTokenBalance < amount) {
        throw new Error('Insufficient token balance');
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { interviewTokenBalance: { decrement: amount } },
        select: { interviewTokenBalance: true },
      });

      await tx.interviewTokenTransaction.create({
        data: {
          userId: user.id,
          amount: -amount,
          interviewId,
          description,
        },
      });

      return {
        success: true,
        balance: updatedUser.interviewTokenBalance,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error using tokens:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to use tokens';

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: errorMessage === 'Insufficient token balance' ? 400 : 500 }
    );
  }
}
