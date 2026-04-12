import { Router, Request, Response } from 'express'
import { ContractScanner } from '../services/ContractScanner'
import { WalletAnalyzer } from '../services/WalletAnalyzer'
import { AIExplanationService } from '../services/AIExplanationService'
import { RiskAggregator } from '../services/RiskAggregator'
import { CacheService } from '../services/CacheService'
import { z } from 'zod'

const router = Router()
const scanner = new ContractScanner()
const analyzer = new WalletAnalyzer()
const aiService = new AIExplanationService()
const aggregator = new RiskAggregator()
const cache = new CacheService()

const RiskCheckSchema = z.object({
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  chainId: z.number().optional(),
  transactionValue: z.string().optional(),
  transactionData: z.string().optional(),
})

router.post('/risk-check', async (req: Request, res: Response) => {
  try {
    const { contractAddress, walletAddress } = RiskCheckSchema.parse(req.body)

    // Parallel execution for speed
    const [contractScan, walletReport] = await Promise.all([
      (async () => {
        const cached = await cache.getCachedContractScan(contractAddress)
        if (cached) return cached
        
        const scan = await scanner.scanByAddress(contractAddress)
        const explanation = await aiService.explainVulnerabilities(scan.issues)
        scan.aiExplanation = explanation
        await cache.cacheContractScan(contractAddress, scan)
        return scan
      })(),
      (async () => {
        const cached = await cache.getCachedWalletAnalysis(walletAddress)
        if (cached) return cached
        
        const report = await analyzer.analyzeWallet(walletAddress)
        const summary = await aiService.explainWalletRisk(report)
        report.aiSummary = summary
        await cache.cacheWalletAnalysis(walletAddress, report)
        return report
      })(),
    ])

    // Aggregate risks
    const aggregatedRisk = aggregator.aggregateRisk(contractScan, walletReport)

    res.json({
      success: true,
      data: {
        ...aggregatedRisk,
        contractScan,
        walletReport,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors,
      })
    }

    console.error('Risk check error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
})

export default router
