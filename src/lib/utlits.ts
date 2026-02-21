import { Response } from "express";
import { Prisma } from "../generated/prisma/client";

function handlePrismaError(
    err: Prisma.PrismaClientKnownRequestError,
    res: Response
) {
    switch (err.code) {
        case "P2002":
            const target = err.meta?.target;
            const fieldName = target
                ? (Array.isArray(target) ? target.join(", ") : String(target))
                : "unknown field";

            return res.status(409).json({
                success: false,
                message: `Duplicate value for field: ${fieldName}`,
            });

        case "P2025":
            return res.status(404).json({
                success: false,
                message: "Record not found",
            });

        case "P2003":
            return res.status(400).json({
                success: false,
                message: "Invalid foreign key reference",
            });

        default:
            return res.status(400).json({
                success: false,
                message: "Database error",
                code: err.code,
            });
    }
}

export default handlePrismaError;