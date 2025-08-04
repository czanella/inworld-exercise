import { talkToCookingAssistant } from "@/actions/talk-to-cooking-assistant";
import useSWRMutation from "swr/mutation";

type UseTalkToCookingAssistantProps = {
  arg: string;
}

export function useTalkToCookingAssistant() {
  return useSWRMutation(
    'talk-to-cooking-assistant',
    async (_, { arg: text }: UseTalkToCookingAssistantProps) => {
      const thread = await talkToCookingAssistant(text);

      return thread;
    },
  );
}
