import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import handlePrismaError from "../lib/utlits";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(err, res);
    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}