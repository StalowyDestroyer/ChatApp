import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { User } from "./user";
import { Conversation } from "./conversation";

@Table({
  tableName: "conversationMembers",
  timestamps: true,
})
export class ConversationMembers extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userID!: number;

  @ForeignKey(() => Conversation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  conversationID!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Conversation)
  conversation!: Conversation;
}
