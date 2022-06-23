"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    port: process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET || "secret",
    bcryptSalt: process.env.BCRYPT_SALT || 12,
};
exports.default = config;
