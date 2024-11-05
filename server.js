import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/http-workshop');

// Message Schema
const messageSchema = new mongoose.Schema({
  text: String,
  method: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Routes demonstrating different HTTP methods
app.get('/api/messages', async (req, res) => {
  const messages = await Message.find().sort('-timestamp');
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  const message = new Message({
    text: req.body.text,
    method: 'POST'
  });
  await message.save();
  res.status(201).json(message);
});

app.put('/api/messages/:id', async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text, method: 'PUT' },
    { new: true }
  );
  res.json(message);
});

app.delete('/api/messages/:id', async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});