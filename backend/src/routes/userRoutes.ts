import { Router } from "express";
import { getUserById, registerUser } from "../repositories/userRepository";

const router = Router();

router.post("/register", registerUser);
router.get("/:id", getUserById);

export default router;
