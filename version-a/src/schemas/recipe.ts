import { z } from "zod";

export const RecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
});
