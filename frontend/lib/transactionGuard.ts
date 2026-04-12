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
        recommendation: 'Ghost Shell protection is disabled'
      }
    }

    if (!tx.to) {
      return {
        allowed: true,
        riskLevel: 'safe',
        overallRisk: 0,
        warnings: ['Contract deployment transaction'],
        recommendation: 'Proceed with caution'
      }
    }

    try {
      // Perform risk check via API
      const result = await checkRisk(tx.to, tx.from || '')

      const allowed = result.overallRisk < 70 // Block if risk > 70
      const riskLevel = result.overallRisk > 70 ? 'critical' : 
                       result.overallRisk > 40 ? 'warning' : 'safe'

      return {
        allowed,
        riskLevel,
        overallRisk: result.overallRisk,
        warnings: result.warnings || [],
        recommendation: result.recommendation || 'Proceed with caution'
      }
    } catch (error) {
      console.error('Risk check failed:', error)
      // Fail-safe: allow transaction but warn
      return {
        allowed: true,
        riskLevel: 'warning',
        overallRisk: 50,
        warnings: ['Unable to perform risk check'],
        recommendation: 'Risk check service unavailable. Proceed with extreme caution.'
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
      modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm'
      modal.innerHTML = `
        <div class="glass-panel rounded-lg p-8 max-w-md w-full mx-4 border border-white/10 animate-in fade-in zoom-in duration-300">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-4xl ${
              result.riskLevel === 'critical' ? 'text-red-500' :
              result.riskLevel === 'warning' ? 'text-yellow-500' :
              'text-green-500'
            }">shield</span>
            <div>
              <h2 class="text-2xl font-headline font-bold text-white">Ghost Shell Protection</h2>
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

          ${result.warnings.length > 0 ? `
            <div class="mb-6">
              <h3 class="text-sm font-headline font-bold text-white mb-2">Warnings:</h3>
              <ul class="space-y-1">
                ${result.warnings.map(w => `
                  <li class="text-xs text-white/60 flex items-start gap-2">
                    <span class="material-symbols-outlined text-[14px] text-yellow-500">warning</span>
                    <span>${w}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="mb-6 p-3 bg-white/5 rounded-lg">
            <p class="text-sm text-white/80">${result.recommendation}</p>
          </div>

          <div class="flex gap-3">
            ${result.allowed ? `
              <button id="ghost-shell-proceed" class="flex-1 py-3 bg-white text-black rounded-full font-headline font-bold hover:scale-[0.98] transition-transform">
                Proceed Anyway
              </button>
              <button id="ghost-shell-cancel" class="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-full font-headline font-bold hover:bg-white/20 transition-colors">
                Cancel
              </button>
            ` : `
              <button id="ghost-shell-cancel" class="flex-1 py-3 bg-red-500 text-white rounded-full font-headline font-bold hover:scale-[0.98] transition-transform">
                Transaction Blocked
              </button>
            `}
          </div>
        </div>
      `

      document.body.appendChild(modal)

      const proceedBtn = modal.querySelector('#ghost-shell-proceed')
      const cancelBtn = modal.querySelector('#ghost-shell-cancel')

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

      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
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
    
    if (result.riskLevel === 'safe' && result.warnings.length === 0) {
      // Low risk, allow without modal
      return true
    }

    // Show modal for warning or critical
    return await this.showRiskModal(result)
  }
}

// Export singleton instance
export const transactionGuard = TransactionGuard.getInstance()
