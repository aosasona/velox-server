const app = require("express").Router();
import authMiddleware from "../middlewares/auth.middleware";
import {default as auth} from "./auth.route";
import {default as users} from "./users.route";


// Auth routes
app.use("/auth", auth);

// Users routes
app.use("/users", authMiddleware, users);

export default app;