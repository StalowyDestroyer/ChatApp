import jwt from "jsonwebtoken";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user: User) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
};

export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
      if (err) {
        reject("Invalid refresh token");
      } else {
        resolve(user);
      }
    });
  });
};
