-- CreateTable
CREATE TABLE "anonymous_feedback" (
    "id" TEXT NOT NULL,
    "usabilityRating" INTEGER,
    "interviewQualityRating" INTEGER,
    "feedbackHelpfulnessRating" INTEGER,
    "overallExperienceRating" INTEGER,
    "recommendLikelihoodRating" INTEGER,
    "comments" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anonymous_feedback_pkey" PRIMARY KEY ("id")
);
