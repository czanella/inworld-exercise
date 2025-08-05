'use client'
import { SpeechBubble } from "@/components/speech-bubble";
import { Spinner } from "@/components/spinner/spinner";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useStartCooking } from "@/hooks/useStartCooking";
import { useTalkToCookingAssistant } from "@/hooks/useTalkToCookingAssistant";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { extractMessage } from "@/lib/extractMessage";
import { AgentInputItem } from "@openai/agents";
import { useMicVAD } from "@ricky0123/vad-react";
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

  // Play message sound when agent sends a text
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const {
    trigger: textToSpeechTrigger,
    isMutating: textToSpeechIsMutating,
  } = useTextToSpeech()

  useEffect(() => {
    if (thread.length === 0) {
      return;
    }

    const lastMessage = thread[thread.length - 1];
    if (lastMessage.type !== 'message' || lastMessage.role === 'user') {
      return;
    }

    let audio: HTMLAudioElement | null = null;
    const onAudioEnd = () => { setIsPlayingSound(false) };
    const text = extractMessage(lastMessage);
    textToSpeechTrigger({ text }).then(audioBlob => {
      const audioUrl = URL.createObjectURL(audioBlob);
      audio = new Audio(audioUrl);
      audio.addEventListener('ended', onAudioEnd);
      setIsPlayingSound(true);
      audio.play();
    });
    
    return () => {
      if (!audio) {
        return;
      }
      audio.removeEventListener('ended', onAudioEnd);
      audio.currentTime = audio.duration;
    }
  }, [textToSpeechTrigger, thread]);

  // Main chat loop - VAD, speech to text and chat with agent
  const {
    trigger: speechToTextTrigger,
    isMutating: speechToTriggerIsMutating,
  } = useSpeechToText();

  const loading = !Boolean(context) ||
    speechToTriggerIsMutating ||
    chatIsMutating ||
    textToSpeechIsMutating;
  const recordingActive = !loading && !isPlayingSound;

  const onSpeechEnd = useCallback(
    async (audio: Float32Array<ArrayBufferLike>) => {
      if (recordingActive) {
        return;
      }
      const text = await speechToTextTrigger(audio);
      setThread(thread => [
        ...thread,
        { role: 'user', type: 'message', content: text },
      ]);
      const newThread = await chatTrigger({ text, thread });
      setThread(newThread);

    },
    [chatTrigger, recordingActive, speechToTextTrigger, thread],
  );
  const vad = useMicVAD({ onSpeechEnd });

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
        🎙️ Voice Cooking Assistant {vad.userSpeaking ? '- Recording...' : null}
      </header>
      <section className={styles.chat}>
        {thread.slice(1).map((t, i) => <SpeechBubble key={i} content={t} />)}
        {loading ? <Spinner className={styles.spinner} /> : null}
      </section>
    </>
  );
}
