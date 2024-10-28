import express, { Application } from "express";
import sequelize from "./database";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middlewares/jwtMiddleware";
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
//Middleware
// app.use(verifyToken);

//Route paths
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/conversation", verifyToken, conversationRoutes);

//Models sync
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
