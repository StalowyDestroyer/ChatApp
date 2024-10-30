import { Router } from "express";
import {
  createConversation,
  getUserConversations,
} from "../repositories/conversationRepository";
import { uploadChatAvatar } from "../utils/multer";

const router = Router();

router.post("/", uploadChatAvatar.single("file"), createConversation);
router.get("/userConversations", getUserConversations);

export default router;
