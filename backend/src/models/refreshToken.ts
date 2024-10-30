import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from "sequelize-typescript";
import { User } from "./user";
@Table({
  tableName: "refreshToken",
  timestamps: true,
})
export class RefreshToken extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken!: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userID!: number;

  @BelongsTo(() => User)
  user!: User;
}
