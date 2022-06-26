"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("express").Router();
const chats_1 = require("../controllers/chats");
///// Get All Of A Current User's Chats /////
app.get("/", chats_1.getAll);
///// Get Current Conversations /////
app.get("/:username", chats_1.getCurrent);
exports.default = app;
