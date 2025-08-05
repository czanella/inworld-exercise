import useSWRMutation from 'swr/mutation';

type UseTextToSpeechProps = {
  arg: { text: string; voice?: string };
}

export function useTextToSpeech() {
  return useSWRMutation(
    '/api/tts',
    async (url: string, { arg }: UseTextToSpeechProps) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      });

      if (!res.ok) {
        throw new Error('Failed to generate speech');
      }

      return res.blob();
    }
  );
}
