import { Server as SocketIOServer, Socket } from "socket.io";
import { chatService } from "./chat.service";

export const chatSocketHandlers = (socket: Socket, io: SocketIOServer) => {
  // Join a specific conversation room
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave a specific conversation room
  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });

  // Handle incoming messages
  socket.on(
    "send_message",
    async (data: {
      conversationId: string;
      senderId: string;
      content: string;
    }) => {
      try {
        // Save message to database
        const message = await chatService.createMessage(
          data.conversationId,
          data.senderId,
          data.content,
        );

        // Emit new message event to everyone in the room (including the sender, or we can use socket.to().emit to exclude sender)
        io.to(data.conversationId).emit("new_message", message);
      } catch (error) {
        console.error("Error creating message via socket:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    },
  );

  // Handle typing status
  socket.on("typing", (data: { conversationId: string; senderId: string }) => {
    socket.to(data.conversationId).emit("typing", data);
  });
};
