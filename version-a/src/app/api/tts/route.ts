// app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(req: NextRequest) {
  const openai = new OpenAI();

  try {
    const { text, voice = 'alloy' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text input' }, { status: 400 });
    }

    const mp3Stream = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
      response_format: 'mp3',
    });

    const streamBuffer = await mp3Stream.arrayBuffer();

    return new NextResponse(streamBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
