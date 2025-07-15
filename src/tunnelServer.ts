import { Server as HTTPServer } from "http"
import { Request, Response } from "express"
import WebSocket, { WebSocketServer } from "ws"
import chalk from "chalk"

interface TunnelMap {
  [key: string]: WebSocket
}

const tunnels: TunnelMap = {}

export const registerTunnelServer = (server: HTTPServer) => {
  const wss = new WebSocketServer({ server })

  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url?.split("?")[1])
    const tunnelId = params.get("id") || "default"

    tunnels[tunnelId] = ws
    console.log(chalk.green(`🟢 Tunnel client connected: ${tunnelId}`))

    ws.on("pong", () => {
      console.log(chalk.gray(`💓 Heartbeat pong from: ${tunnelId}`))
    })

    ws.on("close", () => {
      console.log(chalk.yellow(`🔌 Tunnel client disconnected: ${tunnelId}`))
      delete tunnels[tunnelId]
    })

    ws.on("error", (err) => {
      console.error(chalk.red(`❌ WebSocket error for tunnel '${tunnelId}': ${err.message}`))
    })
  })
}

export const handleTunnelProxy = (req: Request, res: Response) => {
  const tunnelId = req.headers["x-tunnel-id"] as string || "default"
  const socket = tunnels[tunnelId]

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn(chalk.yellow(`⚠️  Tunnel '${tunnelId}' is not connected`))
    return res.status(503).send(`Tunnel '${tunnelId}' is not connected`)
  }

  const bodyChunks: Buffer[] = []
  req.on("data", chunk => bodyChunks.push(chunk))
  req.on("end", () => {
    const requestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: Buffer.concat(bodyChunks).toString()
    }

    socket.once("message", (message) => {
      try {
        const response = JSON.parse(message.toString())
        res.status(response.statusCode).set(response.headers).send(response.body)
        console.log(chalk.blue(`[${tunnelId}] ${req.method} ${req.url} → ${response.statusCode}`))
      } catch (err) {
        console.error(chalk.red(`[${tunnelId}] ❌ Failed to parse response`))
        res.status(500).send("Error parsing tunnel response")
      }
    })

    socket.send(JSON.stringify(requestData))
  })
}
