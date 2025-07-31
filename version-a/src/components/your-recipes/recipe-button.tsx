import { Recipe } from "@prisma/client";
import styles from './recipe-button.module.css';

type RecipeButtonProps = {
  recipe: Recipe;
}

export function RecipeButton({ recipe }: RecipeButtonProps) {
  return (
    <div className={styles.recipeButton}>
      <div className={styles.title}>
        {recipe.title}
      </div>
      <div className={styles.items}>
        <span>{recipe.ingredients.length} ingredients</span>
        <span>{recipe.steps.length} steps</span>
        <span>Prep: {recipe.prepTime}min</span>
        <span>Cook: {recipe.cookTime}min</span>
      </div>
    </div>
  );
}
