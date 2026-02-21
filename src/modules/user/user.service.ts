import { User } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createUser = async (data: User) => {
    return await prisma.user.create({
        data
    })
}
export const userService = { createUser }