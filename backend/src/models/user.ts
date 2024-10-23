import {
  Column,
  DataType,
  Table,
  Model,
  BeforeCreate,
} from "sequelize-typescript";
import bcrypt from "bcryptjs";
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
  @BeforeCreate
  static async hashPassword(user: User) {
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
  }
  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  profilePicturePath!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  refreshToken!: string;
}
