import { Router } from "express";
import { getUserById, userFilter } from "../repositories/userRepository";

const router = Router();

router.get("/:id", getUserById);
router.get("/", userFilter);

export default router;
