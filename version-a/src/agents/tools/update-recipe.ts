import { prisma } from "@/lib/prisma";
import { RecipeSchema } from "@/schemas";
import { tool } from "@openai/agents-core";
import { z } from 'zod';

type UpdateRecipeProps = z.infer<typeof RecipeSchema> & { id: number };

async function updateRecipe({ id, ...recipeFields }: UpdateRecipeProps) {
  return await prisma.recipe.update({
    where: { id },
    data: recipeFields,
  });
}

export const updateRecipeTool = tool({
  name: 'update_recipe',
  description: 'Updates a recipe',
  parameters: RecipeSchema.extend({ id: z.number() }),
  execute: updateRecipe,
});
