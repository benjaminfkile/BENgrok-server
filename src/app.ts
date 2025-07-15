import express, { Express, NextFunction, Request, Response } from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import { handleTunnelProxy } from "./tunnelServer"

const NODE_ENV = process.env.NODE_ENV
const app: Express = express()

const morganOption: string = NODE_ENV === "production" ? "tiny" : "common"

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.all("/tunnel/*", handleTunnelProxy)

app.get("/", (req: Request, res: Response) => {
  res.send("BENgrok Tunnel Server is running...")
})

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error)
  process.exit(1)
})

process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason)
})

app.use(function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err)
  const customErr = err as { status?: number; message?: string }
  const status = customErr.status || 500
  const message = customErr.message || "Internal Server Error"
  res.status(status).json({ error: message })
})

export default app
