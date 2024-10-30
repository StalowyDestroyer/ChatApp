import { Router } from "express";
import {
  getUserById,
  updateUser,
  userFilter,
} from "../repositories/userRepository";
import { uploadUserProfile } from "../utils/multer";

const router = Router();

router.get("/", getUserById);
router.get("/", userFilter);
router.patch("/", uploadUserProfile.single("file"), updateUser);
export default router;
