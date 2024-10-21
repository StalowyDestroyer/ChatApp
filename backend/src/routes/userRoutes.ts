import { Router, Response, Request } from "express";
import { User } from "../models/user";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

router.get("/:id", async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  res.status(200).json(user);
});

export default router;
