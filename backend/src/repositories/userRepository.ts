import { Response, Request } from "express";
import { User } from "../models/user";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      res.status(404).json({ message: "Nie znaleziono użytkownika" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
