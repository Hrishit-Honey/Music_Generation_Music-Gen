
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const moods: Record<string, string> = {
  Happy: 'Pop, Guitar, birdsong, ambient beats',
  Sad: 'Soft, piano, rainfall, pink noise',
  Sleepy: 'Ambient, flute, ocean waves, brown noise',
  Exciting: 'Funk, Guitar, river stream, Rhythmic drumming',
  Spiritual: 'Ambient, violin, Forest ambience, Rhythmic Drumming',
  Peaceful: 'Soothing, piano, ocean waves, brown noise',
  Motivated: 'Pop, guitar, birdsong, ambient beats',
  Calm: 'Jazz, flute, rainfall, pink noise',
  Stress: 'Soothing, violin, forest ambience, brown noise',
};

export async function POST(request: NextRequest) {
  const { mood, details } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Provide just one prompt(few words only) for ${mood} where these are again prompts for music generation webapp. With respect to: ${details}`,
        },
      ],
      max_tokens: 50,
    });

    const choice = completion.choices && completion.choices[0];
    const prompt = choice && choice.message && choice.message.content ? choice.message.content.trim() : 'No prompt available';

    if (!prompt) {
      console.error('Prompt not found in the response');
      throw new Error('Prompt not found');
    }

    return NextResponse.json({ prompt }, { status: 200 });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json({ error: 'Error generating prompt' }, { status: 500 });
  }
}
