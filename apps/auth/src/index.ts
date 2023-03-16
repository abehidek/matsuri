import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRouter from './routers/auth'
import { env } from 'env'

const app = express();

const ALLOWED_ORIGINS: string[] = [
  env.PUBLIC_SERVER_URL,
  env.PUBLIC_WEB_URL,
];

app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: '*',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser());

app.use(authRouter)

app.listen(env.PUBLIC_AUTH_PORT, () => {
  console.log(`Server running on port ${env.PUBLIC_AUTH_PORT}`);
})

export { app }
