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
    sameSite: "strict",
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
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    accessToken,
  });
});
const currentUser = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await userService.currentUser(refreshToken);
  sendResponse(res, {
    statusCode: 200,
    message: "current user",
    data: result,
  });
});
export const userController = {
  createUser,
  loginUser,
  userTokenRefresh,
  currentUser,
};
