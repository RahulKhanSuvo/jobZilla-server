/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import handlePrismaError from "../utils/handlePrismaError";
import { ApiError } from "../errors/ApiError";
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error("error from errorhandler", err);
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaError(err, res);
    return;
  }
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Token expired or invalid",
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
