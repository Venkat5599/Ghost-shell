export type VulnerabilityType =
  | 'reentrancy'
  | 'access-control'
  | 'arithmetic'
  | 'unchecked-call'
  | 'delegatecall'
  | 'timestamp-dependence'
  | 'tx-origin'
  | 'uninitialized-storage'
  | 'denial-of-service'
  | 'front-running'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type RiskLevel = 'safe' | 'warning' | 'critical'

export interface SecurityIssue {
  id: string
  type: VulnerabilityType
  severity: Severity
  title: string
  description: string
  location?: {
    file?: string
    line?: number
    column?: number
    snippet?: string
  }
  recommendation: string
  cweId?: string
  references?: string[]
}

export interface ScanResult {
  contractAddress: string
  chainId: number
  riskScore: number
  status: RiskLevel
  issues: SecurityIssue[]
  aiExplanation: string
  manifest: AssuranceManifest
  timestamp: string
  scanDuration: number
  cacheHit: boolean
}

export interface AssuranceManifest {
  version: string
  manifestId: string
  timestamp: string
  chainId: number
  contractAddress: string
  riskScore: number
  status: RiskLevel
  issues: SecurityIssue[]
  aiVerification: {
    explanation: string
    attackScenarios: string[]
    recommendations: string[]
    model: string
    confidence: number
  }
  metadata: {
    scannerVersion: string
    scanDuration: number
    cacheHit: boolean
    blockNumber?: number
  }
}

export type RiskFactorType =
  | 'risky-contract-interaction'
  | 'high-frequency-trading'
  | 'suspicious-token-transfers'
  | 'mixer-usage'
  | 'blacklisted-address'
  | 'flash-loan-activity'
  | 'rug-pull-participation'
  | 'new-wallet'
  | 'bot-activity'
  | 'empty-active-wallet'

export interface RiskFactor {
  type: RiskFactorType
  severity: Severity
  description: string
  evidence: string[]
  weight: number
}

export interface WalletRiskReport {
  walletAddress: string
  chainId: number
  riskLevel: 'low' | 'medium' | 'high'
  riskScore: number
  factors: RiskFactor[]
  transactionCount: number
  balance?: string
  suspiciousInteractions: number
  firstSeen: string
  lastActivity: string
  aiSummary: string
  timestamp: string
}

export interface RiskCheckParams {
  contractAddress: string
  walletAddress: string
  chainId: number
  transactionValue?: string
  transactionData?: string
}

export interface AggregatedRisk {
  overallRiskScore: number
  overallRiskLevel: RiskLevel
  contractRisk: number
  walletRisk: number
  recommendation: 'proceed' | 'caution' | 'block'
  reasoning: string
}
