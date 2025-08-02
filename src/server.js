import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/messages.route.js';

// Supabase connection
import supabase from './config/db.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true             
}));
app.use(express.json({limit: '15mb'}));
app.use(cookieParser()); 


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);



supabase
.channel('public:messages')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
  },
  (newSentMessage) => {
    // console.log('New message', newSentMessage.new);
  }
).subscribe();


const PORT = process.env.PORT || 5000;

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if(!Object.keys(userSocketMap).includes(userId)){
    if (userId) userSocketMap[userId] = socket.id;
  }
  console.log(userSocketMap);
  
  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));



  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    const exists = Object.values(userSocketMap).includes(socket.id);
    if(exists){
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
