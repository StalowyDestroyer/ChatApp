import { Router } from "express";
import { getUserById } from "../repositories/userRepository";
import { verifyTokenForAccess } from "../utils/jwt";

const router = Router();

router.get("/:id", verifyTokenForAccess, getUserById);

export default router;
