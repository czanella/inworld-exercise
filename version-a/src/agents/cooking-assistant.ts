import { Agent } from "@openai/agents";

export const cookingAssistant = new Agent({
  model: process.env.OPENAI_MODEL,
  name: 'Cooking Assistant',
  instructions: [
    'You are an assistant that helps',
    'people cooking by reading instructions from a recipe,',
    'as well as taking notes and making updates to that recipe as needed.',
  ].join(' '),
});
