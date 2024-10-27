import { Response, Request, CookieOptions } from "express";
import { User } from "../models/user";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const cookieParams: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user || !(await user.checkPassword(password))) {
      res.status(401).json({ message: "Niepoprawne dane uwierzytelniające" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, cookieParams);
    res.cookie("refreshToken", refreshToken, cookieParams);
    res.status(200).json({ message: "Logged in" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(400).json({ message: "Nie znaleziono tokenu odświeżania" });
      return;
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Pomyślnie wylogowano" });
  } catch (error) {
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
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
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res
        .status(401)
        .json({ message: "Token odświeżania nie został dostarczony" });
      return;
    }

    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      res
        .status(403)
        .json({ message: "Token odświeżania jest nieprawidłowy lub wygasł" });
      return;
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      res.status(403).json({ message: "Niepoprawny token odświeżania" });
      return;
    }

    await verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, cookieParams);
    res
      .status(200)
      .json({ message: "Token odświeżania został pomyślnie przeładowany" });
  } catch (error) {
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};
