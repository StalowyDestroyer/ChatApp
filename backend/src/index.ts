import express, { Application } from "express";
import sequelize from "./database";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middlewares/jwtMiddleware";
import http from "http";
import { Server, Socket } from "socket.io";
import { Message } from "./models/message";
import chalk from "chalk";
import { SocketMessagePayload } from "./types/types";
import { ConversationMessage } from "./models/conversationMessage";
import dotenv from "dotenv";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { User } from "./models/user";

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
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("message", async (message: SocketMessagePayload) => {
    try {
      const cookies = socket.handshake.headers.cookie;

      const parsedCookies = cookie.parse(cookies!);
      const token = parsedCookies.accessToken;

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
      };
      console.log(chalk.yellowBright(JSON.stringify(payload)));

      const { id: userID } = payload;

      const msg = await Message.create({
        content: message.message.content,
      });
      await ConversationMessage.create({
        conversationID: message.roomID,
        userID: userID,
        messageID: msg.id,
      });

      const userData = await User.findByPk(userID);

      io.to(message.roomID).emit("message", {
        message: msg,
        user: userData?.dataValues,
      });
    } catch (error) {
      console.log(chalk.red(error));
    }
  });

  socket.on("join-room", (channelID: string) => {
    if (!Array.from(socket.rooms).some((z) => z === channelID))
      socket.join(channelID);
    console.log(chalk.blue("dolaczyles do " + channelID));
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id} ` + chalk.red("❌"));
  });
});

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
    server.listen(3001, () => {
      console.log(chalk.green("IO działa na porcie 3001"));
    });
  })
  .catch((error) => {
    console.error("Błąd synchronizacji bazy danych:", error);
  });
