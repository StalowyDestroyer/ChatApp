import express, { Application } from "express";
import sequelize from "./database";

const app: Application = express();
const port = 3000;
app.use(express.json());

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Baza danych została zsynchronizowana");
    app.listen(port, () => {
      console.log(`Serwer działa na porcie ${port}`);
    });
  })
  .catch((error) => {
    console.error("Błąd synchronizacji bazy danych:", error);
  });
