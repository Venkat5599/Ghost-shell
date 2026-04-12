import { Router, Request, Response } from 'express'
import { ContractScanner } from '../services/ContractScanner'
import { AIExplanationService } from '../services/AIExplanationService'
import { CacheService } from '../services/CacheService'
import { z } from 'zod'

const router = Router()
const scanner = new ContractScanner()
const aiService = new AIExplanationService()
const cache = new CacheService()

const ScanRequestSchema = z.object({
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chainId: z.number().optional(),
})

router.post('/scan-contract', async (req: Request, res: Response) => {
  try {
    const { contractAddress } = ScanRequestSchema.parse(req.body)

    // Check cache first
    const cached = await cache.getCachedContractScan(contractAddress)
    if (cached) {
      return res.json({
        success: true,
        data: cached,
      })
    }

    // Perform scan
    const scanResult = await scanner.scanByAddress(contractAddress)

    // Generate AI explanation
    const aiExplanation = await aiService.explainVulnerabilities(scanResult.issues)
    const attackScenarios = await aiService.generateAttackScenarios(scanResult.issues)

    scanResult.aiExplanation = aiExplanation
    scanResult.manifest.aiVerification.explanation = aiExplanation
    scanResult.manifest.aiVerification.attackScenarios = attackScenarios

    // Cache result
    await cache.cacheContractScan(contractAddress, scanResult)

    res.json({
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
})

router.get('/manifest/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // In production, fetch from database
    res.status(404).json({
      success: false,
      error: 'Manifest not found',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
})

export default router
