import { AddRecipeForm } from "@/components/add-recipe-form";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <h1 className={styles.title}>
        Recipe App
      </h1>
      <AddRecipeForm />
    </>
  );
}
