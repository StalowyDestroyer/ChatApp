import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { User } from "../models/user";
import { ConversationMembers } from "../models/conversationMembers";
import { Message } from "../models/message";
import { ConversationMessage } from "../models/conversationMessage";
import { Op, Sequelize } from "sequelize";
import chalk from "chalk";
import { ConversationInvites } from "../models/conversationInvites";

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
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsersInConversation = async (req: Request, res: Response) => {
  try {
    const userConversations = await User.scope("safeData").findAll({
      include: [
        {
          model: Conversation,
          where: { id: req.params.conversationID },
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

export const getUserToInvite = async (req: Request, res: Response) => {
  try {
    console.log(chalk.bgRed(req.query.filter));

    const { conversationID } = req.params;
    const users = await User.scope("safeData").findAll({
      include: [
        {
          model: ConversationMembers,
          where: {
            conversationID: conversationID,
          },
          attributes: [],
          required: false,
        },
        {
          model: ConversationInvites,
          as: "receivedInvites",
          where: {
            conversationID: conversationID,
          },
          attributes: [],
          required: false,
        },
      ],
      where: {
        "$ConversationMembers.conversationID$": {
          [Op.is]: null,
        },
        "$receivedInvites.conversationID$": {
          [Op.is]: null,
        },
        username: {
          [Op.like]: `%${req.query.filter}%`,
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users to invite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const inviteUserToChat = async (req: Request, res: Response) => {
  try {
    const { conversationID, invitedID } = req.body;
    await ConversationInvites.create({
      inviting: req.user?.id,
      invited: invitedID,
      conversationID: conversationID,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
