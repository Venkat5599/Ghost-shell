const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface ScanResult {
  contractAddress: string
  chainId: number
  riskScore: number
  status: 'safe' | 'warning' | 'critical'
  issues: Array<{
    id: string
    type: string
    severity: string
    title: string
    description: string
    recommendation: string
    cweId?: string
  }>
  aiExplanation: string
  timestamp: string
  scanDuration: number
  cacheHit: boolean
}

export interface WalletRiskReport {
  walletAddress: string
  chainId: number
  riskLevel: 'low' | 'medium' | 'high'
  riskScore: number
  factors: Array<{
    type: string
    severity: string
    description: string
    evidence: string[]
    weight: number
  }>
  transactionCount: number
  suspiciousInteractions: number
  firstSeen: string
  lastActivity: string
  aiSummary: string
  timestamp: string
}

export interface RiskCheckResult {
  overallRiskScore: number
  overallRiskLevel: 'safe' | 'warning' | 'critical'
  contractRisk: number
  walletRisk: number
  recommendation: 'proceed' | 'caution' | 'block'
  reasoning: string
  contractScan: ScanResult
  walletReport: WalletRiskReport
  timestamp: string
}

export async function scanContract(contractAddress: string): Promise<ScanResult> {
  const response = await fetch(`${API_BASE_URL}/scan-contract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contractAddress }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to scan contract')
  }

  const data = await response.json()
  return data.data
}

export async function analyzeWallet(walletAddress: string): Promise<WalletRiskReport> {
  const response = await fetch(`${API_BASE_URL}/analyze-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to analyze wallet')
  }

  const data = await response.json()
  return data.data
}

export async function checkRisk(
  contractAddress: string,
  walletAddress: string
): Promise<RiskCheckResult> {
  const response = await fetch(`${API_BASE_URL}/risk-check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contractAddress, walletAddress }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to check risk')
  }

  const data = await response.json()
  return data.data
}
