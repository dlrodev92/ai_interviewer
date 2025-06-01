import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    notFound();
  }

  return user;
}
