const app = require("express").Router();
import authMiddleware from "../middlewares/auth.middleware";
import {default as auth} from "./auth.route";
import {default as users} from "./users.route";
import {default as chats} from "./chats.route";


// Auth routes
app.use("/auth", auth);

// Users routes
app.use("/users", authMiddleware, users);

// Chats routes
app.use("/chats", authMiddleware, chats);

export default app;