import http from "http";
// Load environment variables from .env file
require("dotenv").config();

// Load the express module
import app from "./app";
import {connect, disconnect} from "./services/db";
import {Server} from "socket.io"
import redisClient from "./utils/redis.util";

const PORT: string | number = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server);

// Socket.io event handlers
io.on("connection", (socket) => {
  
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