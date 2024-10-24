import { Response, Request } from "express";
import { User } from "../models/user";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user || !(await user.checkPassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).json({ message: "Logged in" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(400).json({ message: "No refresh token found" });
      return;
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const findUserByEmail = await User.findOne({
      where: {
        email: email,
      },
    });

    if (findUserByEmail) {
      res.status(409).json({ message: "Adres email jest juz zajety" });
      return;
    }

    const createdUser = await User.create(req.body);
    const { password, ...userWithoutPassword } = createdUser.dataValues;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not provided" });
      return;
    }

    const user = await User.findOne({ where: { refreshToken } });

    if (!user) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    await verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, { httpOnly: true });
    res.status(200).json({ message: "Access token refreshed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
