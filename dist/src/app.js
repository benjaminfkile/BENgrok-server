"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const tunnelServer_1 = require("./tunnelServer");
const NODE_ENV = process.env.NODE_ENV;
const app = (0, express_1.default)();
const morganOption = NODE_ENV === "production" ? "tiny" : "common";
app.use((0, morgan_1.default)(morganOption));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.all("/tunnel/*", tunnelServer_1.handleTunnelProxy);
app.get("/", (req, res) => {
    res.send("BENgrok Tunnel Server is running...");
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
app.use(function errorHandler(err, req, res, next) {
    if (res.headersSent)
        return next(err);
    const customErr = err;
    const status = customErr.status || 500;
    const message = customErr.message || "Internal Server Error";
    res.status(status).json({ error: message });
});
exports.default = app;
