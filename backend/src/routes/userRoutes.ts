import { Router } from "express";
import {
  getUserById,
  login,
  logout,
  registerUser,
} from "../repositories/userRepository";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/:id", verifyToken, getUserById);

export default router;
