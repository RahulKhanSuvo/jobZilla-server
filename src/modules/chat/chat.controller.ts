import type { RequestHandler } from "express";
import { chatService } from "./chat.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const getMyConversations: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const conversations = await chatService.getConversations(userId as string);

  sendResponse(res, {
    statusCode: 200,
    message: "Conversations retrieved successfully",
    data: conversations,
  });
});

const getConversationMessages: RequestHandler = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await chatService.getMessages(conversationId as string);

  sendResponse(res, {
    statusCode: 200,
    message: "Messages retrieved successfully",
    data: messages,
  });
});

const startConversation: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { targetUserId } = req.body;

  const conversation = await chatService.findOrCreateConversation(
    userId as string,
    targetUserId,
  );

  sendResponse(res, {
    statusCode: 201,
    message: "Conversation retrieved or created successfully",
    data: conversation,
  });
});

export const chatController = {
  getMyConversations,
  getConversationMessages,
  startConversation,
};
