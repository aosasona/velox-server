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
exports.viewOne = exports.viewAll = exports.getCurrentUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const error_handler_1 = __importDefault(require("../../utils/handlers/error.handler"));
const response_handler_1 = __importDefault(require("../../utils/handlers/response.handler"));
const filter_util_1 = __importDefault(require("../../utils/filter.util"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get current user
const getCurrentUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customReq = req;
        const currentUser = new mongoose_1.default.Types.ObjectId(customReq.user.id);
        const user = yield user_model_1.default.findById(currentUser).select(["-password", "-__v", "-createdAt", "-updatedAt"]).lean();
        if (!user) {
            throw new error_handler_1.default("User not found", 404);
        }
        let { _id, username } = user;
        return new response_handler_1.default(res).success("User found", { id: _id, username }, 200);
    }
    catch (err) {
        return new response_handler_1.default(res).error(err.message, {}, err.status || 500);
    }
}));
exports.getCurrentUser = getCurrentUser;
// View all users
const viewAll = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // _id : { $ne: req._id }
        const customReq = req;
        const currentUser = customReq.user.id;
        let users = yield user_model_1.default.find({}).select(["-password", "-updatedAt", "-__id", "-__v"]);
        users = users.filter(user => user._id.toString() !== currentUser);
        if (!users) {
            throw new error_handler_1.default("No users found", 404);
        }
        return new response_handler_1.default(res).success("Fetched all users", users, 200);
    }
    catch (err) {
        return new response_handler_1.default(res).error(err.message, {}, err.status || 500);
    }
}));
exports.viewAll = viewAll;
// View one user
const viewOne = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = filter_util_1.default.obj(req.params, "username");
        let { username } = data;
        const user = yield user_model_1.default.findOne({ username: username.toLowerCase() }).select(["-password", "-updatedAt", "-__id", "-__v"]);
        if (!user) {
            throw new error_handler_1.default("User not found", 404);
        }
        return new response_handler_1.default(res).success(`Successfully fetched data for ${user === null || user === void 0 ? void 0 : user.username}`, user, 200);
    }
    catch (err) {
        return new response_handler_1.default(res).error(err.message || "Something went wrong", {}, err.status || 500);
    }
}));
exports.viewOne = viewOne;
