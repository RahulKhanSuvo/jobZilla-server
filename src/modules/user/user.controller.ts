import type { RequestHandler } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { envConfig } from "../../config/env";
import { ApiError } from "../../errors/ApiError";
const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  return sendResponse(res, {
    data: result,
    statusCode: 201,
    message: "User created successfully",
    success: true,
  });
});
const loginUser = catchAsync(async (req, res) => {
  const result = await userService.loginUser(req.body);
  const { user, refreshToken, accessToken } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return sendResponse(res, {
    data: { user, accessToken },
    statusCode: 200,
    message: "Login successfully complete",
  });
});
const userTokenRefresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new ApiError("no refresh token", 401);
  const { newRefreshToken, accessToken } =
    await userService.refreshTokenAuth(refreshToken);
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    accessToken,
  });
});
const currentUser = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const result = await userService.currentUserById(
    userId as string,
    userRole as string,
  );
  sendResponse(res, {
    statusCode: 200,
    message: "current user",
    data: result,
  });
});
const userLogout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new ApiError("no user found", 400);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
  });
  sendResponse(res, {
    statusCode: 200,
    message: "logout success full",
  });
});
const changePassword = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(
    userId as string,
    currentPassword as string,
    newPassword as string,
  );
  sendResponse(res, {
    statusCode: 200,
    message: "password changed successfully",
    data: result,
  });
});
const deleteAccount = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await userService.deleteAccount(userId as string);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
  });
  sendResponse(res, {
    statusCode: 200,
    message: "account deleted successfully",
    data: result,
  });
});
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await userService.forgotPassword(email);
  sendResponse(res, {
    statusCode: 200,
    message: "Password reset link sent to your email",
    success: true,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  await userService.resetPassword(token, password);
  sendResponse(res, {
    statusCode: 200,
    message: "Password reset successfully",
    success: true,
  });
});

export const userController = {
  createUser,
  loginUser,
  userTokenRefresh,
  currentUser,
  userLogout,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
