"use strict";
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
const PORT = process.env.PORT || 8000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server);
// Socket.io event handlers
io.on("connection", (socket) => {
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
