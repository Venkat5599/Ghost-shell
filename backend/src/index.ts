import express from 'express'
import cors from 'cors'
import { config } from './config'
import scannerRoutes from './routes/scanner'
import walletRoutes from './routes/wallet'
import riskRoutes from './routes/risk'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ghost Shell Security Protocol',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api', scannerRoutes)
app.use('/api', walletRoutes)
app.use('/api', riskRoutes)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

// Start server
app.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   GHOST SHELL - 攻殻機動隊                            ║
║   Security Protocol Active                            ║
║                                                       ║
║   Server running on port ${config.port}                      ║
║   Environment: ${config.nodeEnv}                    ║
║                                                       ║
║   Section 9 • Public Security                        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  process.exit(0)
})
