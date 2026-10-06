import { getAuth } from "@clerk/express";
import { NextFunction, Response } from "express";

export const protect = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const clerkUserId = getAuth(req).userId;

  if (!clerkUserId) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  req.user = {
    id: clerkUserId,
  };

  return next();
};
