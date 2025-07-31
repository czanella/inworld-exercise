'use server'
import { prisma } from "@/lib/prisma";

export async function getRecipe(id: number) {
  return prisma.recipe.findUnique({
    where: { id },
  });
}
