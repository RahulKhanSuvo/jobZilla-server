import { Request, Response, NextFunction } from "express";

export const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body?.data) {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (error) {
      console.error("Invalid JSON in data field:", error);

      return res.status(400).json({
        success: false,
        message: "Invalid JSON in data field",
      });
    }
  }

  next();
};
