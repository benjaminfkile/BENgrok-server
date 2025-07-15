import dotenv from "dotenv"
import { createServer } from "http"
import { registerTunnelServer } from "./src/tunnelServer"
import app from "./src/app"

dotenv.config()

const PORT = process.env.PORT || 8000
const server = createServer(app)

registerTunnelServer(server)

server.listen(PORT, () => {
  console.log(`⚡️[server]: BENgrok Tunnel Server running on http://localhost:${PORT}`)
})
