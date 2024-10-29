import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";
import { User } from "../models/user";
import { ConversationMessage } from "../models/conversationMessage";
import { ConversationMembers } from "../models/conversationMembers";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.create(req.body);
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

export const getConversationWithMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const conversations = await Conversation.findOne({
      where: { id: "443f0b93-65b8-4f0a-b531-31b94ab1478b" },
      include: [
        {
          model: ConversationMessage,
          include: [
            {
              model: Message,
            },
            {
              model: User,
              attributes: {
                exclude: ["password", "refreshToken"],
              },
            },
          ],
        },
      ],
    });
    res.status(200).json(conversations);
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
