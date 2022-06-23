"use strict";
/**
 * @description Response handler
 */
Object.defineProperty(exports, "__esModule", { value: true });
class CustomResponse {
    constructor(res) {
        this.res = res;
    }
    // Send success response with status code and data
    success(message = "", data = {}, statusCode = 200) {
        return this.res.status(statusCode || 200).json({
            error: false,
            data,
            message,
        });
    }
    // Send error response with status code and error message
    error(message = "", data = {}, statusCode = 500) {
        return this.res.status(statusCode || 500).json({
            error: true,
            data,
            message,
        });
    }
}
exports.default = CustomResponse;
