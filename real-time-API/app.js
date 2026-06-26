// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());

// Create unified HTTP server combining Express and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connection Successful"))
  .catch(err => console.error("Database connection failure:", err));


app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve history" });
  }
});


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  
  socket.on('sendMessage', async (data) => {
    try {
     
      const newMessage = new Message({
        sender: data.sender,
        content: data.content
      });
      await newMessage.save();

     
      io.emit('receiveMessage', newMessage);
    } catch (err) {
      console.error("Message handling bottleneck:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


server.listen(process.env.PORT, () => console.log(`Communication node active on port ${process.env.PORT}`));
