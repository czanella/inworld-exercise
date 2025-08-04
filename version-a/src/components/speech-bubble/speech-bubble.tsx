import { AgentInputItem } from "@openai/agents";
import classNames from "classnames";
import { useRef } from "react";
import styles from './speech-bubble.module.css';

type SpeechBubbleProps = {
  content: AgentInputItem;
}

function extractMessage(item: AgentInputItem) {
  if (item.type !== 'message') {
    return '';
  }
  if (item.role === 'assistant' && item.content[0].type === 'output_text') {
    return item.content[0].text;
  }
  if (typeof item.content === 'string') {
    return item.content;
  }
  return '';
}

export function SpeechBubble({ content }: SpeechBubbleProps) {
  const message = extractMessage(content);

  const isUser = content.type === 'message' && content.role === 'user';

  const time = useRef(new Date().toDateString());

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