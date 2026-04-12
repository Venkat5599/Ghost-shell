import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { SecurityIssue, ScanResult, VulnerabilityType, Severity, RiskLevel } from '../types'
import { config } from '../config'

export class ContractScanner {
  private provider: ethers.JsonRpcProvider

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.hashkeyChain.rpcUrl)
  }

  async scanByAddress(address: string): Promise<ScanResult> {
    const startTime = Date.now()
    
    // Validate address
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid contract address')
    }

    // Fetch contract bytecode
    const bytecode = await this.provider.getCode(address)
    
    if (bytecode === '0x') {
      throw new Error('No contract found at this address')
    }

    // Get current block number for metadata
    const blockNumber = await this.provider.getBlockNumber()

    // Check if contract is verified (basic check)
    const isVerified = await this.checkContractVerification(address)
    
    // Detect vulnerabilities
    const issues = await this.detectVulnerabilities(bytecode, address, isVerified)
    
    // Calculate risk score
    const riskScore = this.calculateRiskScore(issues)
    const status = this.determineRiskLevel(riskScore)
    
    const scanDuration = Date.now() - startTime

    return {
      contractAddress: address,
      chainId: config.hashkeyChain.chainId,
      riskScore,
      status,
      issues,
      aiExplanation: '', // Will be filled by AI service
      manifest: {
        version: '1.0.0',
        manifestId: uuidv4(),
        timestamp: new Date().toISOString(),
        chainId: config.hashkeyChain.chainId,
        contractAddress: address,
        riskScore,
        status,
        issues,
        aiVerification: {
          explanation: '',
          attackScenarios: [],
          recommendations: [],
          model: config.groq.model,
          confidence: 0.85,
        },
        metadata: {
          scannerVersion: '1.0.0',
          scanDuration,
          cacheHit: false,
          blockNumber,
        },
      },
      timestamp: new Date().toISOString(),
      scanDuration,
      cacheHit: false,
    }
  }

  private async checkContractVerification(address: string): Promise<boolean> {
    try {
      // Try to fetch contract source from explorer API
      // For HashKey Chain testnet: https://testnet-explorer.hsk.xyz
      // This is a basic check - in production, integrate with explorer API
      
      // For now, check if bytecode is large enough to be a real contract
      const bytecode = await this.provider.getCode(address)
      return bytecode.length > 100 // Basic heuristic
    } catch (error) {
      console.error('Error checking verification:', error)
      return false
    }
  }

  private async detectVulnerabilities(bytecode: string, address: string, isVerified: boolean): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = []

    // Add warning for unverified contracts
    if (!isVerified) {
      issues.push({
        id: uuidv4(),
        type: 'access-control',
        severity: 'medium',
        title: 'Unverified Contract',
        description: 'Contract source code is not verified on the block explorer. This makes it difficult to audit.',
        recommendation: 'Verify the contract source code on the block explorer or request verification from the contract owner.',
        cweId: 'CWE-506',
      })
    }

    // Reentrancy detection (simplified pattern matching)
    if (this.hasReentrancyPattern(bytecode)) {
      issues.push({
        id: uuidv4(),
        type: 'reentrancy',
        severity: 'critical',
        title: 'Reentrancy Vulnerability Detected',
        description: 'The contract may be vulnerable to reentrancy attacks. External calls are made before state updates.',
        recommendation: 'Use the checks-effects-interactions pattern or implement ReentrancyGuard from OpenZeppelin.',
        cweId: 'CWE-841',
      })
    }

    // Access control detection
    if (this.hasAccessControlIssue(bytecode)) {
      issues.push({
        id: uuidv4(),
        type: 'access-control',
        severity: 'high',
        title: 'Missing Access Control',
        description: 'Critical functions lack proper access control mechanisms.',
        recommendation: 'Implement role-based access control using OpenZeppelin AccessControl or Ownable.',
        cweId: 'CWE-284',
      })
    }

    // Unchecked external calls
    if (this.hasUncheckedCalls(bytecode)) {
      issues.push({
        id: uuidv4(),
        type: 'unchecked-call',
        severity: 'medium',
        title: 'Unchecked External Call',
        description: 'External calls are made without checking return values.',
        recommendation: 'Always check return values of external calls or use SafeERC20.',
        cweId: 'CWE-252',
      })
    }

    // Delegatecall to untrusted contract
    if (this.hasDangerousDelegatecall(bytecode)) {
      issues.push({
        id: uuidv4(),
        type: 'delegatecall',
        severity: 'critical',
        title: 'Dangerous Delegatecall',
        description: 'Delegatecall is used with user-controlled addresses.',
        recommendation: 'Avoid delegatecall to untrusted contracts or implement strict whitelisting.',
        cweId: 'CWE-829',
      })
    }

    return issues
  }

  private hasReentrancyPattern(bytecode: string): boolean {
    // Simplified: Check for CALL opcode patterns
    // In production, use more sophisticated analysis
    return bytecode.includes('f1') || bytecode.includes('fa') // CALL, STATICCALL opcodes
  }

  private hasAccessControlIssue(bytecode: string): boolean {
    // Check for common access control patterns
    // Look for owner/admin patterns (Ownable, AccessControl)
    const hasOwnerPattern = bytecode.includes('8da5cb5b') // owner() selector
    const hasOnlyOwnerModifier = bytecode.includes('715018a6') // renounceOwnership() selector
    
    // If contract has state-changing functions but no access control
    const hasStateChanging = bytecode.includes('55') // SSTORE opcode
    
    return hasStateChanging && !hasOwnerPattern && !hasOnlyOwnerModifier
  }

  private hasUncheckedCalls(bytecode: string): boolean {
    // Check for CALL opcode (f1) without proper return value checking
    // Look for pattern: CALL followed by no ISZERO check
    const callPattern = /f1.{0,20}(?!15)/g // CALL not followed by ISZERO (15)
    return callPattern.test(bytecode)
  }

  private hasDangerousDelegatecall(bytecode: string): boolean {
    // Check for DELEGATECALL opcode (0xf4)
    return bytecode.includes('f4')
  }

  private calculateRiskScore(issues: SecurityIssue[]): number {
    let score = 0
    
    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          score += 30
          break
        case 'high':
          score += 20
          break
        case 'medium':
          score += 10
          break
        case 'low':
          score += 5
          break
      }
    }

    return Math.min(score, 100)
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score <= 30) return 'safe'
    if (score <= 70) return 'warning'
    return 'critical'
  }
}
