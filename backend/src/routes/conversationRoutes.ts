import { Router } from "express";
import {
  createConversation,
  getUserToInvite,
  getConversationById,
  getMessagesFromChat,
  getUserConversations,
  getUsersInConversation,
  inviteUserToChat,
} from "../repositories/conversationRepository";
import { uploadChatAvatar } from "../utils/multer";

const router = Router();
//Post
router.post("/", uploadChatAvatar.single("file"), createConversation);
router.post("/invitation", inviteUserToChat);
//Get
router.get("/userConversations", getUserConversations);
router.get("/:id", getConversationById);
router.get("/messages/:id", getMessagesFromChat);
router.get("/:conversationID/members", getUsersInConversation);
router.get("/:conversationID/canBeInvited", getUserToInvite);
export default router;
