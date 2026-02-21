import { User } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"

const createUser = async (data: User) => {
    const isExist = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if (isExist) throw new Error("User already exists")
    const hashPassword = await bcrypt.hash(data.password, 10)
    return await prisma.user.create({
        data: {
            ...data,
            password: hashPassword
        }
    })
}
export const userService = { createUser }