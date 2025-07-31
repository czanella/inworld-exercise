import { Recipe } from "@prisma/client";
import Link from "next/link";
import styles from './recipe-button.module.css';

type RecipeButtonProps = {
  recipe: Recipe;
}

export function RecipeButton({ recipe }: RecipeButtonProps) {
  return (
    <Link href={`/recipe/${recipe.id}`} className={styles.recipeButton}>
      <div className={styles.title}>
        {recipe.title}
      </div>
      <div className={styles.items}>
        <span>{recipe.ingredients.length} ingredients</span>
        <span>{recipe.steps.length} steps</span>
        {recipe.prepTime ? <span>Prep: {recipe.prepTime}min</span> : null}
        {recipe.cookTime ? <span>Cook: {recipe.cookTime}min</span> : null}
      </div>
    </Link>
  );
}
