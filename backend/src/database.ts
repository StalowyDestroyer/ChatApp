import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "tescior",
  logging: console.log,
  models: [],
});

export default sequelize;
