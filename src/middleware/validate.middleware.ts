import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type Source = "body" | "params" | "query";

export const validate =
  <T>(schema: ZodType<T>, source: Source = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({ errors });
    }

    req[source] = result.data;
    next();
  };
