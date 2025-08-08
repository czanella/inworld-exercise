import { CustomInputDataType, CustomInputDataTypeTyped, CustomOutputDataTypeTyped, registerCustomNodeType } from "@inworld/runtime/graph";
import { ChatMessage } from "../types.js";

export const updateChatNodeType = registerCustomNodeType(
  'update-chat-node',
  [
    CustomInputDataType.TEXT,
    CustomInputDataTypeTyped<ChatMessage[]>()
  ],
  CustomOutputDataTypeTyped<ChatMessage[]>(),
  (_context, content, messages) => {
    const result = [...messages, { role: 'user', content }];
    return result;
  },
);
