import { Response, Request } from "express";
import { User } from "../models/user";
import { filter } from "../utils/filterUtils";

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

export const userFilter = async (req: Request, res: Response) => {
  try {
    res.status(200).json(
      await User.findAll({
        where: filter(req, User),
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};