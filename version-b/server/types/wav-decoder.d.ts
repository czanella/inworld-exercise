declare module 'wav-decoder' {
  const decode: (buffer: ArrayBuffer) => Promise<{
    sampleRate: number;
    channelData: Float32Array[];
  }>;

  export = {
    decode,
  };
}
