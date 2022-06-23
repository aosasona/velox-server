"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
//APP MIDDLE-WARES
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.disable("x-powered-by");
if (process.env.NODE_ENV === "production") {
    app.use((0, helmet_1.default)());
}
//APP ROUTES - IMPORT
const routes_1 = __importDefault(require("./routes"));
app.use("/api", routes_1.default);
//DEFAULT RESPONSE TO TEST API
app.get("*", (req, res) => {
    res.status(200).send("Hello, world!");
});
exports.default = app;
