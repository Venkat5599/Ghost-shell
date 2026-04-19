import { checkRisk } from './api'

export interface TransactionRequest {
  to?: string
  from?: string
  value?: string
  data?: string
}

export interface RiskCheckResult {
  allowed: boolean
  riskLevel: 'safe' | 'warning' | 'critical'
  overallRisk: number
  warnings: string[]
  recommendation: string
  vulnerabilities: Array<{
    title: string
    severity: string
    description: string
    recommendation: string
  }>
  contractRisk: number
  walletRisk: number
}

/**
 * Ghost Shell Transaction Guard
 * Intercepts transactions and performs risk checks before execution
 */
export class TransactionGuard {
  private static instance: TransactionGuard
  private enabled: boolean = true

  private constructor() {}

  static getInstance(): TransactionGuard {
    if (!TransactionGuard.instance) {
      TransactionGuard.instance = new TransactionGuard()
    }
    return TransactionGuard.instance
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Check transaction risk before execution
   */
  async checkTransaction(tx: TransactionRequest): Promise<RiskCheckResult> {
    if (!this.enabled) {
      return {
        allowed: true,
        riskLevel: 'safe',
        overallRisk: 0,
        warnings: [],
        recommendation: 'Ghost Shell protection is disabled',
        vulnerabilities: [],
        contractRisk: 0,
        walletRisk: 0
      }
    }

    if (!tx.to) {
      return {
        allowed: true,
        riskLevel: 'safe',
        overallRisk: 0,
        warnings: ['Contract deployment transaction'],
        recommendation: 'Proceed with caution',
        vulnerabilities: [],
        contractRisk: 0,
        walletRisk: 0
      }
    }

    try {
      // Perform risk check via API
      const result = await checkRisk(tx.to, tx.from || '')

      // Determine if transaction should be blocked
      // Block if overall risk > 65 OR contract risk > 70
      const shouldBlock = result.overallRiskScore > 65 || result.contractRisk > 70
      const allowed = !shouldBlock

      const riskLevel = result.overallRiskScore > 65 ? 'critical' : 
                       result.overallRiskScore > 35 ? 'warning' : 'safe'

      // Extract vulnerabilities from contract scan
      const vulnerabilities = result.contractScan.issues.map(issue => ({
        title: issue.title,
        severity: issue.severity,
        description: issue.description,
        recommendation: issue.recommendation
      }))

      // Build warnings array
      const warnings: string[] = []
      
      if (result.contractRisk > 70) {
        warnings.push(`⚠️ High contract risk detected (${result.contractRisk}/100)`)
      }
      
      if (result.walletRisk > 70) {
        warnings.push(`⚠️ High wallet risk detected (${result.walletRisk}/100)`)
      }

      // Add critical vulnerabilities to warnings
      result.contractScan.issues
        .filter(issue => issue.severity === 'critical')
        .forEach(issue => {
          warnings.push(`🔴 ${issue.title}`)
        })

      return {
        allowed,
        riskLevel,
        overallRisk: result.overallRiskScore,
        warnings,
        recommendation: result.reasoning,
        vulnerabilities,
        contractRisk: result.contractRisk,
        walletRisk: result.walletRisk
      }
    } catch (error) {
      console.error('Risk check failed:', error)
      // Fail-safe: allow transaction but warn
      return {
        allowed: true,
        riskLevel: 'warning',
        overallRisk: 50,
        warnings: ['Unable to perform risk check'],
        recommendation: 'Risk check service unavailable. Proceed with extreme caution.',
        vulnerabilities: [],
        contractRisk: 50,
        walletRisk: 50
      }
    }
  }

  /**
   * Show risk modal to user
   */
  async showRiskModal(result: RiskCheckResult): Promise<boolean> {
    return new Promise((resolve) => {
      // Create modal
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'
      modal.innerHTML = `
        <div class="glass-panel rounded-lg max-w-2xl w-full style="max-height: 85vh;" border border-white/10 animate-in fade-in zoom-in duration-300 flex flex-col">
          <!-- Header with Back Button -->
          <div class="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
            <button id="ghost-shell-back" class="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="font-headline text-sm">Back</span>
            </button>
            <h2 class="text-xl font-headline font-bold text-white">Ghost Shell Protection</h2>
            <div class="w-16"></div>
          </div>
          
          <!-- Scrollable Content -->
          <div class="p-8 flex-1" style="overflow-y: auto; max-height: 60vh;">
            <div class="flex items-center gap-3 mb-6">
              <span class="material-symbols-outlined text-4xl ${
                result.riskLevel === 'critical' ? 'text-red-500' :
                result.riskLevel === 'warning' ? 'text-yellow-500' :
                'text-green-500'
              }">shield</span>
              <div>
                <p class="text-sm text-white/60">Pre-Transaction Risk Check</p>
              </div>
            </div>

            <div class="mb-6 p-4 rounded-lg ${
              result.riskLevel === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
              result.riskLevel === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
              'bg-green-500/10 border border-green-500/20'
            }">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-label text-white/60">RISK LEVEL</span>
                <span class="text-2xl font-headline font-bold ${
                  result.riskLevel === 'critical' ? 'text-red-500' :
                  result.riskLevel === 'warning' ? 'text-yellow-500' :
                  'text-green-500'
                }">${result.overallRisk}/100</span>
              </div>
              <div class="text-xs font-label uppercase tracking-widest ${
                result.riskLevel === 'critical' ? 'text-red-500' :
                result.riskLevel === 'warning' ? 'text-yellow-500' :
                'text-green-500'
              }">${result.riskLevel}</div>
            </div>

            <!-- Risk Breakdown -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="p-4 bg-white/5 rounded-lg border border-white/10">
                <div class="flex items-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-sm text-white/60">contract</span>
                  <span class="text-xs font-label text-white/60">CONTRACT RISK</span>
                </div>
                <div class="text-2xl font-headline font-bold ${
                  result.contractRisk > 70 ? 'text-red-500' :
                  result.contractRisk > 40 ? 'text-yellow-500' :
                  'text-green-500'
                }">${result.contractRisk}/100</div>
              </div>
              <div class="p-4 bg-white/5 rounded-lg border border-white/10">
                <div class="flex items-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-sm text-white/60">account_balance_wallet</span>
                  <span class="text-xs font-label text-white/60">WALLET RISK</span>
                </div>
                <div class="text-2xl font-headline font-bold ${
                  result.walletRisk > 70 ? 'text-red-500' :
                  result.walletRisk > 40 ? 'text-yellow-500' :
                  'text-green-500'
                }">${result.walletRisk}/100</div>
              </div>
            </div>

            ${result.warnings.length > 0 ? `
              <div class="mb-6">
                <h3 class="text-sm font-headline font-bold text-white mb-3 flex items-center gap-2">
                  <span class="material-symbols-outlined text-yellow-500">warning</span>
                  Warnings
                </h3>
                <ul class="space-y-2">
                  ${result.warnings.map(w => `
                    <li class="text-xs text-white/80 flex items-start gap-2 p-2 bg-white/5 rounded">
                      <span class="text-yellow-500">•</span>
                      <span>${w}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            ${result.vulnerabilities.length > 0 ? `
              <div class="mb-6">
                <h3 class="text-sm font-headline font-bold text-white mb-3 flex items-center gap-2">
                  <span class="material-symbols-outlined text-red-500">bug_report</span>
                  Detected Vulnerabilities
                </h3>
                <div class="space-y-3">
                  ${result.vulnerabilities.map(vuln => `
                    <div class="p-3 bg-white/5 rounded-lg border-l-2 ${
                      vuln.severity === 'critical' ? 'border-red-500' :
                      vuln.severity === 'high' ? 'border-orange-500' :
                      vuln.severity === 'medium' ? 'border-yellow-500' :
                      'border-blue-500'
                    }">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-label uppercase tracking-widest ${
                          vuln.severity === 'critical' ? 'text-red-500' :
                          vuln.severity === 'high' ? 'text-orange-500' :
                          vuln.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }">${vuln.severity}</span>
                        <span class="text-sm font-headline font-bold text-white">${vuln.title}</span>
                      </div>
                      <p class="text-xs text-white/60 mb-2">${vuln.description}</p>
                      <p class="text-xs text-white/80 italic">💡 ${vuln.recommendation}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-blue-400 text-sm mt-0.5">info</span>
                <p class="text-sm text-white/80">${result.recommendation}</p>
              </div>
            </div>

            ${!result.allowed ? `
              <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-red-500 text-sm">block</span>
                  <p class="text-xs text-red-400">
                    This transaction has been automatically blocked due to critical security risks. Ghost Shell has prevented potential loss of funds.
                  </p>
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Footer with Buttons -->
          <div class="p-6 border-t border-white/10 flex-shrink-0">
            <div class="flex gap-3">
              ${result.allowed ? `
                <button id="ghost-shell-proceed" class="flex-1 py-3 bg-white text-black rounded-full font-headline font-bold hover:scale-[0.98] transition-transform">
                  Proceed Anyway
                </button>
                <button id="ghost-shell-cancel" class="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-full font-headline font-bold hover:bg-white/20 transition-colors">
                  Cancel
                </button>
              ` : `
                <button id="ghost-shell-cancel" class="flex-1 py-3 bg-red-500 text-white rounded-full font-headline font-bold hover:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined">block</span>
                  Transaction Blocked
                </button>
              `}
            </div>
          </div>
        </div>
      `

      document.body.appendChild(modal)

      const proceedBtn = modal.querySelector('#ghost-shell-proceed')
      const cancelBtn = modal.querySelector('#ghost-shell-cancel')
      const backBtn = modal.querySelector('#ghost-shell-back')

      const cleanup = () => {
        modal.remove()
      }

      if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
          cleanup()
          resolve(true)
        })
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          cleanup()
          resolve(false)
        })
      }

      if (backBtn) {
        backBtn.addEventListener('click', () => {
          cleanup()
          resolve(false)
        })
      }

      // Close on backdrop click (only if allowed)
      modal.addEventListener('click', (e) => {
        if (e.target === modal && result.allowed) {
          cleanup()
          resolve(false)
        }
      })
    })
  }

  /**
   * Intercept and guard a transaction
   */
  async guardTransaction(tx: TransactionRequest): Promise<boolean> {
    const result = await this.checkTransaction(tx)
    
    // Always show modal to display risk analysis
    // This ensures users see vulnerabilities and risk scores
    return await this.showRiskModal(result)
  }
}

// Export singleton instance
export const transactionGuard = TransactionGuard.getInstance()


