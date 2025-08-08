import express from 'express';
import multer from 'multer';
import { v4 } from 'uuid';
import WavDecoder from 'wav-decoder';
import { cookingAudioInput, cookingTextInput } from './graph/graph.js';
import { consumeStream } from './lib/consumeStream.js';
import { toArrayBuffer } from './lib/toArrayBuffer.js';
import { ChatMessage } from './types.js';

const port = parseInt(process.env.PORT ?? '3000');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Hello there!')
});

app.post('/chat', upload.none(), async (req, res) => {
  const message: string = req.body.message;
  const cookingStream = await cookingTextInput.execute(
    [message, []],
    v4(),
  );

  const result = await consumeStream(cookingStream);

  res.json({ messages: result });
});

app.put('/chat', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const audioData = await WavDecoder.decode(
      toArrayBuffer(audioFile.buffer)
    );

    const messages: ChatMessage[] = JSON.parse(req.body.messages);

    const cookingStream = await cookingAudioInput.execute(
      [
        {
          data: audioData.channelData[0],
          sampleRate: audioData.sampleRate,
        },
        messages,
      ],
      v4(),
    );

    const result = await consumeStream(cookingStream);

    res.json({ messages: result });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
