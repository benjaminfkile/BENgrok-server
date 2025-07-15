"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTunnelProxy = exports.registerTunnelServer = void 0;
const ws_1 = __importStar(require("ws"));
const tunnels = {};
const registerTunnelServer = (server) => {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (ws, req) => {
        var _a;
        const params = new URLSearchParams((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("?")[1]);
        const tunnelId = params.get("id") || "default";
        tunnels[tunnelId] = ws;
        console.log(`Tunnel client connected: ${tunnelId}`);
        ws.on("close", () => {
            console.log(`Tunnel client disconnected: ${tunnelId}`);
            delete tunnels[tunnelId];
        });
    });
};
exports.registerTunnelServer = registerTunnelServer;
const handleTunnelProxy = (req, res) => {
    const tunnelId = req.headers["x-tunnel-id"] || "default";
    const socket = tunnels[tunnelId];
    if (!socket || socket.readyState !== ws_1.default.OPEN) {
        return res.status(503).send(`Tunnel '${tunnelId}' is not connected`);
    }
    const bodyChunks = [];
    req.on("data", chunk => bodyChunks.push(chunk));
    req.on("end", () => {
        const requestData = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: Buffer.concat(bodyChunks).toString()
        };
        socket.once("message", (message) => {
            try {
                const response = JSON.parse(message.toString());
                res.status(response.statusCode).set(response.headers).send(response.body);
            }
            catch (err) {
                res.status(500).send("Error parsing tunnel response");
            }
        });
        socket.send(JSON.stringify(requestData));
    });
};
exports.handleTunnelProxy = handleTunnelProxy;
