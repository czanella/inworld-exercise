'use client'
import { addRecipe } from '@/actions/add-recipe';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './add-recipe-form.module.css';

export function AddRecipeForm() {
  const [url, setUrl] = useState('https://www.allrecipes.com/recipe/16899/beef-wellington/ ');
  const [pending, setPending] = useState(false);

  return (
    <div className={styles.addRecipeForm}>
      <input
        type="text"
        name="url"
        placeholder="Enter recipe URL"
        value={url}
        onChange={e => { setUrl(e.target.value) }}
      />
      <button
        onClick={async () => {
          setPending(true);
          await addRecipe(url);
          setUrl('');
          setPending(false);
        }}
        className={classNames({
          [styles.inactive]: pending,
        })}
      >
        Add recipe from URL
      </button>
    </div>
  );
}
