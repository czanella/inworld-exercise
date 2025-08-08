import { CustomInputDataTypeTyped, CustomOutputDataTypeTyped, registerCustomNodeType } from "@inworld/runtime/graph";
import { ChatMessage } from "../types.js";

export const chatInputNodeType = registerCustomNodeType(
  'chat-input-node',
  [CustomInputDataTypeTyped<ChatMessage[]>()],
  CustomOutputDataTypeTyped<ChatMessage[]>(),
  (_context, messages) => {
    return messages;
  },
);
