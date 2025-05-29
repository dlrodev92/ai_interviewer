import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import {
  generateBehavioralFeedback,
  storeFeedbackInDatabase,
} from '@/lib/feedbackUtils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get interview data from the request
    const { interviewId, transcript } = await request.json();

    if (!interviewId) {
      return NextResponse.json(
        { error: 'Interview ID is required' },
        { status: 400 }
      );
    }

    // Get the user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log(
      `Generating feedback for behavioral interview ID: ${interviewId}`
    );

    // Check if we received a transcript in the request
    let transcriptData = transcript;

    // If no transcript data was provided in the request, try to retrieve it from storage
    if (!transcriptData || transcriptData.length === 0) {
      console.log(
        'No transcript provided in request, attempting to retrieve from storage'
      );
      transcriptData = await retrieveTranscriptFromStorage(interviewId);
    } else {
      console.log(
        `Using transcript from request with ${transcriptData.length} entries`
      );
    }

    if (!transcriptData || transcriptData.length === 0) {
      return NextResponse.json(
        { error: 'No transcript data found for this interview' },
        { status: 404 }
      );
    }

    // Generate behavioral feedback
    const feedback = await generateBehavioralFeedback(transcriptData);

    // Store the generated feedback in the database
    const result = await storeFeedbackInDatabase(
      feedback,
      user.id,
      interviewId,
      transcriptData
    );

    return NextResponse.json({
      success: true,
      feedback: {
        id: result.id,
        title: result.title,
      },
    });
  } catch (error) {
    console.error('Error generating behavioral feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }

async function retrieveTranscriptFromStorage(interviewId: string) {
  console.log(
    'WARNING: Using mock transcript data - this should be replaced with actual storage retrieval'
  );

  // In a production system, you would query your database here based on interviewId
  // For now, return mock data with a generic interview
  return [
    {
      speaker: 'agent',
      text: "Hello, I'm an AI interviewer, and I'll be conducting your behavioral interview today. How are you feeling?",
      timestamp: '00:00',
    },
    {
      speaker: 'user',
      text: "I'm doing well, thanks for asking.",
      timestamp: '00:15',
    },
    {
      speaker: 'agent',
      text: "Great! Let's get started with some questions about your past experiences.",
      timestamp: '00:25',
    },
    { speaker: 'user', text: "Sounds good, I'm ready.", timestamp: '00:35' },
    {
      speaker: 'agent',
      text: 'Could you tell me about a time when you had to deal with a difficult team member?',
      timestamp: '00:45',
    },
    {
      speaker: 'user',
      text: 'Sure. I once worked with a colleague who was consistently missing deadlines...',
      timestamp: '01:00',
    },
  ];
}
