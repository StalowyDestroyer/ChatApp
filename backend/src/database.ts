import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user";
import { Message } from "./models/message";
import { Conversation } from "./models/conversation";
import { ConversationMessage } from "./models/conversationMessage";
import { ConversationMembers } from "./models/conversationMembers";
import { RefreshToken } from "./models/refreshToken";
import { ConversationInvites } from "./models/conversationInvites";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "chatapp",
  // logging: console.log,
  timezone: "+01:00",
  models: [
    User,
    Message,
    Conversation,
    ConversationMessage,
    ConversationMembers,
    RefreshToken,
    ConversationInvites,
  ],
});

export default sequelize;
