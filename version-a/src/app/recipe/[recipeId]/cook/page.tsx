'use client'
import { SpeechBubble } from "@/components/speech-bubble";
import { Spinner } from "@/components/spinner/spinner";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useStartCooking } from "@/hooks/useStartCooking";
import { useTalkToCookingAssistant } from "@/hooks/useTalkToCookingAssistant";
import { useVad } from "@/hooks/useVad";
import { AgentInputItem } from "@openai/agents";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from './cook.module.css';

type CookProps = {
  recipeId: string
};

export default function Cook() {
  const { recipeId } = useParams<CookProps>();

  // Stores the chat thread
  const [thread, setThread] = useState<AgentInputItem[]>([]);

  // Loads the recipe and creates the context for the thread
  const {
    data: context,
    isLoading: contextIsLoading,
    error: contextError,
  } = useStartCooking(parseInt(recipeId))

  useEffect(() => {
    if (!context) {
      return;
    }
    setThread(context.thread);
  }, [context]);

  // Sends new messages to the chat
  const {
    trigger: chatTrigger,
    isMutating: chatIsMutating,
  } = useTalkToCookingAssistant();

  // Main chat loop - VAD, speech to text and chat with agent
  const {
    trigger: speechToTextTrigger,
    isMutating: speechToTriggerIsMutating,
  } = useSpeechToText();

  const recordingActive = Boolean(context) && !speechToTriggerIsMutating && !chatIsMutating;
  const onRecord = useCallback(
    async (audio: Float32Array<ArrayBufferLike>) => {
      const text = await speechToTextTrigger(audio);
      setThread(thread => [
        ...thread,
        { role: 'user', type: 'message', content: text },
      ]);
      const newThread = await chatTrigger({ text, thread });
      setThread(newThread);

    },
    [chatTrigger, speechToTextTrigger, thread],
  );
  const recording = useVad({ onRecord, active: recordingActive });

  // Scroll when a new message pops up
  useEffect(() => {
    if (thread.length > 2) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [thread.length])

  // Output
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
        {recordingActive ? null : <Spinner className={styles.spinner} />}
      </section>
    </>
  );
}
