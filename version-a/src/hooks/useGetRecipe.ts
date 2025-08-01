import { getRecipe } from "@/actions/get-recipe";
import useSWR from "swr";

export function useGetRecipe(recipeId: number) {
  return useSWR(['ger-recipe', recipeId], async ([_, recipeId]) => {
    const recipe = await getRecipe(recipeId);

    return recipe;
  });
}
