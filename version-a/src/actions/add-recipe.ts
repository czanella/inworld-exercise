'use server'
import { RecipeSchema } from "@/schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

export async function addRecipe(url: string) {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: [
      { role: "system", content: "Extract the recipe information." },
      {
        role: "user",
        content: url,
      },
    ],
    text: {
      format: zodTextFormat(RecipeSchema, "recipe"),
    },
  });

  return JSON.parse(response.output_text);
}
