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

  interface MapValues {
    UserID: number;
    Rooms: string[];
  }

  const SocketMap: Map<string, MapValues> = new Map();

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

        let files: MessageFiles[] = [];

        if (message.message.files && message.message.files.length > 0) {
          files = await handleFileCreate(message, msg);
        }

        await ConversationMessage.create({
          conversationID: message.roomID,
          userID: userID,
          messageID: msg.id,
        });

        const userData = await User.findByPk(userID);

        console.log(chalk.red(JSON.stringify(files)));

        io.to(message.roomID).emit("message", {
          message: { ...msg.dataValues, messageFiles: files },
          user: userData?.dataValues,
        });

        const notify: string[] = [];

        SocketMap.forEach((values, key) => {
          if (values.Rooms.includes(message.roomID)) notify.push(key);
        });

        notify.forEach((z) =>
          socket.to(z).emit("notification", {
            message: { ...msg.dataValues, messageFiles: files },
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

    socket.on(
      "delete-user",
      (data: { conversationID: string; deletedUserID: number }) => {
        SocketMap.forEach((value, key) => {
          if (value.UserID == data.deletedUserID) {
            SocketMap.set(key, {
              UserID: value.UserID,
              Rooms: value.Rooms.filter((z) => z != data.conversationID),
            });
            socket.to(key).emit("deleted", data.conversationID);
          } else {
            // console.log(chalk.bgYellow(JSON.stringify(SocketMap.get(key))));
            // console.log(chalk.bgYellow(JSON.stringify(key)));
            // socket.to(value.Rooms[0]).emit("dupa", data.conversationID);
            //TODO
          }
        });
      }
    );

    socket.on("index-chats", (data: { rooms: string[]; userID: number }) => {
      SocketMap.set(socket.id, {
        UserID: data.userID,
        Rooms: data.rooms,
      });
      // console.log(SocketMap.get(socket.id));
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

const handleFileCreate = (message: SocketMessagePayload, msg: Message) => {
  // Stwórz tablicę obietnic
  const filePromises = message.message.files.map((file) => {
    return new Promise<MessageFiles>(async (resolve, reject) => {
      try {
        const base64Data = file.file.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        const customFileName = `file_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}${path.extname(file.name)}`;

        const uploadDir = path.join(__dirname, "../uploads/message-files/");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, customFileName);

        fs.writeFileSync(filePath, buffer);

        const createdFile = await MessageFiles.create({
          messageID: msg.id,
          path: `http://localhost:3000/uploads/message-files/${customFileName}`,
          type: file.type,
          orginalName: file.name,
        });

        resolve(createdFile.dataValues);
      } catch (error) {
        console.log(chalk.red(error));
        reject(error);
      }
    });
  });

  return Promise.all(filePromises);
};
