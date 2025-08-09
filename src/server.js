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
import userRoutes from './routes/user.route.js';

// Supabase connection
// import supabase from './config/db.js';

const allowedOrigins = ['https://chattrixx.netlify.app'];

const app = express();
const server = http.createServer(app);
export const io = new SocketIO(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  },
});


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({limit: '15mb'}));
app.use(cookieParser()); 


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);


// supabase
// .channel('public:messages')
// .on(
//   'postgres_changes',
//   {
//     event: 'INSERT',
//     schema: 'public',
//     table: 'messages',
//   },
//   (newSentMessage) => {
//     // console.log('New message', newSentMessage.new);
//   }
// ).subscribe();


const PORT = process.env.PORT || 5000;


export const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("offer", ({ offer, roomId }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ answer, roomId }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  console.log(userSocketMap);
  
  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
