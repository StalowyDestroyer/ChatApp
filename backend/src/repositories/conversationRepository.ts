import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { User } from "../models/user";
import { ConversationMembers } from "../models/conversationMembers";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.create({
      name: req.body.conversation,
      imagePath: req.file
        ? "http://localhost:3000/uploads/chat-images/" + req.file.filename
        : null,
    });
    await ConversationMembers.create({
      userID: req.user?.id,
      conversationID: conversation.id,
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userConversations = await Conversation.findAll({
      include: [
        {
          model: User,
          where: { id: req.user?.id },
          attributes: [],
        },
      ],
    });
    res.status(200).json(userConversations);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
