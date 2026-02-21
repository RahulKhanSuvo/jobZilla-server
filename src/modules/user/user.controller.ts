import type { RequestHandler } from "express";
import { userService } from "./user.service";
import { Prisma } from "../../generated/prisma/client";

const createUser: RequestHandler = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);

        return res.status(201).json({
            success: true,
            result,
            message: "User created successfully"
        });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    message: "User with this email already exists"
                });
            }
        }
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

export const userController = { createUser };