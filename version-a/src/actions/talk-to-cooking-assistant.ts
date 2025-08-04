'use server'
import { cookingAssistant } from "@/agents/cooking-assistant";
import { AgentInputItem, run } from "@openai/agents";

export async function talkToCookingAssistant(
  text: string,
  thread: AgentInputItem[] = [],
) {
  const result = await run(
    cookingAssistant,
    [...thread, { role: 'user', content: text, type: 'message' }],
  );

  return result.history;
}
