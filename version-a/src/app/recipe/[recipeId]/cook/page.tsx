'use client'
import { SpeechBubble } from "@/components/speech-bubble";
import { Spinner } from "@/components/spinner/spinner";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useStartCooking } from "@/hooks/useStartCooking";
import { useVad } from "@/hooks/useVad";
import { AgentInputItem } from "@openai/agents";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from './cook.module.css';

type CookProps = {
  recipeId: string
};

export default function Cook() {
  const [thread, setThread] = useState<AgentInputItem[]>([]);

  const { recipeId } = useParams<CookProps>();
  const {
    data: context,
    isLoading: contextIsLoading,
    error: contextError,
  } = useStartCooking(parseInt(recipeId))

  useEffect(() => {
    console.log('!!!!!!!!!!', context);
    if (!context) {
      return;
    }
    setThread(context.thread);
  }, [context]);

  const {
    trigger: speechToTextTrigger,
    isMutating: speechToTriggerIsMutating,
  } = useSpeechToText();

  const recordingActive = Boolean(context) && !speechToTriggerIsMutating;
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

  const loading = contextIsLoading || speechToTriggerIsMutating;

  if (contextError) {
    console.error(contextError);
    return <section>Error! Check the console for details</section>;
  }

  if (contextIsLoading) {
    return (
      <section className={styles.chat}>
        <Spinner className={styles.spinner} />
      </section>
    );
  }

  if (!context) {
    return <section>Recipe not found</section>;
  }

  return (
    <>
      <header className={styles.cookHeader}>
        <div className={styles.cookTitle}>
          {context.recipe.title}
        </div>
        🎙️ Voice Cooking Assistant {recording ? '- Recording...' : null}
      </header>
      <section className={styles.chat}>
        {thread.slice(1).map((t, i) => <SpeechBubble key={i} content={t} />)}
        {loading ? <Spinner className={styles.spinner} /> : null}
      </section>
    </>
  );
}
