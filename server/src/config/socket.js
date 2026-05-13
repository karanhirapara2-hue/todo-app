import { Server } from "socket.io";
import "dotenv/config";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import socketAuth from "../middlewares/socketAuth.middleware.js"
let io;

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true // ✅ IMPORTANT for cookies
    }
  });
 
  // 🔐 Socket auth middlewar
  io.use(socketAuth);
  
  // 🔌 Connection
  io.on("connection", (socket) => {
    console.log("User connected:", socket.user);
    
  socket.join("12345");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.log(1)
    throw new Error("Socket.io not initialized!");
  }
  return io;
};