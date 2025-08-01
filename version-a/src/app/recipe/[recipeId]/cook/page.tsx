'use client'
import { useGetRecipe } from "@/hooks/useGetRecipe";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useVad } from "@/hooks/useVad";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import styles from './cook.module.css';

type CookProps = {
  recipeId: string
};

export default function Cook() {
  const { recipeId } = useParams<CookProps>();
  const { trigger: triggerSpeechToText } = useSpeechToText();
  const onRecord = useCallback(
    (audio: Float32Array<ArrayBufferLike>) => {
      triggerSpeechToText(audio).then(r => console.log('Hey!', r));
    },
    [triggerSpeechToText],
  )

  const { data: recipe, isLoading, error } = useGetRecipe(parseInt(recipeId))
  const recording = useVad({ onRecord, active: Boolean(recipe) });

  if (error) {
    console.error(error);
    return <section>Error! Check the console for details</section>;
  }

  if (isLoading) {
    return <section>Loading...</section>;
  }

  if (!recipe) {
    return <section>Recipe not found</section>;
  }

  return (
    <>
      <header className={styles.cookHeader}>
        <div className={styles.cookTitle}>
          {recipe.title}
        </div>
        🎙️ Voice Cooking Assistant {recording ? '- Recording...' : null}
      </header>
      <section>
      </section>
    </>
  );
}
