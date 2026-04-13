/**
 * Local Development Server
 * Simulates Vercel serverless functions locally
 * Run with: npm run dev:server
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import API handlers
import healthHandler from './api/health'
import scanContractHandler from './api/scan-contract'
import analyzeWalletHandler from './api/analyze-wallet'
import riskCheckHandler from './api/risk-check'
import anomalyCheckHandler from './api/anomaly-check'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Convert Vercel handlers to Express routes
const wrapVercelHandler = (handler: any) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      // Create Vercel-like request/response objects
      const vercelReq = {
        ...req,
        query: req.query,
        body: req.body,
        method: req.method,
      }
      
      const vercelRes = {
        status: (code: number) => {
          res.status(code)
          return vercelRes
        },
        json: (data: any) => {
          res.json(data)
        },
        end: () => {
          res.end()
        },
        setHeader: (key: string, value: string) => {
          res.setHeader(key, value)
        },
      }
      
      await handler(vercelReq, vercelRes)
    } catch (error) {
      console.error('Handler error:', error)
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      })
    }
  }
}

// API Routes
app.get('/api/health', wrapVercelHandler(healthHandler))
app.post('/api/scan-contract', wrapVercelHandler(scanContractHandler))
app.post('/api/analyze-wallet', wrapVercelHandler(analyzeWalletHandler))
app.post('/api/risk-check', wrapVercelHandler(riskCheckHandler))
app.post('/api/anomaly-check', wrapVercelHandler(anomalyCheckHandler))

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Ghost Shell Security Protocol',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'GET  /api/health',
      'POST /api/scan-contract',
      'POST /api/analyze-wallet',
      'POST /api/risk-check',
      'POST /api/anomaly-check',
    ],
  })
})

// Start server
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════')
  console.log('🛡️  Ghost Shell Backend - Local Development Server')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\n✅ Server running on http://localhost:${PORT}`)
  console.log('\n📡 Available endpoints:')
  console.log(`   GET  http://localhost:${PORT}/api/health`)
  console.log(`   POST http://localhost:${PORT}/api/scan-contract`)
  console.log(`   POST http://localhost:${PORT}/api/analyze-wallet`)
  console.log(`   POST http://localhost:${PORT}/api/risk-check`)
  console.log(`   POST http://localhost:${PORT}/api/anomaly-check`)
  console.log('\n🔗 Frontend should use: http://localhost:' + PORT + '/api')
  console.log('═══════════════════════════════════════════════════\n')
})

export default app
