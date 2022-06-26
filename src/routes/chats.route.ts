const app = require("express").Router();
import {getAll, getCurrent} from "../controllers/chats"

///// Get All Of A Current User's Chats /////
app.get("/", getAll);

///// Get Current Conversations /////
app.get("/:username", getCurrent);

export default app;