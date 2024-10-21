import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "chatapp",
  logging: console.log,
  models: [User],
});

export default sequelize;
