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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const validator_1 = __importDefault(require("validator"));
const response_handler_1 = __importDefault(require("../../utils/handlers/response.handler"));
const error_handler_1 = __importDefault(require("../../utils/handlers/error.handler"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const token_helper_1 = require("../../helpers/token.helper");
const filter_util_1 = __importDefault(require("../../utils/filter.util"));
const login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = filter_util_1.default.obj(req.body, "username", "password");
        let { username, password } = body;
        // Check if any of the fields are empty
        if (!(username && password)) {
            throw new error_handler_1.default("Please fill in all fields", 400);
        }
        // If the password or username is not an ASCII string
        if (!validator_1.default.isAscii(username) || !validator_1.default.isAscii(password)) {
            throw new error_handler_1.default("Usernames and passwords cannot contain emojis and special characters", 400);
        }
        // Remove special characters from username
        username = username.replace(/[^a-zA-Z0-9 ]/g, "");
        // Find the user
        const user = yield user_model_1.default.findOne({ username: username.toLowerCase() });
        if (!user) {
            throw new error_handler_1.default("User not found", 404);
        }
        // Check if password is correct
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new error_handler_1.default("Password is incorrect", 400);
        }
        // Return token
        return new response_handler_1.default(res).success("Welcome back!", {
            username: user === null || user === void 0 ? void 0 : user.username,
            id: user === null || user === void 0 ? void 0 : user._id.toString(),
            token: (0, token_helper_1.generateToken)(user === null || user === void 0 ? void 0 : user._id.toString())
        });
    }
    catch (err) {
        //   console.log(err);
        return new response_handler_1.default(res).error(err.message || "Something went wrong", {}, err.status || 500);
    }
}));
exports.default = login;
