import prisma from '@/lib/prisma';

export async function deleteFeedback(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/feedback/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to delete feedback',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Gets all feedback for the current user
 * @returns Feedback data or error
 */
export async function getUserFeedbacks() {
  try {
    const response = await fetch('/api/feedback');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch feedbacks');
    }

    return data.feedbacks;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
}

export async function getFeedbackById(id: string, userId: string) {
  const dbFeedback = await prisma.interviewFeedback.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      categories: true,
      strengths: true,
      improvements: true,
      transcript: {
        orderBy: {
          orderIndex: 'asc',
        },
      },
    },
  });

  if (!dbFeedback) {
    return null;
  }

  return {
    id: dbFeedback.id,
    title: dbFeedback.title,
    date: dbFeedback.date,
    duration: dbFeedback.duration,
    type: dbFeedback.type,
    overallScore: dbFeedback.overallScore,
    summary: dbFeedback.summary,
    hasTranscript: dbFeedback.hasTranscript,
    hasRecording: dbFeedback.hasRecording,
    recordingUrl: dbFeedback.recordingUrl,
    categories: dbFeedback.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      score: cat.score,
      description: cat.description,
    })),
    strengths: dbFeedback.strengths.map((s) => s.text),
    improvements: dbFeedback.improvements.map((i) => i.text),
    transcript: dbFeedback.transcript.map((entry) => ({
      id: entry.id,
      speaker: entry.speaker,
      text: entry.text,
      timestamp: entry.timestamp,
    })),
    interviewId: dbFeedback.interviewId,
  };
}
