import { prisma } from "@/lib/prisma";
import { tool } from "@openai/agents-core";
import { z } from 'zod';

const AddNoteToRecipeSchema = z.object({
  recipeId: z.number(),
  note: z.string(),
});

type AddNoteToRecipeProps = z.infer<typeof AddNoteToRecipeSchema>;

async function addNoteToRecipe({ recipeId, note }: AddNoteToRecipeProps) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { notes: true },
  });

  if (!recipe) {
    throw new Error(`Recipe id "${recipeId}" not found`);
  }

  return prisma.recipe.update({
    where: { id: recipeId },
    data: { notes: { set: [...recipe.notes, note] } },
  });
}

export const addNoteToRecipeTool = tool({
  name: 'add_note_to_recipe',
  description: 'Adds a note to a recipe',
  parameters: AddNoteToRecipeSchema,
  execute: addNoteToRecipe,
});
