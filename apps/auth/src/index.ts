import express from 'express'
import cors from 'cors'
import authRouter from './routers/auth'

const app = express();
const PORT = 5000;

app.use(cors())
app.use(express.json())

app.use(authRouter)

app.listen(PORT, () => {
  console.log(`[Auth]: Server running on port ${PORT}`);
})
