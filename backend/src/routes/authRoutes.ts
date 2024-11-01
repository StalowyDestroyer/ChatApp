import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  registerUser,
} from "../repositories/authRepository";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);

export default router;
