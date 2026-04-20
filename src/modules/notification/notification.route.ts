import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER, UserRole.ADMIN] }),
  NotificationController.getNotifications,
);

router.patch(
  "/:id/read",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER, UserRole.ADMIN] }),
  NotificationController.markAsRead,
);

router.patch(
  "/read-all",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER, UserRole.ADMIN] }),
  NotificationController.markAllAsRead,
);

router.delete(
  "/:id",
  authGard({ roles: [UserRole.CANDIDATE, UserRole.EMPLOYER, UserRole.ADMIN] }),
  NotificationController.deleteNotification,
);

export const NotificationRoutes = router;
