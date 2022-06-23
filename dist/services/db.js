"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nextchat";
function connect() {
    mongoose_1.default
        .connect(MONGO_URI)
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((e) => {
        console.log(e);
    });
}
exports.connect = connect;
function disconnect() {
    mongoose_1.default.disconnect().then(() => {
        console.log("Disconnected from MongoDB");
    });
}
exports.disconnect = disconnect;
