import { talkToCookingAssistant } from "@/actions/talk-to-cooking-assistant";
import { AgentInputItem } from "@openai/agents-core";
import useSWRMutation from "swr/mutation";

type UseTalkToCookingAssistantProps = {
  arg: {
    text: string;
    thread: AgentInputItem[];
  };
}

export function useTalkToCookingAssistant() {
  return useSWRMutation(
    'talk-to-cooking-assistant',
    async (_, { arg: { text, thread } }: UseTalkToCookingAssistantProps) => {
      const newThread = await talkToCookingAssistant(text, thread);

      return newThread;
    },
  );
}
