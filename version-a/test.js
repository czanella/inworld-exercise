import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const RecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
});

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-4.1",
  input: [
    { role: "system", content: "Extract the recipe information." },
    {
      role: "user",
      content: "https://www.allrecipes.com/recipe/16899/beef-wellington/",
    },
  ],
  text: {
    format: zodTextFormat(RecipeSchema, "recipe"),
  },
});

console.log(response.output_text);
