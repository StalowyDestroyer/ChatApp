import { Router } from "express";
import {
  createConversation,
  getConversationById,
  getUserConversations,
} from "../repositories/conversationRepository";
import { uploadChatAvatar } from "../utils/multer";

const router = Router();

router.post("/", uploadChatAvatar.single("file"), createConversation);
router.get("/userConversations", getUserConversations);
router.get("/:id", getConversationById);

export default router;
