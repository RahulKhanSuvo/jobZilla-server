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
  userRole: UserRole,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new ApiError("user not found ", 404);
  const passwordValid = await bcrypt.compare(oldPassword, user.password);
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
export const userService = {
  createUser,
  loginUser,
  refreshTokenAuth,
  currentUserById,
  changePassword,
};
