'use client'
import { SpeechBubble } from "@/components/speech-bubble";
import { Spinner } from "@/components/spinner/spinner";
import { useGetRecipe } from "@/hooks/useGetRecipe";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useVad } from "@/hooks/useVad";
import { AgentInputItem } from "@openai/agents";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import styles from './cook.module.css';

type CookProps = {
  recipeId: string
};

export default function Cook() {
  const [thread, setThread] = useState<AgentInputItem[]>([]);

  const { recipeId } = useParams<CookProps>();
  const {
    data: recipe,
    isLoading: recipeIsLoading,
    error: recipeError,
  } = useGetRecipe(parseInt(recipeId))

  const {
    trigger: speechToTextTrigger,
    isMutating: speechToTriggerIsMutating,
  } = useSpeechToText();

  const recordingActive = Boolean(recipe) && !speechToTriggerIsMutating;
  const onRecord = useCallback(
    (audio: Float32Array<ArrayBufferLike>) => {
      speechToTextTrigger(audio).then(content => {
        setThread(thread => [
          ...thread,
          { role: 'user', type: 'message', content },
        ]);
      });
    },
    [speechToTextTrigger],
  );
  const recording = useVad({ onRecord, active: recordingActive });

  const loading = recipeIsLoading || speechToTriggerIsMutating;

  if (recipeError) {
    console.error(recipeError);
    return <section>Error! Check the console for details</section>;
  }

  if (recipeIsLoading) {
    return (
      <section className={styles.chat}>
        <Spinner className={styles.spinner} />
      </section>
    );
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
      <section className={styles.chat}>
        {thread.map((t, i) => <SpeechBubble key={i} content={t} />)}
        {loading ? <Spinner className={styles.spinner} /> : null}
      </section>
    </>
  );
}
