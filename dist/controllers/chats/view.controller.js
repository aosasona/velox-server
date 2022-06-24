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
exports.getCurrent = exports.getAll = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_handler_1 = __importDefault(require("../../utils/handlers/response.handler"));
const conversation_model_1 = __importDefault(require("../../models/conversation.model"));
const error_handler_1 = __importDefault(require("../../utils/handlers/error.handler"));
///// Get All Of A Current User's Chats /////
const getAll = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customReq = req;
        const currentUser = customReq.user.id;
        const chats = yield conversation_model_1.default.find({
            $or: [{ userA: currentUser }, { userB: currentUser }]
        }).populate("userA", "username").populate("userB", "username");
        if (!chats) {
            throw new error_handler_1.default("No chats found", 404);
        }
        return new response_handler_1.default(res).success("Fetched all chats", chats, 200);
    }
    catch (err) {
        return new response_handler_1.default(res).error(err.message, {}, err.status || 500);
    }
}));
exports.getAll = getAll;
///// Get Current Chats /////
const getCurrent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customReq = req;
        const currentUser = customReq.user.id;
    }
    catch (err) {
        return new response_handler_1.default(res).error(err.message, {}, err.status || 500);
    }
}));
exports.getCurrent = getCurrent;
