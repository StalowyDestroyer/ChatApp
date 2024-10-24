import express, { Application } from "express";
import sequelize from "./database";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
const app: Application = express();
const port = 3000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use("/api/v1/user", userRoutes);

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
