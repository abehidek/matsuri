import express from 'express'
import cors from 'cors'
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from './trpc';
import { appRouter } from './router/root';

const app = express();
const PORT = 4000;

app.use(cors())
app.use(express.json())

app.use("/trpc", trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext
}))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
