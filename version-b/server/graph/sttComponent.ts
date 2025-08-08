import { ComponentFactory } from "@inworld/runtime/graph";

export const sttComponent = ComponentFactory.createRemoteSTTComponent({
  id: 'stt_component',
  sttConfig: {
    apiKey: process.env.INWORLD_API_KEY!,
    defaultConfig: {},
  },
});
