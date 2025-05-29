// /app/api/feedback/technical/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { openai } from '@/modules/openai/openai';
import {
  generateTechnicalFeedback,
  storeFeedbackInDatabase,
} from '@/lib/feedbackUtils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get interview data from the request
    const { interviewId, transcript, programmingLanguage } =
      await request.json();

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
      `Generating feedback for technical interview ID: ${interviewId}`
    );
    if (programmingLanguage) {
      console.log(`Programming language: ${programmingLanguage}`);
    }

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

    // Generate technical feedback, passing the programming language if available
    const feedback = await generateTechnicalFeedback(
      transcriptData,
      programmingLanguage
    );

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
    console.error('Error generating technical feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Function to retrieve transcript from storage - only used as fallback
async function retrieveTranscriptFromStorage(interviewId: string) {
  console.log(
    'WARNING: Using mock transcript data - this should be replaced with actual storage retrieval'
  );

  // Extract programming language from interview ID if possible
  let programmingLanguage = '';
  if (interviewId.startsWith('tech_interview_')) {
    const parts = interviewId.split('_');
    if (parts.length >= 3) {
      programmingLanguage = parts[2];
    }
  }

  // In a production system, you would query your database here based on interviewId
  // For now, return mock data with a generic technical interview
  return [
    {
      speaker: 'agent',
      text: `Hello, I'm an AI interviewer, and I'll be conducting your technical ${programmingLanguage} interview today. How are you feeling?`,
      timestamp: '00:00',
    },
    {
      speaker: 'user',
      text: 'A bit nervous, but ready to go.',
      timestamp: '00:15',
    },
    {
      speaker: 'agent',
      text: "That's completely normal. Let's start with some coding questions.",
      timestamp: '00:25',
    },
    { speaker: 'user', text: 'Sounds good.', timestamp: '00:35' },
    {
      speaker: 'agent',
      text: 'Could you explain how you would implement a function to reverse a string?',
      timestamp: '00:45',
    },
    {
      speaker: 'user',
      text: 'Sure. I would iterate through the string from the end to the beginning...',
      timestamp: '01:00',
    },
  ];
}
