'use client'

import { useState, useEffect } from 'react'
import { scanContract, ScanResult } from '@/lib/api'

export default function ContractScanner() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Auto-fill from localStorage if coming from audits page
  useEffect(() => {
    const savedContract = localStorage.getItem('scanContract')
    if (savedContract) {
      setAddress(savedContract)
      localStorage.removeItem('scanContract') // Clear after using
      // Auto-scan
      handleScanWithAddress(savedContract)
    }
  }, [])

  const handleScanWithAddress = async (contractAddress: string) => {
    if (!contractAddress) return
    
    setLoading(true)
    setError(null)
    
    try {
      const scanResult = await scanContract(contractAddress)
      setResult(scanResult)
      
      // Save to localStorage for Risk Map
      const history = JSON.parse(localStorage.getItem('ghost-shell-scan-history') || '[]')
      history.unshift(scanResult)
      localStorage.setItem('ghost-shell-scan-history', JSON.stringify(history.slice(0, 50)))
      
      // Update stats
      const stats = JSON.parse(localStorage.getItem('ghost-shell-stats') || '{"threatsBlocked":0,"contractsScanned":0,"walletsProtected":0}')
      stats.contractsScanned += 1
      if (scanResult.riskScore > 70) stats.threatsBlocked += 1
      localStorage.setItem('ghost-shell-stats', JSON.stringify(stats))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan contract')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleScan = async () => {
    await handleScanWithAddress(address)
  }

  const handleViewFullReport = () => {
    if (!result) return
    
    const reportWindow = window.open('', '_blank')
    if (!reportWindow) return
    
    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ghost Shell - Contract Security Report</title>
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
            .risk-critical { background: #ff4444; }
            .risk-warning { background: #ffaa00; }
            .risk-safe { background: #00ff88; color: #000; }
            .issue {
              margin: 15px 0;
              padding: 15px;
              background: #0a0a0a;
              border-left: 4px solid #00ff88;
              border-radius: 4px;
            }
            .issue.critical { border-left-color: #ff4444; }
            .issue.high { border-left-color: #ff8800; }
            .issue.medium { border-left-color: #ffaa00; }
            .issue.low { border-left-color: #00aaff; }
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
            <h1>🛡️ Ghost Shell - Contract Security Report</h1>
            <p style="color: #888;">攻殻機動隊 Section 9 Security Protocol</p>
          </div>
          
          <div class="section">
            <h2>Contract Overview</h2>
            <table>
              <tr>
                <td>Contract Address</td>
                <td><code>${result.contractAddress}</code></td>
              </tr>
              <tr>
                <td>Chain ID</td>
                <td>${result.chainId}</td>
              </tr>
              <tr>
                <td>Risk Status</td>
                <td><span class="risk-badge risk-${result.status}">${result.status.toUpperCase()}</span></td>
              </tr>
              <tr>
                <td>Risk Score</td>
                <td>${result.riskScore}/100</td>
              </tr>
              <tr>
                <td>Issues Found</td>
                <td>${result.issues.length}</td>
              </tr>
              <tr>
                <td>Scan Duration</td>
                <td>${result.scanDuration}ms</td>
              </tr>
              <tr>
                <td>Scan Date</td>
                <td>${new Date(result.timestamp).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>AI Security Analysis</h2>
            <p>${result.aiExplanation || 'No significant vulnerabilities detected.'}</p>
          </div>
          
          <div class="section">
            <h2>Vulnerability Details (${result.issues.length})</h2>
            ${result.issues.length > 0 ? result.issues.map(issue => `
              <div class="issue ${issue.severity}">
                <h3>${issue.title}</h3>
                <p><strong>Severity:</strong> ${issue.severity.toUpperCase()}</p>
                <p><strong>Type:</strong> ${issue.type}</p>
                ${issue.cweId ? `<p><strong>CWE ID:</strong> ${issue.cweId}</p>` : ''}
                <p><strong>Description:</strong> ${issue.description}</p>
                <p><strong>Recommendation:</strong> ${issue.recommendation}</p>
              </div>
            `).join('') : '<p>No vulnerabilities detected.</p>'}
          </div>
          
          <div class="section">
            <h2>Security Recommendations</h2>
            ${result.status === 'critical' ? `
              <p>🚨 <strong>CRITICAL:</strong> Do not interact with this contract. Multiple critical vulnerabilities detected that could lead to loss of funds.</p>
            ` : result.status === 'warning' ? `
              <p>⚠️ <strong>WARNING:</strong> Exercise caution. Review all vulnerabilities before interacting with this contract.</p>
            ` : `
              <p>✅ <strong>SAFE:</strong> This contract appears secure based on current analysis. Always conduct your own research.</p>
            `}
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 12px;">
            <p>Generated by Ghost Shell Security Protocol</p>
            <p>Report ID: ${result.contractAddress}-${Date.now()}</p>
            <p>This report is for informational purposes only. Always conduct your own security audit.</p>
          </div>
        </body>
      </html>
    `)
    reportWindow.document.close()
  }

  const handleExportData = () => {
    if (!result) return
    
    const exportData = {
      report_type: 'contract_security_scan',
      generated_at: new Date().toISOString(),
      contract: {
        address: result.contractAddress,
        chain_id: result.chainId,
        risk_status: result.status,
        risk_score: result.riskScore,
        scan_duration_ms: result.scanDuration,
      },
      ai_explanation: result.aiExplanation,
      vulnerabilities: result.issues.map(issue => ({
        id: issue.id,
        type: issue.type,
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        recommendation: issue.recommendation,
        cwe_id: issue.cweId,
      })),
      metadata: {
        scanner: 'Ghost Shell Security Protocol',
        version: '1.0.0',
        timestamp: result.timestamp,
      }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ghost-shell-contract-${result.contractAddress.slice(0, 8)}-${Date.now()}.json`
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
            Contract Address
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
          onClick={handleScan}
          disabled={loading || !address}
          className="w-full bg-white text-black py-4 rounded-full font-headline font-bold flex items-center justify-center gap-3 hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">search</span>
          {loading ? 'Scanning...' : 'Scan for Vulnerabilities'}
        </button>

        <div className="mt-4 p-5 rounded-lg bg-surface-container-low border border-white/5">
          <h4 className="font-headline text-xs font-bold text-white/60 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">info</span>
            HOW IT WORKS
          </h4>
          <p className="text-xs text-white/40 font-body leading-relaxed">
            Our AI parses bytecode and source files to identify logic flaws, reentrancy risks, and malicious permissions in seconds.
          </p>
        </div>
      </div>

      {/* Results Column */}
      <div className="md:col-span-7">
        <div className="h-full glass-panel rounded-lg p-8 border-white/10 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline text-xl font-bold text-white">Scanner Results</h3>
              <p className="text-sm text-white/40 font-body">
                {result ? `Contract: ${address.slice(0, 6)}...${address.slice(-4)}` : 'Awaiting scan...'}
              </p>
            </div>
            {result && (
              <div className={`px-3 py-1 rounded-full text-[10px] font-label font-bold tracking-widest flex items-center gap-1.5 ${
                result.status === 'critical' ? 'bg-error-container/20 text-error' :
                result.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-green-500/20 text-green-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  result.status === 'critical' ? 'bg-error' :
                  result.status === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></span>
                {result.status.toUpperCase()}
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
              <div className="flex items-center gap-10 mb-10">
                <div className="relative flex-shrink-0">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      className="text-white/10"
                      cx="48"
                      cy="48"
                      fill="transparent"
                      r="44"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <circle
                      className={result.status === 'critical' ? 'text-error' : result.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}
                      cx="48"
                      cy="48"
                      fill="transparent"
                      r="44"
                      stroke="currentColor"
                      strokeDasharray="276"
                      strokeDashoffset={276 - (276 * result.riskScore) / 100}
                      strokeWidth="4"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline text-2xl font-bold">{result.riskScore}</span>
                    <span className="text-[8px] text-white/40 font-label">RISK SCORE</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/80 font-body leading-relaxed">
                    {result.aiExplanation || 'Analysis complete. Review the findings below.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {result.issues.map((issue) => (
                  <div key={issue.id} className={`p-4 rounded-lg border-l-4 ${
                    issue.severity === 'critical' ? 'bg-error-container/10 border-error' :
                    issue.severity === 'high' ? 'bg-orange-500/10 border-orange-500' :
                    issue.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-blue-500/10 border-blue-500'
                  }`}>
                    <div className="flex gap-4">
                      <span className={`material-symbols-outlined ${
                        issue.severity === 'critical' ? 'text-error' :
                        issue.severity === 'high' ? 'text-orange-500' :
                        issue.severity === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        warning
                      </span>
                      <div className="flex-1">
                        <p className="font-headline text-sm font-bold text-white mb-1">{issue.title}</p>
                        <p className="text-xs text-white/50 leading-relaxed mb-2">
                          {issue.description}
                        </p>
                        <p className="text-xs text-white/40 italic">
                          💡 {issue.recommendation}
                        </p>
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
                  className="flex-1 py-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-headline font-bold hover:bg-secondary/20 transition-colors"
                >
                  Export Data
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/20">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl mb-4">search</span>
                <p className="font-body">Enter a contract address to begin scanning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
