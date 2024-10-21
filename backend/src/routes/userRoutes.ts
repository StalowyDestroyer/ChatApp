import { Router, Response, Request } from "express";
import { User } from "../models/user";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const findUserName = await User.findOne({
      where: {
        email: email,
      },
    });

    if (findUserName) {
      res.status(409).json({ msg: "Nazwa użytkownika jest juz zajęta" });
      return;
    }

    const { password, ...userWithoutPassword } = req.body;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

export default router;
