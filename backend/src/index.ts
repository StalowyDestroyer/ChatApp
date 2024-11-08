import express, { Application } from "express";
import sequelize from "./database";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middlewares/jwtMiddleware";
import chalk from "chalk";
import dotenv from "dotenv";
import { socketConfig } from "./socket";

dotenv.config();

const app: Application = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// socket io config

socketConfig(app);

//Route paths
app.use("/api/v1/user", verifyToken, userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/conversation", verifyToken, conversationRoutes);

app.use("/uploads", express.static("uploads"));

//Models sync
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Baza danych została zsynchronizowana");
    app.listen(port, () => {
      console.log(chalk.green(`Serwer działa na porcie ${port}`));
    });
  })
  .catch((error) => {
    console.error("Błąd synchronizacji bazy danych:", error);
  });
