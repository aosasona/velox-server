"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const users_1 = require("../controllers/users");
///// View all users /////
router.get("/", users_1.viewAll);
///// Get logged in user /////
router.get("/me", users_1.getCurrentUser);
///// View one user /////
router.get("/:username", users_1.viewOne);
exports.default = router;
