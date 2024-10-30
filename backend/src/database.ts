import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user";
import { Message } from "./models/message";
import { Conversation } from "./models/conversation";
import { ConversationMessage } from "./models/conversationMessage";
import { ConversationMembers } from "./models/conversationMembers";
import { RefreshToken } from "./models/refreshToken";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "chatapp",
  logging: console.log,
  models: [
    User,
    Message,
    Conversation,
    ConversationMessage,
    ConversationMembers,
    RefreshToken,
  ],
});

export default sequelize;
