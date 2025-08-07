import { GraphOutputStream } from "@inworld/runtime/graph";

export async function consumeStream(stream: GraphOutputStream) {
  let result:string[] = [];
  let chunk = await stream.next();

  while (!chunk.done) {
    result.push(chunk.data as string);
    chunk = await stream.next();
  }

  return result.join('');
}
