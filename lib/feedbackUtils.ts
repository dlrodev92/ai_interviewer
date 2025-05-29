import { openai } from '@/modules/openai/openai';
import prisma from '@/lib/prisma';

/**
 * Format the transcript for the OpenAI prompt
 */
export function formatTranscript(transcript: any[]) {
  return transcript
    .map((entry) => {
      // Convert 'agent' and 'user' to 'Interviewer' and 'You'
      const speaker = entry.speaker === 'agent' ? 'Interviewer' : 'You';
      return `${entry.timestamp} - ${speaker}: ${entry.text}`;
    })
    .join('\n\n');
}

/**
 * Generate feedback for a behavioral interview
 */
export async function generateBehavioralFeedback(transcript: any[]) {
  const formattedTranscript = formatTranscript(transcript);
  console.log(
    `Formatted behavioral transcript (first 200 chars): ${formattedTranscript.substring(0, 200)}...`
  );

  const prompt = `
You are an expert interview coach analyzing a behavioral interview.
Below is a transcript from an interview. Generate detailed feedback following this structure:

1. A descriptive title for this interview session
2. An overall score between 1-5 (to one decimal place)
3. A detailed summary paragraph of the candidate's performance
4. 3-5 key strengths demonstrated by the candidate
5. 2-4 areas for improvement
6. Detailed scoring and comments for these categories (score each from 1-5):
   - Communication Skills
   - Problem Solving
   - Leadership & Teamwork
   - Cultural Fit
   - Adaptability

Interview Transcript:
${formattedTranscript}

Format the output as a valid JSON object with these keys:
{
  "title": "String - Descriptive title of the interview",
  "overallScore": "Number - Overall score (1-5, one decimal)",
  "summary": "String - Detailed performance summary",
  "strengths": ["String array - 3-5 key strengths"],
  "improvements": ["String array - 2-4 areas for improvement"],
  "categories": [
    {
      "name": "String - Category name",
      "score": "Number - Score for category (1-5)",
      "description": "String - Detailed feedback for this category"
    }
  ],
  "type": "Behavioral",
  "duration": 5
}

Include specific behavioral insights where appropriate and be honest but constructive in your feedback.
`;

  return await callOpenAI(prompt, 'behavioral');
}

/**
 * Generate feedback for a technical interview
 */
export async function generateTechnicalFeedback(
  transcript: any[],
  programmingLanguage?: string
) {
  const formattedTranscript = formatTranscript(transcript);
  console.log(
    `Formatted technical transcript (first 200 chars): ${formattedTranscript.substring(0, 200)}...`
  );

  // Include programming language in the prompt if provided
  const languageSpecific = programmingLanguage
    ? `This is specifically a ${programmingLanguage} technical interview. Focus your feedback on ${programmingLanguage}-specific concepts and best practices where evident.`
    : '';

  const prompt = `
You are an expert interview coach analyzing a technical coding interview.
${languageSpecific}
Below is a transcript from an interview. Generate detailed feedback following this structure:

1. A descriptive title for this interview session${programmingLanguage ? ` (include ${programmingLanguage} in the title)` : ''}
2. An overall score between 1-5 (to one decimal place)
3. A detailed summary paragraph of the candidate's technical performance
4. 3-5 key strengths demonstrated by the candidate
5. 2-4 areas for improvement
6. Detailed scoring and comments for these categories (score each from 1-5):
   - Technical Knowledge${programmingLanguage ? ` (specific to ${programmingLanguage})` : ''}
   - Problem Solving
   - Code Quality & Best Practices
   - Communication of Technical Concepts
   - Debugging & Troubleshooting Skills

Interview Transcript:
${formattedTranscript}

Format the output as a valid JSON object with these keys:
{
  "title": "String - Descriptive title of the interview",
  "overallScore": "Number - Overall score (1-5, one decimal)",
  "summary": "String - Detailed performance summary",
  "strengths": ["String array - 3-5 key strengths"],
  "improvements": ["String array - 2-4 areas for improvement"],
  "categories": [
    {
      "name": "String - Category name",
      "score": "Number - Score for category (1-5)",
      "description": "String - Detailed feedback for this category"
    }
  ],
  "type": "Technical",
  "duration": 5
}

Include specific technical insights${programmingLanguage ? ` related to ${programmingLanguage}` : ''} where appropriate and be honest but constructive in your feedback.
`;

  return await callOpenAI(prompt, 'technical');
}

/**
 * Generate feedback for a system design interview
 */
export async function generateSystemDesignFeedback(
  transcript: any[],
  technologyStack?: string
) {
  const formattedTranscript = formatTranscript(transcript);
  console.log(
    `Formatted system design transcript (first 200 chars): ${formattedTranscript.substring(0, 200)}...`
  );

  // Include technology stack in the prompt if provided
  const techSpecific = technologyStack
    ? `This is specifically a system design interview focused on ${technologyStack}. Tailor your feedback to ${technologyStack}-specific concepts and best practices where evident.`
    : '';

  const prompt = `
You are an expert interview coach analyzing a system design interview.
${techSpecific}
Below is a transcript from an interview. Generate detailed feedback following this structure:

1. A descriptive title for this system design interview session${technologyStack ? ` (include ${technologyStack} in the title)` : ''}
2. An overall score between 1-5 (to one decimal place)
3. A detailed summary paragraph of the candidate's system design approach
4. 3-5 key strengths demonstrated by the candidate
5. 2-4 areas for improvement
6. Detailed scoring and comments for these categories (score each from 1-5):
   - Architecture Knowledge
   - Scalability Considerations
   - Trade-off Analysis
   - Communication of Design Decisions
   - Problem-Solving Approach
   - Technical Depth

Interview Transcript:
${formattedTranscript}

Format the output as a valid JSON object with these keys:
{
  "title": "String - Descriptive title of the interview",
  "overallScore": "Number - Overall score (1-5, one decimal)",
  "summary": "String - Detailed performance summary",
  "strengths": ["String array - 3-5 key strengths"],
  "improvements": ["String array - 2-4 areas for improvement"],
  "categories": [
    {
      "name": "String - Category name",
      "score": "Number - Score for category (1-5)",
      "description": "String - Detailed feedback for this category"
    }
  ],
  "type": "System Design",
  "duration": 5
}

Include specific architecture and design insights${technologyStack ? ` related to ${technologyStack}` : ''} where appropriate and be honest but constructive in your feedback.
`;

  return await callOpenAI(prompt, 'system design');
}

/**
 * Make the OpenAI API call and handle the response
 */
async function callOpenAI(prompt: string, feedbackType: string) {
  try {
    // Call the OpenAI API
    console.log(
      `Sending prompt to OpenAI for ${feedbackType} interview feedback...`
    );
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini', // Use appropriate model based on your OpenAI setup
      messages: [
        {
          role: 'system',
          content:
            'You are an expert interview coach providing detailed feedback.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    try {
      const feedbackContent = JSON.parse(content);
      console.log(
        `Generated ${feedbackType} feedback:`,
        JSON.stringify(feedbackContent, null, 2).substring(0, 200) + '...'
      );
      return feedbackContent;
    } catch (err) {
      console.error('Error parsing OpenAI response:', content);
      throw new Error('Failed to parse feedback generation response');
    }
  } catch (error) {
    console.error(
      `Error generating ${feedbackType} feedback with OpenAI:`,
      error
    );
    throw new Error(
      `Failed to generate ${feedbackType} feedback with AI: ` +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

/**
 * Store the generated feedback in the database
 */
export async function storeFeedbackInDatabase(
  feedbackData,
  userId: string,
  interviewId: string,
  transcript
) {
  // Store the feedback in the database using a transaction
  const feedback = await prisma.$transaction(async (tx) => {
    // Create the main feedback record
    const newFeedback = await tx.interviewFeedback.create({
      data: {
        title: feedbackData.title,
        date: new Date(),
        duration: feedbackData.duration || 5, // Default to 5 minutes
        type: feedbackData.type || 'Behavioral', // Default type
        overallScore: feedbackData.overallScore,
        summary: feedbackData.summary,
        hasTranscript: transcript && transcript.length > 0,
        hasRecording: false, // Assume no recording for now
        interviewId: interviewId,
        userId: userId,
      },
    });

    // Create categories
    if (feedbackData.categories && feedbackData.categories.length > 0) {
      await Promise.all(
        feedbackData.categories.map((category) =>
          tx.feedbackCategory.create({
            data: {
              name: category.name,
              score: category.score,
              description: category.description,
              feedbackId: newFeedback.id,
            },
          })
        )
      );
    }

    // Create strengths
    if (feedbackData.strengths && feedbackData.strengths.length > 0) {
      await Promise.all(
        feedbackData.strengths.map((text) =>
          tx.feedbackStrength.create({
            data: {
              text,
              feedbackId: newFeedback.id,
            },
          })
        )
      );
    }

    // Create improvements
    if (feedbackData.improvements && feedbackData.improvements.length > 0) {
      await Promise.all(
        feedbackData.improvements.map((text) =>
          tx.feedbackImprovement.create({
            data: {
              text,
              feedbackId: newFeedback.id,
            },
          })
        )
      );
    }

    // Create transcript entries
    if (transcript && transcript.length > 0) {
      await Promise.all(
        transcript.map((entry, index) =>
          tx.transcriptEntry.create({
            data: {
              speaker: entry.speaker === 'agent' ? 'Interviewer' : 'You',
              text: entry.text,
              timestamp: entry.timestamp || `00:${index * 10}`, // Default timestamp if missing
              orderIndex: index,
              feedbackId: newFeedback.id,
            },
          })
        )
      );
    }

    // Return the created feedback record with its ID
    return newFeedback;
  });

  return feedback;
}
