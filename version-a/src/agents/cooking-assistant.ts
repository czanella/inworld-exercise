import { Agent, tool } from "@openai/agents";
import { z } from 'zod';

const AddNoteToRecipeSchema = z.object({
  recipeId: z.number(),
  note: z.string(),
});

type AddNoteToRecipeProps = z.infer<typeof AddNoteToRecipeSchema>;

async function addNoteToRecipe({ recipeId, note }: AddNoteToRecipeProps) {
  console.log('addNoteToRecipe', recipeId, note);
}

const addNoteToRecipeTool = tool({
  name: 'add_note_to_recipe',
  description: 'Adds a note to a recipe',
  parameters: AddNoteToRecipeSchema,
  execute: addNoteToRecipe,
});

export const cookingAssistant = new Agent({
  model: process.env.OPENAI_MODEL,
  name: 'Cooking Assistant',
  instructions: [
    'You are an assistant that helps',
    'people cooking by reading instructions from a recipe,',
    'as well as taking notes and making updates to that recipe as needed.',
  ].join(' '),
  tools: [addNoteToRecipeTool],
});
