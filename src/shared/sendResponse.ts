/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

export type ApiResponse<T> = {
  statusCode: number;
  success?: boolean;
  message: string;
  data?: T;
  meta?: any;
};

export const sendResponse = <T>(res: Response, options: ApiResponse<T>) => {
  const { statusCode, success = true, message, data, meta } = options;
  return res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};
