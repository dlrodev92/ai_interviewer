import { NextResponse } from 'next/server';
import { CallConfig } from '@/types/ultravox';

const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;
const API_URL = 'https://api.ultravox.ai/api/calls';

export async function POST(req: Request) {
  if (!ULTRAVOX_API_KEY) {
    console.error('ULTRAVOX_API_KEY is not defined');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const callConfig: CallConfig = await req.json();
    console.log(
      'Calling Ultravox API with config:',
      JSON.stringify(callConfig, null, 2)
    );

    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${ULTRAVOX_API_KEY}`,
      },
      body: JSON.stringify({ ...callConfig }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ultravox API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: `${API_URL}/calls`,
      });
      return NextResponse.json(
        { error: `Ultravox API error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Ultravox API response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Ultravox API:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create call',
      },
      { status: 500 }
    );
  }
}
