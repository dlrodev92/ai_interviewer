import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to submit feedback' },
        { status: 401 }
      );
    }

    const feedbackData = await request.json();

    const feedback = await prisma.anonymousFeedback.create({
      data: {
        submittedAt: new Date(),
        comments: feedbackData.additional_comments || null,
        usabilityRating: feedbackData.ratings.usability || null,
        interviewQualityRating: feedbackData.ratings.interview_quality || null,
        feedbackHelpfulnessRating:
          feedbackData.ratings.feedback_helpfulness || null,
        overallExperienceRating:
          feedbackData.ratings.overall_experience || null,
        recommendLikelihoodRating:
          feedbackData.ratings.recommend_likelihood || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        id: feedback.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
