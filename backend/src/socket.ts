import { SocketMessagePayload } from "./types/types";
import http from "http";
import { Server, Socket } from "socket.io";
import { Message } from "./models/message";
import chalk from "chalk";
import { ConversationMessage } from "./models/conversationMessage";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { User } from "./models/user";
import { Application } from "express";
import fs from "fs";
import path from "path";
import { MessageFiles } from "./models/messageFiles";

export const socketConfig = (app: Application) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
      optionsSuccessStatus: 204,
    },
  });

  const SocketMap: Map<string, string[]> = new Map();

  io.on("connection", (socket: Socket) => {
    console.log(chalk.bgGreen("User connected: " + socket.id + " ✔ "));

    socket.on("message", async (message: SocketMessagePayload) => {
      try {
        const cookies = socket.request.headers.cookie;

        const parsedCookies = cookie.parse(cookies!);
        const token = parsedCookies.accessToken;
        let payload;

        payload = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: number;
        };

        const { id: userID } = payload;
        if (!userID) return;

        const msg = await Message.create({
          content: message.message.content,
        });

        const paths: any[] = [];

        // Sprawdzamy, czy są jakieś pliki do zapisania
        if (message.message.files && message.message.files.length > 0) {
          handleFileCreate(message, msg, paths);
        }

        console.log("Zapisane pliki:", paths);

        await ConversationMessage.create({
          conversationID: message.roomID,
          userID: userID,
          messageID: msg.id,
        });

        const userData = await User.findByPk(userID);

        io.to(message.roomID).emit("message", {
          message: { ...msg.dataValues, messageFiles: paths },
          user: userData?.dataValues,
        });

        const notify: string[] = [];

        SocketMap.forEach((values, key) => {
          if (values.includes(message.roomID)) notify.push(key);
        });

        notify.forEach((z) =>
          socket.to(z).emit("notification", {
            message: msg,
            user: userData?.dataValues,
            roomID: message.roomID,
          })
        );
      } catch (error) {
        console.log(chalk.red("Błąd podczas obsługi wiadomości:", error));
      }
    });

    socket.on("join-room", (channelID: string) => {
      Array.from(socket.rooms).forEach((room) => {
        if (room !== socket.id) socket.leave(room);
      });
      socket.join(channelID);
    });

    socket.on("index-chats", (data: string[]) => {
      SocketMap.set(socket.id, data);
      console.log(SocketMap.get(socket.id));
    });

    socket.on("disconnect", () => {
      console.log(chalk.bgRed(`User disconnected: ${socket.id} ` + " ❌ "));
      SocketMap.delete(socket.id);
    });
  });

  server.listen(3001, () => {
    console.log(chalk.green("IO działa na porcie 3001"));
  });
};

const handleFileCreate = (
  message: SocketMessagePayload,
  msg: Message,
  paths: string[]
) => {
  message.message.files.forEach(async (file) => {
    try {
      const base64Data = file.file.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const customFileName = `file_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}${path.extname(file.fileName)}`;

      const uploadDir = path.join(__dirname, "../uploads/message-files/");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, customFileName);

      fs.writeFileSync(filePath, buffer);

      await MessageFiles.create({
        messageID: msg.id,
        path: `http://localhost:3000/uploads/message-files/${customFileName}`,
        type: file.fileType,
      }).then((res) => {
        paths.push({ ...res.dataValues, type: file.fileType });
      });
    } catch (error) {
      console.log(chalk.red(error));
    }
  });
};
