import { VercelRequest, VercelResponse } from '@vercel/node'
import { ContractScanner } from '../src/services/ContractScanner'
import { WalletAnalyzer } from '../src/services/WalletAnalyzer'
import { AIExplanationService } from '../src/services/AIExplanationService'
import { RiskAggregator } from '../src/services/RiskAggregator'
import { z } from 'zod'

const RiskCheckSchema = z.object({
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
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
    const { contractAddress, walletAddress } = RiskCheckSchema.parse(req.body)

    const scanner = new ContractScanner()
    const analyzer = new WalletAnalyzer()
    const aiService = new AIExplanationService()
    const aggregator = new RiskAggregator()

    // Parallel execution for speed
    const [contractScan, walletReport] = await Promise.all([
      (async () => {
        const scan = await scanner.scanByAddress(contractAddress)
        const explanation = await aiService.explainVulnerabilities(scan.issues)
        scan.aiExplanation = explanation
        return scan
      })(),
      (async () => {
        const report = await analyzer.analyzeWallet(walletAddress)
        const summary = await aiService.explainWalletRisk(report)
        report.aiSummary = summary
        return report
      })(),
    ])

    // Aggregate risks
    const aggregatedRisk = aggregator.aggregateRisk(contractScan, walletReport)

    res.status(200).json({
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
}
