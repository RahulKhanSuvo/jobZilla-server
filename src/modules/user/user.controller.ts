import type { RequestHandler } from "express";
import { userService } from "./user.service";

const createUser: RequestHandler = async (req, res, next) => {
    try {

        const result = await userService.createUser(req.body);
        return res.status(201).json({
            success: true,
            result,
            message: "User created successfully"
        });

    } catch (error) {
        next(error)
    }
};

export const userController = { createUser };