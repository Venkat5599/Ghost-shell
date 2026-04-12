'use client'

import { useState } from 'react'
import { checkRisk, RiskCheckResult } from '@/lib/api'

type RiskCheckModalProps = {
  onClose: () => void
}

export default function RiskCheckModal({ onClose }: RiskCheckModalProps) {
  const [contractAddress, setContractAddress] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RiskCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!contractAddress || !walletAddress) return
    
    setLoading(true)
    setError(null)
    
    try {
      const riskResult = await checkRisk(contractAddress, walletAddress)
      setResult(riskResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check risk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4 md:p-8">
      <div className="glass-strong w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl relative">
        {/* Glass Highlight Texture */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_40%)]"></div>

        <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row gap-12">
          {/* Left Column: Input & Info */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">
                Pre-Transaction Risk Check
              </h2>
              <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest opacity-60">
                Ghost Shell Security Node • Section 9 Active
              </p>
            </div>

            {!result ? (
              <div className="space-y-6">
                {/* Contract Address Input */}
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                    Target Contract Address
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      contract
                    </span>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-label text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-tertiary transition-all"
                      type="text"
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Wallet Address Input */}
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                    Destination Wallet
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      account_balance_wallet
                    </span>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-4 pl-12 pr-4 font-label text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-tertiary transition-all"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleCheck}
                  disabled={loading || !contractAddress || !walletAddress}
                  className="w-full bg-white text-black font-headline font-bold py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Checking Risk...' : 'Check Risk'}
                </button>
                {error && (
                  <p className="text-error text-sm text-center">{error}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className={`flex items-center justify-between p-4 bg-white/5 rounded-lg border-l-4 ${
                  result.contractScan.status === 'critical' ? 'border-error' :
                  result.contractScan.status === 'warning' ? 'border-yellow-500' :
                  'border-green-500'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${
                      result.contractScan.status === 'critical' ? 'text-error' :
                      result.contractScan.status === 'warning' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>warning</span>
                    <span className="font-body font-medium">Contract Risk</span>
                  </div>
                  <span className={`font-label text-sm ${
                    result.contractScan.status === 'critical' ? 'text-error' :
                    result.contractScan.status === 'warning' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{result.contractScan.status.toUpperCase()}</span>
                </div>
                <div className={`flex items-center justify-between p-4 bg-white/5 rounded-lg border-l-4 ${
                  result.walletReport.riskLevel === 'high' ? 'border-error' :
                  result.walletReport.riskLevel === 'medium' ? 'border-yellow-500' :
                  'border-green-500'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${
                      result.walletReport.riskLevel === 'high' ? 'text-error' :
                      result.walletReport.riskLevel === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>verified_user</span>
                    <span className="font-body font-medium">Wallet Risk</span>
                  </div>
                  <span className={`font-label text-sm ${
                    result.walletReport.riskLevel === 'high' ? 'text-error' :
                    result.walletReport.riskLevel === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{result.walletReport.riskLevel.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Indicator & CTA */}
          <div className="w-full md:w-80 flex flex-col justify-between items-center bg-surface-container-highest/20 rounded-xl p-8 border border-white/5 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Score Visualization */}
            <div className="relative flex items-center justify-center w-full aspect-square">
              <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
              <div className={`absolute inset-0 rounded-full border-t-4 shadow-[0_0_20px_rgba(234,179,8,0.3)] ${
                result ? `rotate-[${(result.overallRiskScore * 3.6).toFixed(0)}deg]` : ''
              } ${
                result?.overallRiskLevel === 'critical' ? 'border-error' :
                result?.overallRiskLevel === 'warning' ? 'border-yellow-500' :
                'border-green-500'
              }`}></div>
              <div className="text-center relative">
                <span className="block font-headline text-6xl font-bold text-white leading-none">
                  {result ? result.overallRiskScore : '?'}
                </span>
                <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                  Risk Score
                </span>
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  result?.overallRiskLevel === 'critical' ? 'bg-error shadow-[0_0_10px_#ffb4ab]' :
                  result?.overallRiskLevel === 'warning' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' :
                  'bg-green-500 shadow-[0_0_10px_#22c55e]'
                }`}></div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="text-center mt-6 mb-8">
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {result ? result.reasoning : 'Analyzing transaction risk...'}
              </p>
            </div>

            {/* Actions */}
            <div className="w-full space-y-4">
              <button className="w-full bg-white text-black font-headline font-bold py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10">
                Proceed Anyway
              </button>
              <button
                onClick={onClose}
                className="w-full bg-transparent text-white font-headline font-medium py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancel Transaction
              </button>
            </div>

            {/* Footnote */}
            <div className="mt-6 flex items-center gap-2 opacity-40">
              <span className="material-symbols-outlined text-xs">lock</span>
              <span className="font-label text-[9px] uppercase tracking-widest">End-to-End Guarded</span>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
      </div>
    </div>
  )
}
