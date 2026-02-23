/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput, LoginFormData } from "./user.schema";
import { ApiError } from "../../errors/ApiError";
import { generateTokens } from "../../utils/generateTokens";
const createUser = async (data: CreateUserInput) => {
  const isExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (isExist) throw new Error("User already exists");
  const hashPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      ...data,
      password: hashPassword,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      phone: true,
      resumeUrl: true,
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
export const userService = { createUser, loginUser };
