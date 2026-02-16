import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/api'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.send('Sensor Dashboard API is running')
})

// When running in a serverless environment (e.g. Vercel), do not call `app.listen`.
// Instead export a request handler. Locally (dev) we still start the server.
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

// Export a handler for serverless platforms which expect a function as the module
// default export. This lets Vercel route requests to this Express app.
export default function handler(req: any, res: any) {
  return (app as any)(req, res)
}
