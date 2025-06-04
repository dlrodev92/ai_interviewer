import type { Prisma } from '@prisma/client';

type RawFeedback = Prisma.InterviewFeedbackGetPayload<{
  include: { categories: true };
}>;

type MappedFeedback = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  type: string;
  hasTranscript: boolean;
  hasRecording: boolean;
  overallScore: number;
  categories: {
    name: string;
    score: number;
  }[];
};

export function mapFeedbacks(feedbacks: RawFeedback[]): MappedFeedback[] {
  return feedbacks.map((feedback) => ({
    id: feedback.id,
    title: feedback.title,
    date: feedback.date,
    duration: feedback.duration,
    type: feedback.type,
    hasTranscript: feedback.hasTranscript,
    hasRecording: feedback.hasRecording,
    overallScore: feedback.overallScore,
    categories: feedback.categories.map((cat) => ({
      name: cat.name,
      score: cat.score,
    })),
  }));
}
