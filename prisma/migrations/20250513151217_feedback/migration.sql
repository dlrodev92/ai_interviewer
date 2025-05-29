-- CreateTable
CREATE TABLE "InterviewFeedback" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "recordingUrl" TEXT,
    "hasTranscript" BOOLEAN NOT NULL DEFAULT false,
    "hasRecording" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "interviewId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackStrength" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackStrength_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackImprovement" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackImprovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptEntry" (
    "id" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranscriptEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewFeedback_userId_idx" ON "InterviewFeedback"("userId");

-- CreateIndex
CREATE INDEX "FeedbackCategory_feedbackId_idx" ON "FeedbackCategory"("feedbackId");

-- CreateIndex
CREATE INDEX "FeedbackStrength_feedbackId_idx" ON "FeedbackStrength"("feedbackId");

-- CreateIndex
CREATE INDEX "FeedbackImprovement_feedbackId_idx" ON "FeedbackImprovement"("feedbackId");

-- CreateIndex
CREATE INDEX "TranscriptEntry_feedbackId_idx" ON "TranscriptEntry"("feedbackId");

-- CreateIndex
CREATE INDEX "TranscriptEntry_feedbackId_orderIndex_idx" ON "TranscriptEntry"("feedbackId", "orderIndex");

-- AddForeignKey
ALTER TABLE "InterviewFeedback" ADD CONSTRAINT "InterviewFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackCategory" ADD CONSTRAINT "FeedbackCategory_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "InterviewFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackStrength" ADD CONSTRAINT "FeedbackStrength_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "InterviewFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackImprovement" ADD CONSTRAINT "FeedbackImprovement_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "InterviewFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptEntry" ADD CONSTRAINT "TranscriptEntry_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "InterviewFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
