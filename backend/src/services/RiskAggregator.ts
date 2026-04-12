import { ScanResult, WalletRiskReport, AggregatedRisk, RiskLevel } from '../types'
import { ContractScanner } from './ContractScanner'
import { WalletAnalyzer } from './WalletAnalyzer'

export class RiskAggregator {
  async performRiskCheck(contractAddress: string, walletAddress: string) {
    const scanner = new ContractScanner()
    const analyzer = new WalletAnalyzer()

    // Perform scans
    const contractScan = await scanner.scanByAddress(contractAddress)
    const walletReport = await analyzer.analyzeWallet(walletAddress)

    // Aggregate risks
    const aggregated = this.aggregateRisk(contractScan, walletReport)

    // Generate warnings
    const warnings: string[] = []
    
    if (contractScan.riskScore > 70) {
      warnings.push('Critical vulnerabilities detected in contract')
    }
    
    if (walletReport.riskScore > 70) {
      warnings.push('High-risk wallet behavior detected')
    }

    contractScan.issues.forEach(issue => {
      if (issue.severity === 'critical') {
        warnings.push(`${issue.title}: ${issue.description}`)
      }
    })

    return {
      overallRisk: aggregated.overallRiskScore,
      riskLevel: aggregated.overallRiskLevel,
      recommendation: aggregated.recommendation,
      contractRisk: aggregated.contractRisk,
      walletRisk: aggregated.walletRisk,
      warnings,
      reasoning: aggregated.reasoning,
    }
  }

  aggregateRisk(contractScan: ScanResult, walletReport: WalletRiskReport): AggregatedRisk {
    const contractRisk = contractScan.riskScore
    const walletRisk = walletReport.riskScore

    // Weighted average: contract risk is more important (70/30 split)
    const overallRiskScore = Math.round(contractRisk * 0.7 + walletRisk * 0.3)
    
    const overallRiskLevel = this.determineRiskLevel(overallRiskScore)
    const recommendation = this.determineRecommendation(overallRiskLevel, contractRisk, walletRisk)
    const reasoning = this.generateReasoning(overallRiskLevel, contractRisk, walletRisk)

    return {
      overallRiskScore,
      overallRiskLevel,
      contractRisk,
      walletRisk,
      recommendation,
      reasoning,
    }
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score <= 30) return 'safe'
    if (score <= 70) return 'warning'
    return 'critical'
  }

  private determineRecommendation(
    level: RiskLevel,
    contractRisk: number,
    walletRisk: number
  ): 'proceed' | 'caution' | 'block' {
    if (level === 'critical' || contractRisk > 80) return 'block'
    if (level === 'warning') return 'caution'
    return 'proceed'
  }

  private generateReasoning(level: RiskLevel, contractRisk: number, walletRisk: number): string {
    if (level === 'critical') {
      if (contractRisk > 70 && walletRisk > 70) {
        return 'High risk detected in both contract and wallet. Transaction should be blocked for your safety.'
      }
      if (contractRisk > 70) {
        return 'Critical vulnerabilities detected in the target contract. Do not proceed with this transaction.'
      }
      return 'Wallet shows high-risk behavior patterns. Exercise extreme caution.'
    }

    if (level === 'warning') {
      return 'Moderate risk detected. Review the security findings carefully before proceeding.'
    }

    return 'Low risk detected. Transaction appears safe to proceed.'
  }
}
