"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    userA: {
        type: String,
        required: true,
        ref: "User"
    },
    userB: {
        type: String,
        required: true,
        ref: "User",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Conversation", ConversationSchema);
