import express from 'express'
import cors from 'cors'
import verifyRouter from '../src/routes/verify.js'
import errorHandler from '../src/middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

// Mount routes
app.use('/api', verifyRouter)

// Error handling
app.use(errorHandler)

// Export for Vercel
export default app