import { Express } from "express"
import session from "express-session"
import cors from "cors"

export default async function expressLoader({ app }: { app: Express }) {
  const configManager = require("../loaders/config").default
  const configModule = configManager.config

  const isProduction = configManager.isProduction
  const NODE_ENV = process.env.NODE_ENV || "development"
  const isStaging = NODE_ENV === "staging"
  const isTest = NODE_ENV === "test"

  // Default cookie security settings
  let sameSite: string | boolean = false
  let secure = false

  // If we are in production or staging, secure cookies
  if (isProduction || isStaging) {
    secure = true
    sameSite = "none" // Important for cross-site cookies (frontend <-> backend)
  }

  // Enable CORS (very important for frontend integration)
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  )

  // Trust the proxy if you're behind one (Nginx, Vercel, etc.)
  app.set("trust proxy", 1)

  // Session configuration
  const { http, sessionOptions } = configModule.projectConfig
  const sessionOpts = {
    name: sessionOptions?.name ?? "connect.sid",
    secret: sessionOptions?.secret ?? http.cookieSecret,
    resave: sessionOptions?.resave ?? true,
    rolling: sessionOptions?.rolling ?? false,
    saveUninitialized: sessionOptions?.saveUninitialized ?? false,
    proxy: true, // Important for secure cookies over proxies
    cookie: {
      sameSite,
      secure,
      maxAge: sessionOptions?.ttl ?? 10 * 60 * 60 * 1000, // 10h par défaut
    },
    store: null,
  }

  app.use(session(sessionOpts))
}
