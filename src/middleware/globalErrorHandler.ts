/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import handlePrismaError from "../utils/handlePrismaError";
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaError(err, res);
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
