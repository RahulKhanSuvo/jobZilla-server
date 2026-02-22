import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput } from "./user.schema";

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
      fullName: true,
      email: true,
      role: true,
      phone: true,
      resumeUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
export const userService = { createUser };
