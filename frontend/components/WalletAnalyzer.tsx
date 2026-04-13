'use client'

import { useState } from 'react'
import { analyzeWallet, WalletRiskReport } from '@/lib/api'
import { addNotification } from '@/lib/notifications'

export default function WalletAnalyzer() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WalletRiskReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!address) return
    
    setLoading(true)
    setError(null)
    
    try {
      const report = await analyzeWallet(address)
      
      setResult(report)
      
      // Add notification based on risk level
      if (report.riskScore > 70) {
        addNotification('warning', `High risk wallet detected (${report.riskScore}/100)`)
      } else if (report.riskScore > 40) {
        addNotification('info', `Medium risk wallet analyzed (${report.riskScore}/100)`)
      } else {
        addNotification('success', `Wallet analysis completed - Low risk (${report.riskScore}/100)`)
      }
      
      // Save to localStorage for Risk Map
      const history = JSON.parse(localStorage.getItem('ghost-shell-scan-history') || '[]')
      history.unshift({ ...report, walletAddress: address })
      localStorage.setItem('ghost-shell-scan-history', JSON.stringify(history.slice(0, 50)))
      
      // Update stats
      const stats = JSON.parse(localStorage.getItem('ghost-shell-stats') || '{"threatsBlocked":0,"contractsScanned":0,"walletsProtected":0}')
      stats.walletsProtected += 1
      if (report.riskScore > 70) stats.threatsBlocked += 1
      localStorage.setItem('ghost-shell-stats', JSON.stringify(stats))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze wallet')
      setResult(null)
      addNotification('warning', 'Wallet analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleViewFullReport = () => {
    if (!result) return
    
    // Create a detailed report modal or new page
    const reportWindow = window.open('', '_blank')
    if (!reportWindow) return
    
    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ghost Shell - Wallet Analysis Report</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: #0a0a0a;
              color: #fff;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 30px;
              padding: 20px;
              background: #1a1a1a;
              border-radius: 8px;
              border: 1px solid #333;
            }
            .risk-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 12px;
            }
            .risk-high { background: #ff4444; }
            .risk-medium { background: #ffaa00; }
            .risk-low { background: #00ff88; color: #000; }
            .factor {
              margin: 15px 0;
              padding: 15px;
              background: #0a0a0a;
              border-left: 4px solid #00ff88;
              border-radius: 4px;
            }
            .factor.high { border-left-color: #ff4444; }
            .factor.medium { border-left-color: #ffaa00; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #333;
            }
            td:first-child {
              color: #888;
              width: 200px;
            }
            @media print {
              body { background: white; color: black; }
              .section { border: 1px solid #ccc; background: #f9f9f9; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🛡️ Ghost Shell - Wallet Analysis Report</h1>
            <p style="color: #888;">攻殻機動隊 Section 9 Security Protocol</p>
          </div>
          
          <div class="section">
            <h2>Wallet Overview</h2>
            <table>
              <tr>
                <td>Wallet Address</td>
                <td><code>${result.walletAddress}</code></td>
              </tr>
              <tr>
                <td>Chain ID</td>
                <td>${result.chainId}</td>
              </tr>
              <tr>
                <td>Risk Level</td>
                <td><span class="risk-badge risk-${result.riskLevel}">${result.riskLevel.toUpperCase()}</span></td>
              </tr>
              <tr>
                <td>Risk Score</td>
                <td>${result.riskScore}/100</td>
              </tr>
              <tr>
                <td>Transaction Count</td>
                <td>${result.transactionCount.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Suspicious Interactions</td>
                <td>${result.suspiciousInteractions}</td>
              </tr>
              <tr>
                <td>First Seen</td>
                <td>${new Date(result.firstSeen).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Last Activity</td>
                <td>${new Date(result.lastActivity).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Analysis Date</td>
                <td>${new Date(result.timestamp).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>AI Risk Summary</h2>
            <p>${result.aiSummary || 'This wallet shows normal activity patterns with no significant risk factors detected.'}</p>
          </div>
          
          <div class="section">
            <h2>Risk Factors (${result.factors.length})</h2>
            ${result.factors.length > 0 ? result.factors.map(factor => `
              <div class="factor ${factor.severity}">
                <h3>${factor.description}</h3>
                <p><strong>Severity:</strong> ${factor.severity.toUpperCase()}</p>
                <p><strong>Type:</strong> ${factor.type}</p>
                <p><strong>Weight:</strong> ${factor.weight}</p>
                <p><strong>Evidence:</strong></p>
                <ul>
                  ${factor.evidence.map(e => `<li>${e}</li>`).join('')}
                </ul>
              </div>
            `).join('') : '<p>No risk factors detected.</p>'}
          </div>
          
          <div class="section">
            <h2>Recommendations</h2>
            ${result.riskLevel === 'high' ? `
              <p>⚠️ <strong>HIGH RISK:</strong> Exercise extreme caution when interacting with this wallet. Consider blocking transactions.</p>
            ` : result.riskLevel === 'medium' ? `
              <p>⚠️ <strong>MEDIUM RISK:</strong> Review the risk factors carefully before proceeding with any transactions.</p>
            ` : `
              <p>✅ <strong>LOW RISK:</strong> This wallet appears safe for interaction based on current analysis.</p>
            `}
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 12px;">
            <p>Generated by Ghost Shell Security Protocol</p>
            <p>Report ID: ${result.timestamp}</p>
            <p>This report is for informational purposes only. Always conduct your own research.</p>
          </div>
          
          <script>
            // Auto-print option
            // window.print();
          </script>
        </body>
      </html>
    `)
    reportWindow.document.close()
  }

  const handleExportData = () => {
    if (!result) return
    
    // Create JSON export
    const exportData = {
      report_type: 'wallet_analysis',
      generated_at: new Date().toISOString(),
      wallet: {
        address: result.walletAddress,
        chain_id: result.chainId,
        risk_level: result.riskLevel,
        risk_score: result.riskScore,
        transaction_count: result.transactionCount,
        suspicious_interactions: result.suspiciousInteractions,
        first_seen: result.firstSeen,
        last_activity: result.lastActivity,
      },
      ai_summary: result.aiSummary,
      risk_factors: result.factors.map(f => ({
        type: f.type,
        severity: f.severity,
        description: f.description,
        evidence: f.evidence,
        weight: f.weight,
      })),
      metadata: {
        scanner: 'Ghost Shell Security Protocol',
        version: '1.0.0',
        timestamp: result.timestamp,
      }
    }
    
    // Create download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ghost-shell-wallet-${result.walletAddress.slice(0, 8)}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid md:grid-cols-12 gap-10">
      {/* Input Column */}
      <div className="md:col-span-5 flex flex-col gap-6 text-left">
        <div>
          <label className="block font-label text-[10px] uppercase tracking-widest text-white/40 mb-3">
            Wallet Address
          </label>
          <div className="relative group">
            <input
              className="w-full bg-surface-container-low border-transparent focus:border-white/20 focus:ring-0 rounded-lg py-4 px-5 text-white font-mono text-sm transition-all placeholder:text-white/20"
              placeholder="0x..."
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="absolute inset-0 rounded-lg pointer-events-none group-focus-within:shadow-[0_0_20px_rgba(172,237,255,0.1)] transition-all"></div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !address}
          className="w-full bg-white text-black py-4 rounded-full font-headline font-bold flex items-center justify-center gap-3 hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          {loading ? 'Analyzing...' : 'Analyze Wallet History'}
        </button>

        <div className="mt-4 p-5 rounded-lg bg-surface-container-low border border-white/5">
          <h4 className="font-headline text-xs font-bold text-white/60 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">info</span>
            WALLET ANALYSIS
          </h4>
          <p className="text-xs text-white/40 font-body leading-relaxed">
            We analyze transaction patterns, interactions with risky contracts, and behavioral anomalies to assess wallet safety.
          </p>
        </div>
      </div>

      {/* Results Column */}
      <div className="md:col-span-7">
        <div className="h-full glass-panel rounded-lg p-8 border-white/10 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline text-xl font-bold text-white">Wallet Analysis</h3>
              <p className="text-sm text-white/40 font-body">
                {result ? `Wallet: ${address.slice(0, 6)}...${address.slice(-4)}` : 'Awaiting analysis...'}
              </p>
            </div>
            {result && (
              <div className={`px-3 py-1 rounded-full text-[10px] font-label font-bold tracking-widest flex items-center gap-1.5 ${
                result.riskLevel === 'high' ? 'bg-error-container/20 text-error' :
                result.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-green-500/20 text-green-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  result.riskLevel === 'high' ? 'bg-error' :
                  result.riskLevel === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></span>
                {result.riskLevel.toUpperCase()} RISK
              </div>
            )}
          </div>

          {error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-error">
                <span className="material-symbols-outlined text-6xl mb-4">error</span>
                <p className="font-body">{error}</p>
              </div>
            </div>
          ) : result ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass-panel p-6 rounded-lg">
                  <div className="text-3xl font-headline font-bold">{result.transactionCount.toLocaleString()}</div>
                  <div className="text-xs text-white/40 font-label mt-1">Total Transactions</div>
                </div>
                <div className="glass-panel p-6 rounded-lg">
                  <div className={`text-3xl font-headline font-bold ${
                    result.suspiciousInteractions > 0 ? 'text-yellow-500' : 'text-green-500'
                  }`}>{result.suspiciousInteractions}</div>
                  <div className="text-xs text-white/40 font-label mt-1">Suspicious Interactions</div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-headline text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  AI Risk Summary
                </h4>
                <p className="text-white/70 font-body text-sm leading-relaxed">
                  {result.aiSummary || 'Analysis complete. Review the risk factors below.'}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {result.factors.map((factor, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                    factor.severity === 'high' ? 'bg-error-container/10 border-error' :
                    factor.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-blue-500/10 border-blue-500'
                  }`}>
                    <div className="flex gap-4">
                      <span className={`material-symbols-outlined ${
                        factor.severity === 'high' ? 'text-error' :
                        factor.severity === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`}>warning</span>
                      <div className="flex-1">
                        <p className="font-headline text-sm font-bold text-white mb-1">{factor.description}</p>
                        <ul className="text-xs text-white/50 leading-relaxed space-y-1">
                          {factor.evidence.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 flex gap-4">
                <button 
                  onClick={handleViewFullReport}
                  className="flex-1 py-3 glass-panel rounded-full text-xs font-headline font-bold hover:bg-white/10 transition-colors"
                >
                  View Full Report
                </button>
                <button 
                  onClick={handleExportData}
                  className="flex-1 py-3 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full text-xs font-headline font-bold hover:bg-tertiary/20 transition-colors"
                >
                  Export Data
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/20">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl mb-4">account_balance_wallet</span>
                <p className="font-body">Enter a wallet address to begin analysis</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
