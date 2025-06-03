import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma, { PrismaTypes } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface TokenUsePayload {
  amount?: number;
  interviewId?: string;
  description?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      amount = 1,
      interviewId,
      description = 'Used for interview',
    }: TokenUsePayload = await request.json();

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be positive' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx: PrismaTypes.TransactionClient) => {
        const user = await tx.user.findUniqueOrThrow({
          where: { email },
          select: { id: true, interviewTokenBalance: true },
        });

        if (user.interviewTokenBalance < amount) {
          throw new Error('Insufficient token balance');
        }

        const [updatedUser] = await Promise.all([
          tx.user.update({
            where: { id: user.id },
            data: { interviewTokenBalance: { decrement: amount } },
            select: { interviewTokenBalance: true },
          }),
          tx.interviewTokenTransaction.create({
            data: {
              userId: user.id,
              amount: -amount,
              interviewId,
              description,
            },
          }),
        ]);

        return {
          success: true,
          balance: updatedUser.interviewTokenBalance,
        };
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error using tokens:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to use tokens';

    const status = errorMessage === 'Insufficient token balance' ? 400 : 500;

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status }
    );
  }
}
