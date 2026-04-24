/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput, LoginFormData } from "./user.schema";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../../types";
import { ApiError } from "../../errors/ApiError";
import { generateTokens } from "../../utils/generateTokens";
import { envConfig } from "../../config/env";
import { UserRole } from "../../generated/prisma/enums";
const createUser = async (data: CreateUserInput) => {
  const isExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (isExist) throw new ApiError("User already exists", 409);
  const hashPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      ...data,
      password: hashPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
const loginUser = async (data: LoginFormData) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new ApiError("User Not found", 404);
  }
  const passwordValid = await bcrypt.compare(data.password, user.password);
  if (!passwordValid) throw new ApiError("invalid credentials", 401);
  const { refreshToken, accessToken } = generateTokens(user);
  const { password, ...safeUser } = user;

  return {
    user: safeUser,
    refreshToken,
    accessToken,
  };
};
const refreshTokenAuth = async (data: string) => {
  const decoded = jwt.verify(
    data,
    envConfig.REFRESH_TOKEN_SECRET,
  ) as CustomJwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) throw new ApiError("invalid", 404);
  const { accessToken, refreshToken } = generateTokens(user);
  return { accessToken, newRefreshToken: refreshToken };
};
const currentUserById = async (id: string, userRole: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
    include: {
      ...(userRole === "CANDIDATE" && {
        candidate: true,
        skills: true,
        eductions: true,
        workExperiences: true,
        languages: true,
      }),
      ...(userRole === "EMPLOYER" && {
        company: true,
      }),
    },
  });
  if (!user) throw new ApiError("user not found ", 404);
  return user;
};
const changePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new ApiError("user not found ", 404);
  const passwordValid = await bcrypt.compare(currentPassword, user.password);
  if (!passwordValid) throw new ApiError("invalid credentials", 401);
  const hashPassword = await bcrypt.hash(newPassword, 10);
  return await prisma.user.update({
    where: { id },
    data: {
      password: hashPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
const deleteAccount = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new ApiError("user not found ", 404);
  return await prisma.user.delete({
    where: { id },
  });
};
import { sendEmail } from "../../utils/sendEmail";

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new ApiError("User with this email does not exist", 404);

  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    envConfig.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const resetLink = `${envConfig.RESET_LINK_BASE_URL || `${envConfig.FRONTEND_URL}/auth`}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; text-align: center;">Reset Your Password</h2>
      <p style="color: #475569; line-height: 1.6;">Hello ${user.name},</p>
      <p style="color: #475569; line-height: 1.6;">We received a request to reset your password for your JobZilla account. Click the button below to set a new password. This link will expire in 15 minutes.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #475569; line-height: 1.6;">If you didn't request a password reset, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; 2024 JobZilla. All rights reserved.</p>
    </div>
  `;

  await sendEmail(user.email, "Password Reset Request - JobZilla", html);
};

const resetPassword = async (token: string, newPassword: string) => {
  let decoded: CustomJwtPayload;
  try {
    decoded = jwt.verify(
      token,
      envConfig.ACCESS_TOKEN_SECRET,
    ) as CustomJwtPayload;
  } catch (error) {
    throw new ApiError("Invalid or expired reset token", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) throw new ApiError("User not found", 404);

  const hashPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashPassword,
    },
  });
};

export const userService = {
  createUser,
  loginUser,
  refreshTokenAuth,
  currentUserById,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
