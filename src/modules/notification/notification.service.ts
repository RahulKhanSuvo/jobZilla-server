import { prisma } from "../../lib/prisma";
import { NotificationType } from "../../generated/prisma/enums";
import { getIO } from "../../socket";

const getNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  const total = await prisma.notification.count({
    where: { userId },
  });

  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return {
    notifications,
    meta: {
      total,
      page,
      limit,
      unreadCount,
    },
  };
};

const markAsRead = async (id: string, userId: string) => {
  return await prisma.notification.update({
    where: { id, userId },
    data: { isRead: true },
  });
};

const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

const deleteNotification = async (id: string, userId: string) => {
  return await prisma.notification.delete({
    where: { id, userId },
  });
};

const createNotification = async (data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) => {
  const notification = await prisma.notification.create({
    data,
  });

  try {
    const io = getIO();
    io.to(`user_${data.userId}`).emit("new_notification", notification);
  } catch (error) {
    console.error(
      "Socket not initialized, skipped real-time notification:",
      error,
    );
  }

  return notification;
};

export const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
};
