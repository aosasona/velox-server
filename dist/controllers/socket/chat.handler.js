"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getCurrentChat = void 0;
const message_model_1 = __importDefault(require("../../models/message.model"));
const conversation_model_1 = __importDefault(require("../../models/conversation.model"));
const error_handler_1 = __importDefault(require("../../utils/handlers/error.handler"));
///// Get all messages /////
const getCurrentChat = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!chatId) {
            return { chatId: chatId || "", messages: [] };
        }
        const messages = yield message_model_1.default.find({ chatId: chatId }).populate("receiver", "username").populate("sender", "username").select(["-_id"]).sort({ createdAt: "asc" });
        return { chatId, messages };
    }
    catch (err) {
        throw new error_handler_1.default("Message not sent!", 500);
    }
});
exports.getCurrentChat = getCurrentChat;
///// SEND A NEW MESSAGE /////
const sendMessage = (data, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if conversation exists
        const conversation = yield conversation_model_1.default.findOne({
            $or: [{ userA: data.sender, userB: data.receiver }, { userB: data.sender, userA: data.receiver }]
        });
        let chatId = socketId;
        if (!conversation) {
            // Create a new conversation
            const newConversation = new conversation_model_1.default({
                userA: data.sender,
                userB: data.receiver
            });
            yield newConversation.save(); // Save the new conversation
            chatId = (_a = newConversation === null || newConversation === void 0 ? void 0 : newConversation._id) === null || _a === void 0 ? void 0 : _a.toString();
        }
        if (!data.receiver || !data.sender || !chatId || !data.message) {
            throw new error_handler_1.default("Message not sent!", 400);
        }
        const message = yield message_model_1.default.create({
            receiver: data.receiver,
            sender: data.sender,
            chatId: chatId,
            message: data.message
        });
        return { message, chatId };
    }
    catch (err) {
        throw new error_handler_1.default("Message not sent!", 500);
    }
});
exports.sendMessage = sendMessage;
