import {
  Column,
  DataType,
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import { ConversationMessage } from "./conversationMessage";
import { MessageFiles } from "./messageFiles";

@Table({
  tableName: "message",
  timestamps: true,
})
export class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content!: string;

  @HasMany(() => ConversationMessage)
  conversationMessages!: ConversationMessage[];

  @HasMany(() => MessageFiles)
  messageFiles!: MessageFiles[];
}
