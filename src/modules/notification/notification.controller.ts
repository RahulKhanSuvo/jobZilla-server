import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { getPagination } from "../../utils/pagination";
import { notificationService } from "./notification.service";

const getNotifications = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const { page, limit } = getPagination(req.query);
  const result = await notificationService.getNotifications(
    userId,
    Number(page),
    Number(limit),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications fetched successfully",
    data: result.notifications,
    meta: result.meta,
  });
});

const markAsRead = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const { id: notificationId } = req.params;
  const result = await notificationService.markAsRead(
    notificationId as string,
    userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification marked as read",
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const result = await notificationService.markAllAsRead(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
});

const deleteNotification = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const { id: notificationId } = req.params;
  const result = await notificationService.deleteNotification(
    notificationId as string,
    userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});

export const NotificationController = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
