import { Router } from "express";
import {
  createConversation,
  getConversationWithMessages,
  getUserConversations,
} from "../repositories/conversationRepository";

const router = Router();

router.post("/", createConversation);
router.get("/userConversations", getUserConversations);
router.get("/getConversationWithMessages", getConversationWithMessages);
export default router;
