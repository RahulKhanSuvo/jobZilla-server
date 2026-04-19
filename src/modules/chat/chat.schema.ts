import { z } from "zod";

const startConversationZodSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
});

export const chatSchema = {
  startConversationZodSchema,
};
