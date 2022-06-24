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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_handler_1 = __importDefault(require("../utils/handlers/response.handler"));
const token_helper_1 = require("../helpers/token.helper");
const error_handler_1 = __importDefault(require("../utils/handlers/error.handler"));
const authMiddleware = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        // Get the header
        const header = req.headers.authorization || req.headers.Authorization;
        if (!header) {
            throw new error_handler_1.default("Unauthorized!", 401);
        }
        // Check if the header is an array
        if (typeof header === "string") {
            if (header.startsWith("Bearer ")) {
                token = header.split(" ")[1];
            }
        }
        else {
            if (header.length > 1) {
                token = header[0].split(" ")[1];
            }
        }
        // Verify the token
        if (!token) {
            throw new error_handler_1.default("Unauthorized!", 401);
        }
        const decoded = yield (0, token_helper_1.verifyToken)(token);
        // If token could not be verified
        if (!decoded) {
            throw new error_handler_1.default("Unauthorized!", 401);
        }
        // Set the user to the request object
        const customReq = req;
        customReq.user = decoded;
        next();
    }
    catch (err) {
        // console.log(err);
        return new response_handler_1.default(res).error("Something went wrong", {}, err.status || 500);
    }
}));
exports.default = authMiddleware;
