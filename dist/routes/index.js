"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("express").Router();
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const auth_route_1 = __importDefault(require("./auth.route"));
const users_route_1 = __importDefault(require("./users.route"));
const chats_route_1 = __importDefault(require("./chats.route"));
// Auth routes
app.use("/auth", auth_route_1.default);
// Users routes
app.use("/users", auth_middleware_1.default, users_route_1.default);
// Chats routes
app.use("/chats", auth_middleware_1.default, chats_route_1.default);
exports.default = app;
