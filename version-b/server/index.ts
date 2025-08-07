import express from 'express';
import multer from 'multer';
import { v4 } from 'uuid';
import WavDecoder from 'wav-decoder';
import { cookingExecutor } from './graph/graph.js';
import { consumeStream } from './lib/consumeStream.js';
import { toArrayBuffer } from './lib/toArrayBuffer.js';

const port = parseInt(process.env.PORT ?? '3000');

const app = express();
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Hello there!')
});

app.post('/chat', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const audioData = await WavDecoder.decode(
      toArrayBuffer(audioFile.buffer)
    );

    const cookingStream = await cookingExecutor.execute({
      data: audioData.channelData[0],
      sampleRate: audioData.sampleRate,
    }, v4());

    const message = await consumeStream(cookingStream);

    res.json({ message });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
