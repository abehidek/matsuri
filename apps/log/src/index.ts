import express from "express";
import cors from "cors";
import { env } from "env";
import router from "./router";

const app = express();

const ALLOWED_ORIGINS: string[] = [
  env.PUBLIC_SERVER_URL,
  env.PUBLIC_WEB_URL,
  env.PUBLIC_AUTH_URL,
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
app.use(express.json());

app.use("/", router);

app.listen(env.PUBLIC_LOG_PORT, () => {
  console.log(`Server running on port ${env.PUBLIC_LOG_PORT}`);
});

export { app };
