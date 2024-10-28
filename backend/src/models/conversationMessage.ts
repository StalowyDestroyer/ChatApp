import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Message } from "./message";
import { Conversation } from "./conversation";
import { User } from "./user";

@Table({
  tableName: "conversationMessages",
  timestamps: true,
  defaultScope: {
    attributes: {
      exclude: ["conversationID", "createdAt", "updatedAt"],
    },
  },
})
export class ConversationMessage extends Model {
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  @ForeignKey(() => Message)
  messageID!: number;
  @BelongsTo(() => Message)
  message!: Message;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  @ForeignKey(() => Conversation)
  conversationID!: string;
  @BelongsTo(() => Conversation)
  conversation!: Conversation;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  @ForeignKey(() => User)
  userID!: number;
  @BelongsTo(() => User)
  user!: User;
}
