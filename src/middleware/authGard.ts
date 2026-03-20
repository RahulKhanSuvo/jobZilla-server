import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env";

export const authGard = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new ApiError("No token provided", 401);
      const token = authHeader.split(" ")[1];
      const decode = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as {
        id: string;
        email: string;
        role: "CANDIDATE" | "EMPLOYER" | "ADMIN";
      };

      if (requiredRoles.length && !requiredRoles.includes(decode.role)) {
        throw new ApiError("Forbidden", 403);
      }

      req.user = decode;
      next();
    } catch (error) {
      next(error);
    }
  };
};
