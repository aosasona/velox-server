"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    receiver: {
        type: String,
        required: true,
        ref: "User"
    },
    sender: {
        type: String,
        required: true,
        ref: "User",
    },
    chatId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Message", MessageSchema);
