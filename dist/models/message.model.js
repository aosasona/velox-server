"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    receiver: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Message", MessageSchema);
