const app = require("express").Router();
import { default as auth } from "./auth.route";

// Auth routes
app.use("/auth", auth);

export default app;
