import vad from '@ricky0123/vad-web';
import { useEffect, useState } from "react";

type UseVadProps = {
  onRecord: (audio: Float32Array<ArrayBufferLike>) => void;
  active?: boolean;
}

export function useVad({ onRecord, active = true }: UseVadProps) {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    let effectEnded = false;
    let myVad: vad.MicVAD;
    vad.MicVAD.new({
      onSpeechStart: () => { setRecording(true); },
      onSpeechEnd: (audio) => {
        setRecording(false);
        onRecord(audio);
      },
    }).then(vadInstance => {
      if (!effectEnded) {
        myVad = vadInstance;
        myVad.start();
      } else {
        vadInstance.destroy();
      }
    });

    return () => {
      myVad?.destroy();
      effectEnded = true;
    };
  }, [active, onRecord]);

  return recording;
}
