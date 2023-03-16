import express from 'express'
import cors from 'cors'
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from './trpc';
import { appRouter } from './router/root';
import { env } from 'env';

const app = express();

app.use(cors())
app.use(express.json())

app.use("/trpc", trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext
}))

app.listen(env.PUBLIC_SERVER_PORT, () => {
  console.log(`Server running on port ${env.PUBLIC_SERVER_PORT}`);
})
