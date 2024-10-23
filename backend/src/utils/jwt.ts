import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

const JWT_SECRET = "your_jwt_secret";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";

export const generateAccessToken = (user: User) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  });
};
