import type { RequestHandler } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
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
  return sendResponse(res, {
    data: result,
    statusCode: 200,
    message: "Login successfully complete",
  });
});
export const userController = { createUser, loginUser };
