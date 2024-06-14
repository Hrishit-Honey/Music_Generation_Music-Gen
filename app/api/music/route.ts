import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/musicgen-small';
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

const saveAudioBlob = (buffer: Buffer, filename: string) => {
  const filePath = path.join(process.cwd(), 'public', filename);
  fs.writeFileSync(filePath, buffer);
};

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json();

    if (!HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY is not defined');
    }

    const response = await axios.post(HUGGING_FACE_API_URL, { prompt }, {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);
    const filename = `generated_music.wav`;
    saveAudioBlob(buffer, filename);

    return NextResponse.json({ prompt, url: `/${filename}` });
  } catch (error: any) {
    console.error('Error generating music:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to generate music', prompt: null }, { status: 500 });
  }
};

