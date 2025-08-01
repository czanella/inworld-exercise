import { speechToText } from "@/actions/speech-to-text";
import useSWRMutation from "swr/mutation";

type UseSpeechToTextProps = {
  arg: Float32Array;
}

export function useSpeechToText() {
  return useSWRMutation(
    'speech-to-text',
    async (_, { arg: samples }: UseSpeechToTextProps) => {
      const transcription = await speechToText(samples);

      return transcription;
    },
  );
}
