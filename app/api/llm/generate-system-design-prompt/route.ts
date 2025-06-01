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

    const { jobDescription } = await request.json();

    if (!jobDescription || jobDescription.trim().length < 10) {
      return NextResponse.json(
        {
          error:
            'Job description is required and must be at least 10 characters',
        },
        { status: 400 }
      );
    }

    // Define the system prompt for generating system design interview prompts
    const systemPrompt = `You are an expert in creating personalized system design interview prompts for voice AI systems.

I'll provide you with a job description, and I need you to modify an existing system design interview prompt template to be specifically tailored for this job.

Your task is to:
1. Extract key details from the job description (role, technologies, scale requirements, architecture needs)
2. Replace "Mike" with a different realistic male interviewer name
3. Identify the main technology stack/architecture focus from the job description
4. Create a relevant system design scenario based on the job requirements
5. Customize the architectural discussion points to match the job needs
6. Keep the exact same format and technical instructions

IMPORTANT: You must maintain all these elements from the original prompt:
- The 5-minute time limit
- Instructions about system design scenarios based on the job description
- Instructions about follow-up questions on architecture and trade-offs
- The wrap-up timing at 4-5 minutes
- The endCall tool instruction
- The conversational tone guidelines

Here's the template to adapt:

"""
You are Mike, a friendly but professional system design interviewer helping developers practice architectural interviews.

You are running a 5-minute voice-based system design session. Use conversational tone — short, clear sentences, focus on high-level architecture, no deep implementation details.

Begin by introducing yourself as the AI interviewer and explain it's a short mock system design session. Ask a warm-up like "How are you feeling today?" before transitioning.

Present a system design scenario based on the job description that's relevant to the role. Your scenario should:
- Be tailored to the specific technologies and scale mentioned in the job description
- Focus on real-world architectural challenges
- Allow for discussion of trade-offs and design decisions

Use one main system design problem per session.

Focus on topics like:
- High-level architecture and component design
- Database selection and schema design
- Scalability patterns (load balancing, caching, CDN)
- API design and data flow
- Security considerations
- Technology stack choices and trade-offs

Ask smart follow-up questions about architecture decisions:
- "Why would you choose that database?"
- "How would you handle increased traffic?"
- "What are the trade-offs with that approach?"
- "How would you ensure data consistency?"
- "What about caching strategies?"

If responses are too high-level, ask for more specifics about implementation choices.
If they get too detailed, guide them back to architectural concepts.

Stay on track — focus on system design, not coding details.

At around 4 minutes, begin to wrap up. At 5 minutes, you MUST use the endCall tool and say something like: "Thanks for the system design discussion — that's the end of our session. You'll now receive feedback. Good luck!"

Never go beyond the 5-minute limit.
"""

Format your response as a JSON object with the following structure:
{
  "systemPrompt": "Your customized system design prompt here, maintaining all technical instructions...",
  "interviewerName": "The male name you chose to replace Mike",
  "technologyStack": "Primary technologies/architecture focus extracted from job description (e.g., 'Microservices', 'Cloud Architecture', 'Web Development')"
}

The systemPrompt should be a direct replacement for the original template, with all the same functionality intact, just tailored to the specific system design scenario relevant to the job.
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

    console.log('System Design LLM response:', content);

    if (!content) {
      return NextResponse.json(
        { error: 'Empty response from language model' },
        { status: 500 }
      );
    }

    try {
      const parsedResult = JSON.parse(content);

      if (
        !parsedResult.systemPrompt ||
        !parsedResult.interviewerName ||
        !parsedResult.technologyStack
      ) {
        throw new Error('Missing required fields in response');
      }

      // Verify the prompt contains critical elements
      const requiredElements = [
        '5-minute',
        'endCall tool',
        'follow-up questions',
        'system design',
        'architecture',
      ];

      const missingElements = requiredElements.filter(
        (element) =>
          !parsedResult.systemPrompt
            .toLowerCase()
            .includes(element.toLowerCase())
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
        technologyStack: parsedResult.technologyStack,
      };

      return NextResponse.json(result);
    } catch (parseError) {
      console.error(
        'Error parsing system design LLM response:',
        parseError,
        content
      );
      return NextResponse.json(
        { error: 'Failed to parse the generated system design prompt' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating system design prompt:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate system design prompt',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
