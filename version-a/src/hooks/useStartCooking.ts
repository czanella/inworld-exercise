import { startCooking } from "@/actions/start-cooking";
import useSWRImmutable from "swr/immutable";

export function useStartCooking(recipeId: number) {
  return useSWRImmutable(['start-cooking', recipeId], async ([_, recipeId]) => {
    const context = await startCooking(recipeId);

    return context;
  });
}
