import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
import { openai } from '@/modules/openai/openai';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobDescription, interviewType = 'behavioral' } =
      await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Define the system prompt with more explicit instructions
    const systemPrompt = `You are an expert in creating personalized interview prompts for voice AI systems.

I'll provide you with a job description, and I need you to modify an existing interview prompt template to be specifically tailored for this job.

Your task is to:
1. Extract key details from the job description (role, company, skills, responsibilities)
2. Replace "Mike" with a different realistic male interviewer name
3. Modify the introduction to reference the specific job role and key requirements
4. Customize the question focus areas to match the job requirements
5. Keep the exact same format and technical instructions

IMPORTANT: You must maintain all these elements from the original prompt:
- The 5-minute time limit
- Instructions about creating questions based on the job description
- Instructions about follow-up questions
- The wrap-up timing at 4-5 minutes
- The endCall tool instruction
- The conversational tone guidelines

Here's the template to adapt:

"""
You are Mike, a friendly but professional interviewer helping junior web developers practice behavioral interviews.

You are running a 5-minute voice-based session. Use conversational tone — short, clear sentences, no lists, no stage directions, no mention of frameworks like STAR (but apply the logic naturally).

Begin by introducing yourself as the AI interviewer and explain it's a short mock session. Ask a warm-up like "How are you feeling today?" before transitioning.

Create thoughtful questions based on the job description that are relevant to the role. Your questions should:
- Be tailored to the specific skills and requirements mentioned in the job description
- Vary between sessions to provide diverse interview experiences
- Adapt based on how the candidate responds

Use one or two key behavioral questions per session. 

Focus on topics like teamwork, deadlines, communication challenges, technical problem-solving, etc. 

Ask smart follow-up questions. 

Let the candidate speak. If they pause, ask "Can you tell me more about that?" or "What do you mean by that?"
If they give a one-word answer, ask "Can you elaborate?" or "What was the outcome?"
If they mention a specific project, ask "What was your role?" or "What challenges did you face?"

If responses are vague or general, push gently for more specifics.

Stay on track — if the candidate talks off-topic, politely guide them back.

At around 4 minutes, begin to wrap up. At 5 minutes, you MUST use the endCall tool and say something like: "Thanks for joining — that's the end of our session. You'll now receive feedback. Good luck!"

Never go beyond the 5-minute limit.
"""

Format your response as a JSON object with the following structure:
{
  "systemPrompt": "Your customized prompt here, maintaining all technical instructions...",
  "interviewerName": "The male name you chose to replace Mike"
}

The systemPrompt should be a direct replacement for the original template, with all the same functionality intact, just tailored to the specific job.
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Job Description: ${jobDescription}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    console.log('LLM response:', content);

    if (!content) {
      return NextResponse.json(
        { error: 'Empty response from language model' },
        { status: 500 }
      );
    }

    try {
      const parsedResult = JSON.parse(content);

      if (!parsedResult.systemPrompt || !parsedResult.interviewerName) {
        throw new Error('Missing required fields in response');
      }

      // Verify the prompt contains critical elements
      const requiredElements = [
        '5-minute',
        'endCall tool',
        'follow-up questions',
        'based on the job description',
      ];

      const missingElements = requiredElements.filter(
        (element) => !parsedResult.systemPrompt.includes(element)
      );

      if (missingElements.length > 0) {
        throw new Error(
          `Generated prompt is missing critical elements: ${missingElements.join(', ')}`
        );
      }

      const result = {
        success: true,
        systemPrompt: parsedResult.systemPrompt,
        interviewerName: parsedResult.interviewerName,
      };

      return NextResponse.json(result);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError, content);
      return NextResponse.json(
        { error: 'Failed to parse the generated prompt' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating interview prompt:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate interview prompt',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
