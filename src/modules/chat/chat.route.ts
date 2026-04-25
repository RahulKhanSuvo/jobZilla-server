import express from "express";
import { chatController } from "./chat.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";
import { validate } from "../../middleware/validate.middleware";
import { chatSchema } from "./chat.schema";

const router = express.Router();

router.get(
  "/conversations",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  chatController.getMyConversations,
);

router.get(
  "/conversations/:conversationId/messages",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  chatController.getConversationMessages,
);

router.post(
  "/conversations",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  validate(chatSchema.startConversationZodSchema),
  chatController.startConversation,
);

router.patch(
  "/conversations/:conversationId/read",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER] }),
  chatController.markAsRead,
);

export const chatRoutes = router;
