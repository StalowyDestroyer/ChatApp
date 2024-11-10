import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwt";
import { RefreshToken } from "../models/refreshToken";

dotenv.config();

interface JwtPayload {
  id: string;
}

// Extend the Request interface to add the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string };
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET!
      ) as JwtPayload;
      req.user = { id: decoded.id };
      return next();
    }

    if (refreshToken) {
      const decoded = (await verifyRefreshToken(refreshToken)) as JwtPayload;
      if (!decoded || typeof decoded === "string" || !decoded.id) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
        return;
      }

      const refreshTokenEntry = await RefreshToken.findOne({
        where: { refreshToken },
      });
      if (!refreshTokenEntry) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
      }

      const user = await User.findByPk(refreshTokenEntry.userID);
      if (!user) {
        res.status(403).json({ message: "User not found" });
        return;
      }

      const newAccessToken = generateAccessToken(user);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
      });

      req.user = { id: user.id };
      next();
      return;
    }

    res.status(401).json({ message: "Unauthorized: No token provided" });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(403).json({ message: "Token expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "Invalid token" });
    } else {
      res
        .status(500)
        .json({ message: "Server error during token verification" });
    }
  }
};
