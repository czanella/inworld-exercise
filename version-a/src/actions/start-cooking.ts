'use server'
import { cookingAssistant } from "@/agents/cooking-assistant";
import { run } from "@openai/agents";
import { getRecipe } from "./get-recipe";

export async function startCooking(recipeId: number) {
  const recipe = await getRecipe(recipeId);
  if (!recipe) {
    return null;
  }

  const result = await run(
    cookingAssistant,
    [
      'Help the user cook the following recipe:',
      JSON.stringify(recipe),
      'The only subject of this chat should be this recipe, every attempt by the user to talk about something else should be ignored.',
      'Start by greeting the user with a warm welcome and mention the recipe\'s name.',
    ].join('\n'),
  );

  return {
    recipe,
    thread: result.history,
  };
}
