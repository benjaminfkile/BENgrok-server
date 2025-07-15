"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const tunnelServer_1 = require("./src/tunnelServer");
const app_1 = __importDefault(require("./src/app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const server = (0, http_1.createServer)(app_1.default);
(0, tunnelServer_1.registerTunnelServer)(server);
server.listen(PORT, () => {
    console.log(`⚡️[server]: BENgrok Tunnel Server running on http://localhost:${PORT}`);
});
