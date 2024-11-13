import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Default,
  HasMany,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ConversationMessage } from "./conversationMessage";
import { Message } from "./message";
import { User } from "./user";
import { ConversationMembers } from "./conversationMembers";

@Table({
  tableName: "conversation",
  timestamps: true,
})
export class Conversation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  imagePath!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerID!: number;

  @HasMany(() => ConversationMessage)
  conversationMessages!: ConversationMessage[];

  @BelongsToMany(() => Message, () => ConversationMessage)
  messages!: Message[];

  @BelongsToMany(() => User, () => ConversationMembers)
  members!: User[];

  @HasMany(() => ConversationMembers)
  conversationMembers!: ConversationMembers[];

  @BelongsTo(() => User)
  owner!: User;
}