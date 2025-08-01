function floatTo16BitPCM(samples: Float32Array) {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function writeWavHeader(sampleRate: number, numChannels: number, numFrames: number) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  const blockAlign = numChannels * 2;        // 16‑bit → 2 bytes
  const byteRate = sampleRate * blockAlign;  // sampleRate * channels * bytesPerSample

  // 'RIFF'
  view.setUint32(0, 0x46464952, true);
  // file size minus first 8 bytes
  view.setUint32(4, 36 + numFrames * blockAlign, true);
  // 'WAVE'
  view.setUint32(8, 0x45564157, true);
  // 'fmt '
  view.setUint32(12, 0x20746d66, true);
  view.setUint32(16, 16, true);    // PCM header size
  view.setUint16(20, 1, true);     // format = 1 (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);    // bits per sample
  // 'data'
  view.setUint32(36, 0x61746164, true);
  view.setUint32(40, numFrames * blockAlign, true);

  return buffer;
}

export function float32ToWav(samples: Float32Array, sampleRate = 16000, numChannels = 1) {
  const pcm16 = floatTo16BitPCM(samples);
  const header = writeWavHeader(sampleRate, numChannels, samples.length);

  // Convert to Uint8Array for Blob parts
  const headerView = new Uint8Array(header);
  const pcmView = new Uint8Array(pcm16);

  // Return a Blob
  return new File([headerView, pcmView], 'audio.wav', { type: "audio/wav" });
}
