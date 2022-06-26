import http from "http";
// Load environment variables from .env file
require("dotenv").config();

// Load the express module
import app from "./app";
import {connect, disconnect} from "./services/db";
import {Server} from "socket.io"
import redisClient from "./utils/redis.util";
import {getCurrentChat, sendMessage} from "./controllers/socket/chat.handler";

const PORT: string | number = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {cors: {origin: "*"}});

// Register middleware
io.use((socket: any, next) => {
    const chatId = socket.handshake.auth.chatId;
    if (!chatId) {
        return next(new Error("invalid username"));
    }
    socket.chatId = chatId;
    next();
})

// Socket.io event handlers
io.on("connection", (socket: any) => {

    // Join private room
    socket.join(socket.chatId);

    socket.emit("connected", {message: "You are connected to the chat server"});


    // When a chat is opened
    socket.on("chatOpened", (chatId: any, data: any) => {
        getCurrentChat(chatId)
            .then((messages) => {
                socket.to(chatId).emit(`chatOpened-${data?.chatId}`, messages);
            }).catch((err: any) => {
            socket.to(chatId).emit(`error-${data?.chatId}`, err.message)
        })
    })

    // When a message is sent
    socket.on("sent", (chatId: any, data: any) => {
        sendMessage(chatId, data).then((res) => {
            socket.to(chatId).emit(`received-${res?.chatId}`, res?.message);
        }).catch((err: any) => {
            socket.to(chatId).emit(`error-${data?.chatId}`, err.message)
        })
    })
})

// Start listening on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    // Connect to MONGODB database
    connect();

    // Connect to REDIS
    //   redisClient
    //     .connect()
    //     .then(() => {
    //       if (process.env.NODE_ENV !== "test") {
    //         console.log("🛠\tRedis - Connection open");
    //       }
    //     })
    //     .catch((err: any) => {
    //       console.log(err);
    //     });
});

process.on("SIGINT", () => {
    console.log("SIGINT received. Closing server.");
    // Disconnect from MONGODB database
    disconnect();
    process.exit(0);
});