'use server'
import { prisma } from '@/lib/prisma';
import { RecipeSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

export async function addRecipe(url: string) {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL,
    input: [
      { role: 'system', content: 'Extract the recipe information.' },
      {
        role: 'user',
        content: url,
      },
    ],
    text: {
      format: zodTextFormat(RecipeSchema, 'recipe'),
    },
  });

  const recipe = JSON.parse(response.output_text);

  const newRecipe = await prisma.recipe.create({
    data: {
      title: recipe.title,
      cookTime: recipe.cookTime ?? 0,
      prepTime: recipe.prepTime ?? 0,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    },
  });

  revalidatePath('/profile');
  return newRecipe;
}
