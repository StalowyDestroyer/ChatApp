import {
  Column,
  DataType,
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  BelongsTo,
} from "sequelize-typescript";
import { ConversationMessage } from "./conversationMessage";

interface MessageColumns {
  id?: number;
  content: string;
}

@Table({
  tableName: "message",
  timestamps: true,
})
export class Message extends Model<MessageColumns> {
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
}
