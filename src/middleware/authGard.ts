import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env";

export const authGard = (
  options: { roles?: string[]; optional?: boolean } = {},
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    try {
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as {
          id: string;
          email: string;
          role: "CANDIDATE" | "EMPLOYER" | "ADMIN";
        };
        req.user = decode;
        if (
          options.roles &&
          options.roles.length > 0 &&
          !options.roles.includes(decode.role)
        ) {
          throw new ApiError("Forbidden", 403);
        }

        return next();
      }

      // No token
      if (options.optional) {
        req.user = undefined; // optional → continue
        return next();
      }

      // required → throw error
      throw new ApiError("No token provided", 401);
    } catch (err) {
      if (options.optional) {
        req.user = undefined; // optional → continue even if invalid token
        return next();
      }
      next(err); // required → pass error
    }
  };
};
