const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const pool = require('./lib/db');


require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.route');

app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;


io.on("connection", (socket) => {
  console.log("User connected", socket.id);


  socket.on("disconnect", () => console.log("User disconnected"));
  
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));