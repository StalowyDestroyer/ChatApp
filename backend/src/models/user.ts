import {
  Column,
  DataType,
  Table,
  Model,
  BeforeCreate,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import bcrypt from "bcryptjs";
import { ConversationMessage } from "./conversationMessage";
import { ConversationMembers } from "./conversationMembers";

import { RefreshToken } from "./refreshToken";
import { Conversation } from "./conversation";
import { ConversationInvites } from "./conversationInvites";
@Table({
  tableName: "user",
  timestamps: true,
  scopes: {
    safeData: {
      attributes: {
        exclude: ["refreshToken", "password"],
      },
    },
  },
})
export class User extends Model {
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
  profilePicturePath!: string | null;

  @HasMany(() => ConversationMessage)
  conversationMessages!: ConversationMessage[];

  @HasMany(() => ConversationMembers)
  conversationMembers!: ConversationMembers[];

  @HasMany(() => RefreshToken)
  refreshTokens!: RefreshToken[];

  @BelongsToMany(() => Conversation, () => ConversationMembers)
  conversations!: Conversation[];
  //
  @HasMany(() => ConversationInvites, {
    as: "sentInvites",
    foreignKey: "inviting",
  })
  sentInvites!: ConversationInvites[];

  // Relacja dla otrzymanych zaproszeń z aliasem
  @HasMany(() => ConversationInvites, {
    as: "receivedInvites",
    foreignKey: "invited",
  })
  receivedInvites!: ConversationInvites[];
}