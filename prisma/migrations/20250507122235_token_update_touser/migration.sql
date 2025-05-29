/*
  Warnings:

  - You are about to drop the `TokenTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TokenTransaction" DROP CONSTRAINT "TokenTransaction_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "interviewTokenBalance" INTEGER NOT NULL DEFAULT 99;

-- DropTable
DROP TABLE "TokenTransaction";

-- CreateTable
CREATE TABLE "InterviewTokenTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "interviewId" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewTokenTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewTokenTransaction" ADD CONSTRAINT "InterviewTokenTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
