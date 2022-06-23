"use strict";
/**
 * @description Custom Error Class
 * @param {string} message
 * @param {number} statusCode
 */
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message = "", statusCode = 500) {
        super(message);
        this.name = "CustomError";
        this.status = statusCode || 500;
        this.message = message;
        this.stack = new Error().stack;
        this.date = new Date();
    }
}
exports.default = CustomError;
