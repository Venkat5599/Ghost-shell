import { VercelRequest, VercelResponse } from '@vercel/node'
import { WalletAnalyzer } from '../src/services/WalletAnalyzer'
import { AIExplanationService } from '../src/services/AIExplanationService'
import { z } from 'zod'

const AnalyzeRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { walletAddress } = AnalyzeRequestSchema.parse(req.body)

    const analyzer = new WalletAnalyzer()
    const aiService = new AIExplanationService()

    // Perform analysis
    const report = await analyzer.analyzeWallet(walletAddress)

    // Generate AI summary
    const aiSummary = await aiService.explainWalletRisk(report)
    report.aiSummary = aiSummary

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors,
      })
    }

    console.error('Analysis error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
