import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc";
import { appRouter } from "./router/root";
import { env } from "env";

const app = express();

const ALLOWED_ORIGINS: string[] = [env.PUBLIC_WEB_URL];

console.log(env.PUBLIC_WEB_URL);

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(env.PUBLIC_SERVER_PORT, () => {
  console.log(`Server running on port ${env.PUBLIC_SERVER_PORT}`);
});
