import { VercelRequest, VercelResponse } from '@vercel/node'
import { ContractScanner } from '../src/services/ContractScanner'
import { AIExplanationService } from '../src/services/AIExplanationService'
import { z } from 'zod'

const ScanRequestSchema = z.object({
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
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
    const { contractAddress } = ScanRequestSchema.parse(req.body)

    const scanner = new ContractScanner()
    const aiService = new AIExplanationService()

    // Perform scan
    const scanResult = await scanner.scanByAddress(contractAddress)

    // Generate AI explanation
    const aiExplanation = await aiService.explainVulnerabilities(scanResult.issues)
    const attackScenarios = await aiService.generateAttackScenarios(scanResult.issues)

    scanResult.aiExplanation = aiExplanation
    scanResult.manifest.aiVerification.explanation = aiExplanation
    scanResult.manifest.aiVerification.attackScenarios = attackScenarios

    res.status(200).json({
      success: true,
      data: scanResult,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors,
      })
    }

    console.error('Scan error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
