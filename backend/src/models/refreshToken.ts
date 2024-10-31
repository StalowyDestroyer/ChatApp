import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
  Sequelize,
} from "sequelize-typescript";
import { User } from "./user";

@Table({
  tableName: "refreshToken",
  timestamps: false,
})
export class RefreshToken extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: () => {
      const now = new Date();
      now.setDate(now.getDate() + 30);
      return now;
    },
  })
  expireDate!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userID!: number;

  @BelongsTo(() => User)
  user!: User;
}
