import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput, LoginFormData } from "./user.schema";
import { ApiError } from "../../errors/ApiError";

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
  const isExist = await prisma.user.findUnique({
    where: { email: data.email },
  });
  console.log(isExist);
  if (!isExist) {
    throw new ApiError("User Not found", 404);
  }
  return isExist;
};
export const userService = { createUser, loginUser };
