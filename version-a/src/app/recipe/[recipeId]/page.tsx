import { getRecipe } from "@/actions/get-recipe";
import { notFound, redirect } from "next/navigation";
import { z } from 'zod';
import styles from './recipe.module.css';

type RecipeProps = {
  params: Promise<{ recipeId: string }>;
};

const recipeIdSchema = z.string()
  .regex(/^\d+$/, "Must be a string containing only digits.")
  .transform(Number)
  .pipe(z.number().int().positive());

export default async function Recipe({ params }: RecipeProps) {
  const { recipeId } = await params;
  let recipeNumericId: number;
  try {
    recipeNumericId = recipeIdSchema.parse(recipeId);
  } catch {
    redirect('/');
  }
  const recipe = await getRecipe(recipeNumericId);

  if (!recipe) {
    notFound();
  }

  return (
    <section className={styles.recipe}>
      <div className={styles.title}>
        {recipe.title}
      </div>
      <div className={styles.sectionTitle}>
        Ingredients
      </div>
      <ul>
        {recipe.ingredients.map(
          (ingredient, i) => <li key={i}>{ingredient}</li>,
        )}
      </ul>
      <div className={styles.sectionTitle}>
        Instructions
      </div>
      <ol>
        {recipe.steps.map(
          (step, i) => <li key={i}>{step}</li>,
        )}
      </ol>
    </section>
  );
}
