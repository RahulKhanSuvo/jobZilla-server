/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server as SocketIOServer, Socket } from "socket.io";

export const notificationSocketHandlers = (
  socket: Socket,
  _io: SocketIOServer,
) => {
  // Join a user-specific room to receive private notifications
  socket.on("join_notifications", (userId: string) => {
    socket.join(`user_${userId}`);
    console.log(`User ${socket.id} joined notification room user_${userId}`);
  });

  // Leave the user-specific room
  socket.on("leave_notifications", (userId: string) => {
    socket.leave(`user_${userId}`);
    console.log(`User ${socket.id} left notification room user_${userId}`);
  });
};
