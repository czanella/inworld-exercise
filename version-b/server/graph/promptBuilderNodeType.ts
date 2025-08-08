import { CustomInputDataTypeTyped, CustomOutputDataType, registerCustomNodeType } from "@inworld/runtime/graph";
import { renderJinja } from "@inworld/runtime/primitives/llm";
import { readFileSync } from "fs";
import path from "path";
import { ChatMessage } from "../types.js";

const promptTemplate = readFileSync(
  path.join(
    __dirname,
    'templates',
    'cooking_assistant.jinja',
  ),
  'utf-8',
);

export const promptBuilderNodeType = registerCustomNodeType(
  'dialog-prompt-builder-node',
  [CustomInputDataTypeTyped<ChatMessage[]>()],
  CustomOutputDataType.TEXT,
  async (_context, messages) => {
    const prompt = renderJinja(promptTemplate, { messages });
    return prompt;
  },
);
