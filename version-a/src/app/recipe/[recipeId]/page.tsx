import { getRecipe } from "@/actions/get-recipe";
import Link from "next/link";
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
    <>
      <header className={styles.recipeHeader}>
        <Link href='/' className='button'>&lt; Back</Link>
        <span className={styles.headerTitle}>Recipe Details</span>
        <button className={styles.hidden}>&lt; Back</button>
      </header>
      <section className={styles.recipe}>
        <div className={styles.title}>
          {recipe.title}
        </div>
        <Link href={`/recipe/${recipeId}/cook`} className='button'>
          🎙️ Start Cooking (Voice Mode)
        </Link>
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
        {recipe.notes.length === 0 ? null : (
          <>
            <div className={styles.sectionTitle}>
              Notes
            </div>
            <ul>
              {recipe.notes.map(
                (note, i) => <li key={i}>{note}</li>,
              )}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
