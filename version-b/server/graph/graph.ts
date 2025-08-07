import { GraphBuilder } from "@inworld/runtime/graph";
import { sttComponent, sttNode } from "./sttNode.js";

export const cookingExecutor = new GraphBuilder('cooking_graph')
  .addComponent(sttComponent)
  .addNode(sttNode)
  .setStartNode(sttNode)
  .setEndNode(sttNode)
  .getExecutor();
