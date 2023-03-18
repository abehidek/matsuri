import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth";
import { env } from "env";
import { LogClient } from "log-sdk";

export const logger = new LogClient({
  appName: "auth",
});

const app = express();

const ALLOWED_ORIGINS: string[] = [env.PUBLIC_SERVER_URL, env.PUBLIC_WEB_URL];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);

app.listen(env.PUBLIC_AUTH_PORT, () => {
  logger.log(`Server running on port ${env.PUBLIC_AUTH_PORT}`, "auth:start");
});

export { app };
