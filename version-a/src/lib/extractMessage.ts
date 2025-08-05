import { AgentInputItem } from "@openai/agents-core";

export function extractMessage(item: AgentInputItem) {
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