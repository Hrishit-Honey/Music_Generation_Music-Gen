
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/musicgen-small';
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await axios.post(HUGGING_FACE_API_URL, {
      inputs: prompt,
    }, {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    });

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error: any) {
    console.error('Error generating music:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to generate music' }, { status: 500 });
  }
};
