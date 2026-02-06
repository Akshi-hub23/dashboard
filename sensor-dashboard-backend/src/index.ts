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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
