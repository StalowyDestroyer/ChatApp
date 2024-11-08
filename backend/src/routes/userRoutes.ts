import { Router } from "express";
import {
  getInvitations,
  getUserById,
  updateUser,
  userFilter,
} from "../repositories/userRepository";
import { uploadUserProfile } from "../utils/multer";

const router = Router();

router.get("/", getUserById);
router.get("/", userFilter);
router.patch("/", uploadUserProfile.single("file"), updateUser);
router.get("/invitations", getInvitations);

export default router;
