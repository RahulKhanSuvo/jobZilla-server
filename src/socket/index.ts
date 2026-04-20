import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { envConfig } from "../config/env";
import { chatSocketHandlers } from "../modules/chat/chat.socket";
import { notificationSocketHandlers } from "../modules/notification/notification.socket";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: envConfig.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ A user connected:", socket.id);

    // Register modular socket handlers
    chatSocketHandlers(socket, io!);
    notificationSocketHandlers(socket, io!);

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
