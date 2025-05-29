import prisma from '@/lib/prisma';

export async function getUserFeedbacks(userId: string) {
  const feedbacks = await prisma.interviewFeedback.findMany({
    where: { userId },
    include: { categories: true },
    orderBy: { date: 'desc' },
  });

  return feedbacks;
}