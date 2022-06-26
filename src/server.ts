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
// io.use((socket: any, next) => {
//     const chatId = socket.handshake.auth.chatId;
//     if (!chatId) {
//         return next(new Error("invalid username"));
//     }
//     socket.chatId = chatId;
//     next();
// })

// Socket.io event handlers
io.on("connection", (socket: any) => {

    // Join private room
    // socket.join(socket.chatId);

    const chatId = socket?.handshake?.auth?.chatId;

    socket.on("connect", async (data: any) => {
        console.log("Connected");
    })
    // When a chat is opened
    socket.on("chat", (data: any) => {
        getCurrentChat(data?.chatId || chatId || "")
            .then((res) => {
                io.emit(`chat:${data?.chatId}`, res);
            }).catch((err: any) => {
            io.emit(`error:${data?.chatId || chatId || ""}`, {message: err.message})
        })
    })

    // When a message is sent
    socket.on("sent", (data: any) => {
        sendMessage(data, data?.chatId || chatId || "").then((res) => {
            // io.emit(`received:${res?.chatId || data?.chatId || chatId || ""}`, {message: res?.message});
            // If no chatId is provided, send the new data
            // if (!data?.chatId && !chatId) {
            getCurrentChat(res?.chatId)
                .then((res) => {
                    io.emit(`received:${data?.chatId}`, res);
                }).catch((err: any) => {
                io.emit(`error:${data?.chatId || chatId || ""}`, {message: err.message})
            })
            // }
        }).catch((err: any) => {
            io.emit(`error:${data?.chatId}`, {message: err.message})
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