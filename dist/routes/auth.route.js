"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const auth_1 = require("../controllers/auth");
///// Create a new user /////
router.post("/create", auth_1.create);
///// Login to your account /////
router.post("/login", auth_1.login);
exports.default = router;
