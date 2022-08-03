import { Request, Response } from "express";
import { ApiError } from "../helpers/apiError";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: Function
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Error";

  return res.status(statusCode).json({ message });
};
