import { PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

const prisma = new PrismaClient();

export { PrismaTypes };
export default prisma;
