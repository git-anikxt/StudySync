import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token =
      req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  try {
  console.log("JWT_SECRET =", process.env.JWT_SECRET)

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  )

  console.log("Decoded =", decoded)

  req.user = decoded

  next()
} catch (error) {
  console.log("===== JWT ERROR =====");
  console.log(error);

  return res.status(401).json({
    success: false,
    message: "Invalid token",
  });
}
};