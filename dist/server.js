"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
// Load environment variables from .env file
require("dotenv").config();
// Load the express module
const app_1 = __importDefault(require("./app"));
const db_1 = require("./services/db");
const socket_io_1 = require("socket.io");
const chat_handler_1 = require("./controllers/socket/chat.handler");
const PORT = process.env.PORT || 8000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
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
io.on("connection", (socket) => {
    // Join private room
    // socket.join(socket.chatId);
    var _a, _b;
    const chatId = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.chatId;
    socket.on("connect", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Connected");
    }));
    // When a chat is opened
    socket.on("chat", (data) => {
        (0, chat_handler_1.getCurrentChat)((data === null || data === void 0 ? void 0 : data.chatId) || chatId || "")
            .then((res) => {
            socket.emit(`chat:${data === null || data === void 0 ? void 0 : data.chatId}`, res);
        }).catch((err) => {
            socket.emit(`error:${(data === null || data === void 0 ? void 0 : data.chatId) || chatId || ""}`, { message: err.message });
        });
    });
    // When a message is sent
    socket.on("sent", (data) => {
        (0, chat_handler_1.sendMessage)(data, (data === null || data === void 0 ? void 0 : data.chatId) || chatId || "").then((res) => {
            socket.emit(`received:${res === null || res === void 0 ? void 0 : res.chatId}`, { message: res === null || res === void 0 ? void 0 : res.message });
            // If no chatId is provided, send the new data
            if (!(data === null || data === void 0 ? void 0 : data.chatId) && !chatId) {
                (0, chat_handler_1.getCurrentChat)(res === null || res === void 0 ? void 0 : res.chatId)
                    .then((res) => {
                    socket.emit(`chat:${data === null || data === void 0 ? void 0 : data.chatId}`, res);
                }).catch((err) => {
                    socket.emit(`error:${(data === null || data === void 0 ? void 0 : data.chatId) || chatId || ""}`, { message: err.message });
                });
            }
        }).catch((err) => {
            socket.emit(`error:${data === null || data === void 0 ? void 0 : data.chatId}`, { message: err.message });
        });
    });
});
// Start listening on port
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    // Connect to MONGODB database
    (0, db_1.connect)();
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
    (0, db_1.disconnect)();
    process.exit(0);
});
