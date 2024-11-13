import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { User } from "../models/user";
import { ConversationMembers } from "../models/conversationMembers";
import { Message } from "../models/message";
import { ConversationMessage } from "../models/conversationMessage";
import { Op } from "sequelize";
import { ConversationInvites } from "../models/conversationInvites";
import { MessageFiles } from "../models/messageFiles";
import path from "path"

export const createConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.create({
      name: req.body.conversation,
      imagePath: req.file
        ? "http://localhost:3000/uploads/chat-avatar/" + req.file.filename
        : null,
        ownerID: req.user?.id,
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
          model: User.scope("safeData"),
          as: "members",
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
    const { id, last } = req.params;

    let whereOptions: Record<string, any> = {
      conversationID: id,
    };

    if (last && last != "-1") {
      whereOptions = {
        ...whereOptions,
        "$message.id$": {
          [Op.lt]: last,
        },
      };
    }

    const messages = await ConversationMessage.findAll({
      where: whereOptions,
      include: [
        { model: User.scope("safeData") },
        { model: Message, include: [MessageFiles], required: false },
      ],
      subQuery: false,
      order: [[{ model: Message, as: "message" }, "id", "DESC"]],
      limit: 20,
    });

    res.status(200).json(messages.reverse());
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

export const invitationAnswer = async (req: Request, res: Response) => {
  try {
    const { id, positive } = req.body;

    if (positive) {
      const invite = await ConversationInvites.findByPk(id);
      await ConversationMembers.create({
        userID: req.user?.id,
        conversationID: invite?.conversationID,
      });
    }

    await ConversationInvites.destroy({
      where: {
        id: id,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkIsUserInChat = async (req: Request, res: Response) => {
  try {
    const user = await User.scope("safeData").findOne({
      where: { id: req.user?.id },
      include: [
        {
          model: Conversation,
          where: { id: req.params.id },
        },
      ],
    });
    res.json(user);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const file = await MessageFiles.findByPk(Number(req.params.id));
    
    if(!file) {
      res.sendStatus(404);
      return;
    }
    
    const filePath = path.join(
      __dirname,
      "../../uploads/message-files",
      file.path.split("/").reverse()[0]
    );
    res.download(filePath, file.orginalName, (error) => console.log(error));
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    if(req.user?.id == conversation?.ownerID) {
      await Conversation.destroy({where: {id: req.params.id}});
      res.sendStatus(200);
      return;
    }
    res.sendStatus(403);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const removeUserFromConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    if(req.user?.id == conversation?.ownerID) {
      await ConversationMembers.destroy({where: {userID: req.query.userID, conversationID: conversation?.id}});
      res.sendStatus(200);
      return;
    }
    res.sendStatus(403);
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
} 
