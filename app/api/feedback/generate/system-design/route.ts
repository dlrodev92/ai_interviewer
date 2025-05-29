// /app/api/feedback/systemdesign/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { openai } from '@/modules/openai/openai';
import {
  generateSystemDesignFeedback,
  storeFeedbackInDatabase,
} from '@/lib/feedbackUtils';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get interview data from the request
    const { interviewId, transcript, technologyStack } = await request.json();

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
      `Generating feedback for system design interview ID: ${interviewId}`
    );
    if (technologyStack) {
      console.log(`Technology stack: ${technologyStack}`);
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

    // Generate system design feedback, passing the technology stack if available
    const feedback = await generateSystemDesignFeedback(
      transcriptData,
      technologyStack
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
    console.error('Error generating system design feedback:', error);
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

  // Extract technology stack from interview ID if possible
  let technologyStack = '';
  if (interviewId.startsWith('system_design_interview_')) {
    // Try to extract technology info from interview ID if available
    // This is just a placeholder for actual database retrieval
    technologyStack = 'Web Architecture';
  }

  // In a production system, you would query your database here based on interviewId
  // For now, return mock data with a generic system design interview
  return [
    {
      speaker: 'agent',
      text: `Hello, I'm an AI interviewer, and I'll be conducting your system design interview focused on ${technologyStack || 'architecture'} today. How are you feeling?`,
      timestamp: '00:00',
    },
    {
      speaker: 'user',
      text: 'Ready to discuss system design challenges.',
      timestamp: '00:15',
    },
    {
      speaker: 'agent',
      text: "Great! Let's dive in. Imagine you're designing a large-scale social media platform. How would you approach this?",
      timestamp: '00:25',
    },
    {
      speaker: 'user',
      text: 'I would start by identifying the key components and requirements...',
      timestamp: '00:35',
    },
    {
      speaker: 'agent',
      text: 'Good start. Can you elaborate on how you would handle the scaling challenges?',
      timestamp: '01:15',
    },
    {
      speaker: 'user',
      text: 'For scaling, I would implement a microservices architecture with horizontal scaling capabilities...',
      timestamp: '01:30',
    },
  ];
}
