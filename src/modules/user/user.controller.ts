import type { RequestHandler } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";
const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  return res.status(201).json({
    success: true,
    result,
    message: "User created successfully",
  });
});

export const userController = { createUser };
