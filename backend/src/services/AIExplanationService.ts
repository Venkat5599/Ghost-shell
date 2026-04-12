import Groq from 'groq-sdk'
import { SecurityIssue, WalletRiskReport } from '../types'
import { config } from '../config'

export class AIExplanationService {
  private groq: Groq

  constructor() {
    this.groq = new Groq({
      apiKey: config.groq.apiKey,
    })
  }

  async explainVulnerabilities(issues: SecurityIssue[]): Promise<string> {
    if (issues.length === 0) {
      return 'No vulnerabilities detected. The contract appears to follow security best practices.'
    }

    const prompt = this.buildVulnerabilityPrompt(issues)
    
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are Ghost Shell, an elite AI security analyst from Section 9. Explain smart contract vulnerabilities in clear, concise language that non-technical users can understand. Be direct and focus on the risk.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: config.groq.model,
        temperature: 0.3,
        max_tokens: 500,
      })

      return completion.choices[0]?.message?.content || this.getFallbackExplanation(issues)
    } catch (error) {
      console.error('Groq API error:', error)
      return this.getFallbackExplanation(issues)
    }
  }

  async explainWalletRisk(report: WalletRiskReport): Promise<string> {
    if (report.factors.length === 0) {
      return 'This wallet shows normal activity patterns with no significant risk factors detected.'
    }

    const prompt = this.buildWalletPrompt(report)
    
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are Ghost Shell, an elite AI security analyst. Analyze wallet behavior and explain risks in simple terms. Focus on what matters for user safety.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: config.groq.model,
        temperature: 0.3,
        max_tokens: 300,
      })

      return completion.choices[0]?.message?.content || this.getFallbackWalletExplanation(report)
    } catch (error) {
      console.error('Groq API error:', error)
      return this.getFallbackWalletExplanation(report)
    }
  }

  async generateAttackScenarios(issues: SecurityIssue[]): Promise<string[]> {
    const criticalIssues = issues.filter(i => i.severity === 'critical')
    
    if (criticalIssues.length === 0) return []

    const scenarios: string[] = []
    
    for (const issue of criticalIssues.slice(0, 2)) {
      const scenario = await this.generateScenario(issue)
      scenarios.push(scenario)
    }

    return scenarios
  }

  private async generateScenario(issue: SecurityIssue): Promise<string> {
    const scenarioMap: Record<string, string> = {
      reentrancy: 'An attacker deploys a malicious contract that repeatedly calls the withdraw function before balances are updated, draining all funds.',
      'access-control': 'An unauthorized user calls privileged functions to mint tokens, change ownership, or drain contract funds.',
      delegatecall: 'An attacker provides a malicious contract address to delegatecall, executing arbitrary code in the context of the vulnerable contract.',
    }

    return scenarioMap[issue.type] || 'Potential exploitation could lead to loss of funds or unauthorized access.'
  }

  private buildVulnerabilityPrompt(issues: SecurityIssue[]): string {
    const issueList = issues
      .map(i => `- ${i.severity.toUpperCase()}: ${i.title}`)
      .join('\n')

    return `Analyze these smart contract vulnerabilities and explain the overall risk in 2-3 sentences:\n\n${issueList}\n\nFocus on the most critical issue and its potential impact.`
  }

  private buildWalletPrompt(report: WalletRiskReport): string {
    const factorList = report.factors
      .map(f => `- ${f.description}: ${f.evidence.join(', ')}`)
      .join('\n')

    return `Analyze this wallet's risk profile:\n\nRisk Score: ${report.riskScore}\nTransactions: ${report.transactionCount}\n\nRisk Factors:\n${factorList}\n\nProvide a 2-3 sentence risk assessment.`
  }

  private getFallbackExplanation(issues: SecurityIssue[]): string {
    const critical = issues.filter(i => i.severity === 'critical')
    
    if (critical.length > 0) {
      return `Critical security vulnerabilities detected. This contract has ${critical.length} critical issue(s) that could lead to loss of funds. Exercise extreme caution.`
    }

    return `This contract has ${issues.length} security issue(s) that should be addressed before deployment or interaction.`
  }

  private getFallbackWalletExplanation(report: WalletRiskReport): string {
    return `This wallet shows ${report.riskLevel} risk with ${report.suspiciousInteractions} suspicious interactions detected. Review transaction history carefully before proceeding.`
  }
}
