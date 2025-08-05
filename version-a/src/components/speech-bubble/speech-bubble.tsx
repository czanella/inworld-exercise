import { extractMessage } from "@/lib/extractMessage";
import { AgentInputItem } from "@openai/agents";
import classNames from "classnames";
import { useRef } from "react";
import styles from './speech-bubble.module.css';

type SpeechBubbleProps = {
  content: AgentInputItem;
}

export function SpeechBubble({ content }: SpeechBubbleProps) {
  const message = extractMessage(content);

  const isUser = content.type === 'message' && content.role === 'user';

  const time = useRef(new Date().toDateString());

  if (content.type !== 'message') {
    return null;
  }

  return (
    <div className={
      classNames(
        styles.speechBubble,
        {
          [styles.user]: isUser,
        },
      )
    }>
      <div className={styles.textContainer}>
        {message}
      </div>
      <div className={styles.time}>
        {time.current}
      </div>
    </div>
  );
}