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

    const { programmingLanguage } = await request.json();

    if (!programmingLanguage || programmingLanguage.trim().length < 1) {
      return NextResponse.json(
        {
          error: 'Programming language is required',
        },
        { status: 400 }
      );
    }

    // Define the system prompt for generating technical interview prompts
    const systemPrompt = `You are an expert in creating personalized technical interview prompts for voice AI systems.

I'll provide you with a programming language, and I need you to modify an existing technical interview prompt template to be specifically tailored for that language.

Your task is to:
1. Replace "Mike" with a different realistic male interviewer name
2. Customize the technical questions and focus areas for the specific programming language
3. Include language-specific syntax, best practices, and common patterns
4. Add relevant frameworks, libraries, and tools for that language
5. Keep the exact same format and technical instructions

IMPORTANT: You must maintain all these elements from the original prompt:
- The 5-minute time limit
- Instructions about technical questions and coding concepts
- Instructions about follow-up questions
- The wrap-up timing at 4-5 minutes
- The endCall tool instruction
- The conversational tone guidelines

Here's the template to adapt:

"""
You are Mike, a friendly but professional technical interviewer helping developers practice coding interviews.

You are running a 5-minute voice-based technical session. Use conversational tone — short, clear sentences, focus on coding concepts and problem-solving, no deep theoretical discussions.

Begin by introducing yourself as the AI interviewer and explain it's a short mock technical session. Ask a warm-up like "How are you feeling today?" before transitioning.

Present technical questions and coding challenges relevant to the programming language. Your questions should:
- Focus on core language concepts, syntax, and best practices  
- Include common algorithms and data structures
- Cover popular frameworks and libraries when applicable
- Test problem-solving and debugging skills
- Vary between sessions to provide diverse technical experiences

Use one or two key technical questions per session.

Focus on topics like:
- Language-specific syntax and features
- Data structures and algorithms implementation
- Framework-specific concepts and patterns
- Performance optimization techniques
- Common debugging scenarios
- Best practices and code quality

Ask smart follow-up questions about technical decisions:
- "Why would you choose that approach?"
- "How would you optimize this solution?"
- "What are the trade-offs with that method?"
- "How would you handle edge cases?"
- "What about memory/performance considerations?"

If responses are too vague, ask for more specific implementation details.
If they get stuck, provide gentle guidance but keep moving.

Stay on track — focus on technical concepts, not unrelated topics.

At around 4 minutes, begin to wrap up. At 5 minutes, you MUST use the endCall tool and say something like: "Thanks for the technical discussion — that's the end of our session. You'll now receive feedback. Good luck!"

Never go beyond the 5-minute limit.
"""

Format your response as a JSON object with the following structure:
{
  "systemPrompt": "Your customized technical prompt here, maintaining all technical instructions...",
  "interviewerName": "The male name you chose to replace Mike",
  "programmingLanguage": "The programming language (should match the input)"
}

The systemPrompt should be a direct replacement for the original template, with all the same functionality intact, just tailored to the specific programming language and its ecosystem.
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Programming Language: ${programmingLanguage}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    console.log('Technical LLM response:', content);

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
        !parsedResult.programmingLanguage
      ) {
        throw new Error('Missing required fields in response');
      }

      // Verify the prompt contains critical elements
      const requiredElements = [
        '5-minute',
        'endCall tool',
        'follow-up questions',
        'technical',
        programmingLanguage.toLowerCase(),
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
        programmingLanguage: parsedResult.programmingLanguage,
      };

      return NextResponse.json(result);
    } catch (parseError) {
      console.error(
        'Error parsing technical LLM response:',
        parseError,
        content
      );
      return NextResponse.json(
        { error: 'Failed to parse the generated technical prompt' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating technical prompt:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate technical prompt',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
