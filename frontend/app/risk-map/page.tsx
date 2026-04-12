'use client'

import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'

interface RecentScan {
  address: string
  risk: 'low' | 'medium' | 'high'
  score: number
  time: string
}

export default function RiskMapPage() {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [riskZones, setRiskZones] = useState({
    safe: 0,
    caution: 0,
    danger: 0,
  })
  const [vulnerabilityTypes, setVulnerabilityTypes] = useState<any[]>([])

  useEffect(() => {
    checkWalletConnection()
    loadScanHistory()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setConnectedWallet(accounts[0].address)
        }
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }
  }

  const loadScanHistory = () => {
    // Load scan history from localStorage
    const history = localStorage.getItem('ghost-shell-scan-history')
    if (history) {
      const scans = JSON.parse(history)
      
      // Process scans
      const processed = scans.slice(0, 10).map((scan: any) => ({
        address: scan.contractAddress || scan.walletAddress,
        risk: scan.riskScore > 70 ? 'high' : scan.riskScore > 40 ? 'medium' : 'low',
        score: scan.riskScore,
        time: new Date(scan.timestamp).toLocaleTimeString(),
      }))
      
      setRecentScans(processed)
      
      // Calculate risk zones
      const zones = {
        safe: processed.filter((s: RecentScan) => s.risk === 'low').length,
        caution: processed.filter((s: RecentScan) => s.risk === 'medium').length,
        danger: processed.filter((s: RecentScan) => s.risk === 'high').length,
      }
      setRiskZones(zones)
      
      // Extract vulnerability types
      const vulnMap = new Map<string, { count: number; severity: string }>()
      scans.forEach((scan: any) => {
        if (scan.issues) {
          scan.issues.forEach((issue: any) => {
            const existing = vulnMap.get(issue.type) || { count: 0, severity: issue.severity }
            vulnMap.set(issue.type, {
              count: existing.count + 1,
              severity: issue.severity,
            })
          })
        }
      })
      
      const vulnArray = Array.from(vulnMap.entries()).map(([type, data]) => ({
        type: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: data.count,
        severity: data.severity,
      }))
      
      setVulnerabilityTypes(vulnArray.slice(0, 5))
    }
  }

  const riskZonesArray = [
    { id: 'safe', name: 'Safe Zone', count: riskZones.safe, color: 'green', risk: 'low' },
    { id: 'caution', name: 'Caution Zone', count: riskZones.caution, color: 'yellow', risk: 'medium' },
    { id: 'danger', name: 'Danger Zone', count: riskZones.danger, color: 'red', risk: 'high' },
  ]

  const totalScans = riskZones.safe + riskZones.caution + riskZones.danger
  const safePercentage = totalScans > 0 ? Math.round((riskZones.safe / totalScans) * 100) : 0
  const cautionPercentage = totalScans > 0 ? Math.round((riskZones.caution / totalScans) * 100) : 0
  const dangerPercentage = totalScans > 0 ? Math.round((riskZones.danger / totalScans) * 100) : 0

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-headline font-bold mb-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-purple-500">map</span>
            Risk Map
          </h1>
          <p className="text-white/60 font-body text-lg">
            Visual overview of security landscape and threat distribution
          </p>
        </div>

        {totalScans === 0 ? (
          <div className="glass-panel rounded-lg p-12 border-white/10 text-center">
            <span className="material-symbols-outlined text-6xl text-white/40 mb-4">map</span>
            <h2 className="text-2xl font-headline font-bold mb-2">No Scan Data Yet</h2>
            <p className="text-white/60 mb-6">Start scanning contracts to build your risk map</p>
            <a
              href="/scanner"
              className="inline-block px-6 py-3 bg-white text-black rounded-full font-headline font-bold hover:scale-[0.98] transition-transform"
            >
              Go to Scanner
            </a>
          </div>
        ) : (
          <>
            {/* Risk Distribution */}
            <div className="glass-panel rounded-lg p-8 border-white/10 mb-8">
              <h2 className="text-2xl font-headline font-bold mb-6">Risk Distribution</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {riskZonesArray.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedRisk(zone.id)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedRisk === zone.id
                        ? `border-${zone.color}-500 bg-${zone.color}-500/20`
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`material-symbols-outlined text-4xl text-${zone.color}-500`}>
                        {zone.color === 'green' ? 'check_circle' : zone.color === 'yellow' ? 'warning' : 'dangerous'}
                      </span>
                      <span className="text-3xl font-headline font-bold">{zone.count}</span>
                    </div>
                    <h3 className="font-headline font-bold text-lg mb-1">{zone.name}</h3>
                    <p className="text-xs text-white/60 uppercase font-label">{zone.risk} risk</p>
                  </button>
                ))}
              </div>

              {/* Visual Risk Map */}
              <div className="relative h-64 bg-black/40 rounded-lg border border-white/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Safe Zone (Green) */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-green-500/20 to-transparent border-t-2 border-green-500/30">
                      <div className="absolute top-4 left-4 text-xs font-label text-green-500">SAFE ZONE ({safePercentage}%)</div>
                    </div>
                    
                    {/* Caution Zone (Yellow) */}
                    <div className="absolute bottom-[60%] left-0 right-0 h-[25%] bg-gradient-to-t from-yellow-500/20 to-transparent border-t-2 border-yellow-500/30">
                      <div className="absolute top-2 left-4 text-xs font-label text-yellow-500">CAUTION ZONE ({cautionPercentage}%)</div>
                    </div>
                    
                    {/* Danger Zone (Red) */}
                    <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-t from-red-500/20 to-transparent border-t-2 border-red-500/30">
                      <div className="absolute top-2 left-4 text-xs font-label text-red-500">DANGER ZONE ({dangerPercentage}%)</div>
                    </div>

                    {/* Data Points */}
                    {recentScans.slice(0, 8).map((scan, index) => (
                      <div
                        key={index}
                        className={`absolute w-3 h-3 rounded-full animate-pulse ${
                          scan.risk === 'low' ? 'bg-green-500' :
                          scan.risk === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{
                          left: `${10 + index * 11}%`,
                          bottom: `${scan.risk === 'low' ? 30 : scan.risk === 'medium' ? 65 : 90}%`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Recent Scans */}
              <div className="glass-panel rounded-lg p-8 border-white/10">
                <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined">history</span>
                  Recent Scans
                </h2>

                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${
                            scan.risk === 'low' ? 'bg-green-500' :
                            scan.risk === 'medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></span>
                          <div>
                            <p className="font-mono text-sm">{scan.address.slice(0, 6)}...{scan.address.slice(-4)}</p>
                            <p className="text-xs text-white/40">{scan.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-headline font-bold ${
                            scan.risk === 'low' ? 'text-green-500' :
                            scan.risk === 'medium' ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {scan.score}
                          </p>
                          <p className="text-xs text-white/40">risk score</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vulnerability Breakdown */}
              <div className="glass-panel rounded-lg p-8 border-white/10">
                <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined">bug_report</span>
                  Vulnerability Types
                </h2>

                {vulnerabilityTypes.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <span className="material-symbols-outlined text-6xl mb-4">check_circle</span>
                    <p className="font-body">No vulnerabilities detected yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vulnerabilityTypes.map((vuln, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-sm ${
                              vuln.severity === 'critical' ? 'text-red-500' :
                              vuln.severity === 'high' ? 'text-orange-500' :
                              'text-yellow-500'
                            }`}>
                              {vuln.severity === 'critical' ? 'dangerous' : 'warning'}
                            </span>
                            <span className="text-sm">{vuln.type}</span>
                          </div>
                          <span className="text-sm font-headline font-bold">{vuln.count}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              vuln.severity === 'critical' ? 'bg-red-500' :
                              vuln.severity === 'high' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min((vuln.count / Math.max(...vulnerabilityTypes.map(v => v.count))) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-500">info</span>
                    <div>
                      <h3 className="font-headline font-bold text-sm mb-1">Analysis Summary</h3>
                      <p className="text-xs text-white/60">
                        Based on {totalScans} scan{totalScans !== 1 ? 's' : ''} across the HashKey Chain ecosystem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Statistics */}
            <div className="mt-8 glass-panel rounded-lg p-8 border-white/10">
              <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">analytics</span>
                Network Statistics
              </h2>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-headline font-bold mb-2">{totalScans}</p>
                  <p className="text-sm text-white/60">Total Scans</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-headline font-bold mb-2 text-green-500">{safePercentage}%</p>
                  <p className="text-sm text-white/60">Safe Contracts</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-headline font-bold mb-2 text-yellow-500">{cautionPercentage}%</p>
                  <p className="text-sm text-white/60">Medium Risk</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-headline font-bold mb-2 text-red-500">{dangerPercentage}%</p>
                  <p className="text-sm text-white/60">High Risk</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
