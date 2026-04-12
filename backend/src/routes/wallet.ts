import { Router, Request, Response } from 'express'
import { WalletAnalyzer } from '../services/WalletAnalyzer'
import { AIExplanationService } from '../services/AIExplanationService'
import { CacheService } from '../services/CacheService'
import { z } from 'zod'

const router = Router()
const analyzer = new WalletAnalyzer()
const aiService = new AIExplanationService()
const cache = new CacheService()

const AnalyzeRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chainId: z.number().optional(),
})

router.post('/analyze-wallet', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = AnalyzeRequestSchema.parse(req.body)

    // Check cache first
    const cached = await cache.getCachedWalletAnalysis(walletAddress)
    if (cached) {
      return res.json({
        success: true,
        data: cached,
      })
    }

    // Perform analysis
    const report = await analyzer.analyzeWallet(walletAddress)

    // Generate AI summary
    const aiSummary = await aiService.explainWalletRisk(report)
    report.aiSummary = aiSummary

    // Cache result
    await cache.cacheWalletAnalysis(walletAddress, report)

    res.json({
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
})

export default router
