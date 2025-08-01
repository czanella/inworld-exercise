'use server'
import { float32ToWav } from "@/lib/float32ToWav";
import OpenAI from "openai";

export async function speechToText(samples: Float32Array) {
  const openai = new OpenAI();
  const wavAudio = float32ToWav(samples);
  const transcription = await openai.audio.transcriptions.create({
    file: wavAudio,
    model: "gpt-4o-transcribe",
    response_format: "text",
  });

  return transcription;
}
