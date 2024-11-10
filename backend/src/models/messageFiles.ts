import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from "sequelize-typescript";
import { Message } from "./message";

@Table({
  tableName: "messageFiles",
  timestamps: true,
})
export class MessageFiles extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  path!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  type!: string;

  @ForeignKey(() => Message)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  messageID!: number;

  @BelongsTo(() => Message)
  message!: Message;
}
