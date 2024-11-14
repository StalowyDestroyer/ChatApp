import { Router } from "express";
import {
  createConversation,
  getUserToInvite,
  getConversationById,
  getMessagesFromChat,
  getUserConversations,
  getUsersInConversation,
  inviteUserToChat,
  invitationAnswer,
  checkIsUserInChat,
  downloadFile,
  deleteMessage,
  deleteConversation,
  removeUserFromConversation,
} from "../repositories/conversationRepository";
import { uploadChatAvatar } from "../utils/multer";

const router = Router();
//Post
router.post("/", uploadChatAvatar.single("file"), createConversation);
router.post("/invitation", inviteUserToChat);
router.post("/invitationAnswer", invitationAnswer);
//Get
router.get("/userConversations", getUserConversations);
router.get("/:id", getConversationById);
router.get("/messages/:id/:last", getMessagesFromChat);
router.get("/:conversationID/members", getUsersInConversation);
router.get("/:conversationID/canBeInvited", getUserToInvite);
router.get("/isUserInConversation/:id", checkIsUserInChat);
router.get("/messageFile/:id", downloadFile);
//Delete
router.delete("/message/:id", deleteMessage);
router.delete("/:id", deleteConversation);
router.delete("/:id/members", removeUserFromConversation);
export default router;
