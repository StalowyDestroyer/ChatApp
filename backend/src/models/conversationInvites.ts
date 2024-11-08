import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user";
import { Conversation } from "./conversation";

@Table({
  tableName: "conversationInvites",
  timestamps: true,
})
export class ConversationInvites extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  inviting!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  invited!: number;

  @ForeignKey(() => Conversation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  conversationID!: string;

  @BelongsTo(() => User, "inviting")
  inviter!: User;

  @BelongsTo(() => User, "invited")
  invitee!: User;

  @BelongsTo(() => Conversation, "conversationID")
  conversation!: Conversation;
}
