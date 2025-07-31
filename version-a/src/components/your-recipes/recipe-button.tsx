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
        <span>One</span>
        <span>One</span>
        <span>One</span>
        <span>One</span>
      </div>
    </div>
  );
}
