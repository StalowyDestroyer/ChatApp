import { Router } from "express";
import {
  createConversation,
  getUserToInvite,
  getConversationById,
  getMessagesFromChat,
  getUserConversations,
  getUsersInConversation,
} from "../repositories/conversationRepository";
import { uploadChatAvatar } from "../utils/multer";

const router = Router();

router.post("/", uploadChatAvatar.single("file"), createConversation);
router.get("/userConversations", getUserConversations);
router.get("/:id", getConversationById);
router.get("/messages/:id", getMessagesFromChat);
router.get("/:conversationID/members", getUsersInConversation);
router.get("/get/:id", getUserToInvite);
export default router;
