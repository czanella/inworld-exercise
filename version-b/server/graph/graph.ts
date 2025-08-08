import { GraphBuilder, NodeFactory } from "@inworld/runtime/graph";
import { v4 } from "uuid";
import { chatInputNodeType } from "./chatInputNodeType.js";
import { promptBuilderNodeType } from "./promptBuilderNodeType.js";
import { sttComponent } from "./sttComponent.js";
import { updateChatNodeType } from "./updateChatNodeType.js";

type BuildCookingGraphProps = {
  audioInput?: boolean;
}

function buildCookingGraph({ audioInput }: BuildCookingGraphProps) {
  const updateChatNode = NodeFactory.createCustomNode(
    v4(),
    updateChatNodeType,
  );

  const promptBuilderNode = NodeFactory.createCustomNode(
    v4(),
    promptBuilderNodeType,
  );

  const graph = new GraphBuilder(`cooking_graph_${v4()}`)
    .addNode(updateChatNode)
    .addNode(promptBuilderNode)
    .addEdge(updateChatNode, promptBuilderNode)
    .setEndNode(promptBuilderNode);

  if (audioInput) {
    const chatInputNode = NodeFactory.createCustomNode(
      v4(),
      chatInputNodeType,
    );

    const sttNode = NodeFactory.createRemoteSTTNode({
      id: v4(),
      sttComponentId: sttComponent.id,
    });

    graph
      .addComponent(sttComponent)
      .addNode(sttNode)
      .addNode(chatInputNode)
      .addEdge(sttNode, updateChatNode)
      .addEdge(chatInputNode, updateChatNode)
      .setStartNodes([sttNode, chatInputNode]);
  } else {
    graph.setStartNode(updateChatNode);
  }

  return graph;
}

export const cookingTextInput = buildCookingGraph({ audioInput: false }).getExecutor();
export const cookingAudioInput = buildCookingGraph({ audioInput: true }).getExecutor();
