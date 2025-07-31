import styles from './add-recipe-form.module.css';

export function AddRecipeForm() {
  return (
    <div className={styles.addRecipeForm}>
      <input type="text" placeholder="Enter recipe URL" />
      <button>Add recipe from URL</button>
    </div>
  );
}
