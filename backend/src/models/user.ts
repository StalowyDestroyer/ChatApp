import { Column, DataType, Table, Model } from "sequelize-typescript";
@Table({
  tableName: "user",
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  username!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  surname!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  profilePicturePath!: string;
}
