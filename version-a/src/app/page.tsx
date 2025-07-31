import { AddRecipeForm } from "@/components/add-recipe-form";
import { YourRecipes } from "@/components/your-recipes";
import styles from "./page.module.css";

export default function Home() {
  return (
    <section className={styles.home}>
      <h1 className={styles.title}>
        Recipe App
      </h1>
      <AddRecipeForm />
      <YourRecipes />
    </section>
  );
}
