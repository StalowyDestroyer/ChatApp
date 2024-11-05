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
        console.log(chalk.red(SocketMap.get(socket.id)));
        console.log(chalk.yellow(message.roomID));

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
