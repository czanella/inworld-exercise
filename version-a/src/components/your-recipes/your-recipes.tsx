import { getRecipes } from '@/actions/get-recipes';
import { RecipeButton } from './recipe-button';
import styles from './your-recipes.module.css';

export async function YourRecipes() {
  const recipes = await getRecipes();

  return (
    <div className={styles.yourRecipes}>
      <div className={styles.title}>
        Your Recipes
      </div>
      {recipes.map(r => <RecipeButton key={r.id} recipe={r} />)}
    </div>
  );
}
