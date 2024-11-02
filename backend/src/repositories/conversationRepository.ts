import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { User } from "../models/user";
import { ConversationMembers } from "../models/conversationMembers";
import { Message } from "../models/message";
import { ConversationMessage } from "../models/conversationMessage";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.create({
      name: req.body.conversation,
      imagePath: req.file
        ? "http://localhost:3000/uploads/chat-avatar/" + req.file.filename
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

export const getConversationById = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessagesFromChat = async (req: Request, res: Response) => {
  try {
    const messages = await ConversationMessage.findAll({
      where: {
        conversationID: req.params.id,
      },
      include: [User, Message],
    });

    res.status(200).json(messages);
  } catch (error) {}
};
