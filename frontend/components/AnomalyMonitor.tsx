'use client'

import { useState, useEffect } from 'react'

interface AnomalyAlert {
  type: 'token_mint' | 'flash_loan' | 'governance' | 'validator' | 'suspicious_transfer'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  txHash?: string
  address?: string
  timestamp: number
  details: any
}

interface AnomalyResponse {
  success: boolean
  overallRisk: string
  alertCount: number
  alerts: AnomalyAlert[]
  message: string
}

export default function AnomalyMonitor() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<number>(0)

  // Check wallet connection (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkConnection = async () => {
        if ((window as any).ethereum) {
          try {
            const accounts = await (window as any).ethereum.request({ 
              method: 'eth_accounts' 
            })
            if (accounts && accounts.length > 0) {
              setAddress(accounts[0])
              setIsConnected(true)
            }
          } catch (error) {
            console.error('Error checking wallet:', error)
          }
        }
      }
      
      checkConnection()
      
      // Listen for account changes
      if ((window as any).ethereum) {
        (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
          } else {
            setAddress(null)
            setIsConnected(false)
          }
        })
      }
    }
  }, [])

  // Monitor wallet for anomalies periodically
  useEffect(() => {
    if (isConnected && address) {
      // Check every 30 seconds
      const interval = setInterval(() => {
        checkWalletAnomalies()
      }, 30000)
      
      // Initial check
      checkWalletAnomalies()
      
      return () => clearInterval(interval)
    }
  }, [isConnected, address])

  const checkWalletAnomalies = async () => {
    if (!address) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anomaly-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      })

      const data: AnomalyResponse = await response.json()
      
      if (data.success && data.alerts.length > 0) {
        setAlerts(prev => [...data.alerts, ...prev].slice(0, 10)) // Keep last 10
      }
    } catch (error) {
      console.error('Error checking anomalies:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'token_mint': return '🪙'
      case 'flash_loan': return '⚡'
      case 'governance': return '🏛️'
      case 'validator': return '✓'
      case 'suspicious_transfer': return '🚨'
      default: return '⚠️'
    }
  }

  if (!isConnected) {
    return (
      <div className="glass-panel rounded-xl p-6 border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-cyan-500">radar</span>
            <h3 className="font-headline font-bold text-lg">Anomaly Monitor</h3>
          </div>
        </div>

        <div className="text-sm text-white/60 mb-4">
          Real-time monitoring for suspicious activity
        </div>

        <div className="text-center py-8 text-white/40">
          <span className="material-symbols-outlined text-4xl mb-2 block">account_balance_wallet</span>
          <p className="text-sm">Connect your wallet to enable monitoring</p>
          <p className="text-xs mt-1">Detects flash loans, large mints, and suspicious transfers</p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/40">
            Monitoring: Flash Loans, Large Mints, Suspicious Transfers
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-xl p-6 border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-cyan-500">radar</span>
          <h3 className="font-headline font-bold text-lg">Anomaly Monitor</h3>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-white/40">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            Scanning...
          </div>
        )}
      </div>

      <div className="text-sm text-white/60 mb-4">
        Real-time monitoring for suspicious activity
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-white/40">
          <span className="material-symbols-outlined text-4xl mb-2 block text-green-500">
            verified_user
          </span>
          <p className="text-sm">No anomalies detected</p>
          <p className="text-xs mt-1">Your wallet is secure</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {alert.severity}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-white/90 mb-2">{alert.description}</p>
                  
                  {alert.txHash && (
                    <a
                      href={`https://testnet-explorer.hsk.xyz/tx/${alert.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-500 hover:underline flex items-center gap-1"
                    >
                      View Transaction
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  )}
                  
                  {alert.address && (
                    <div className="text-xs text-white/40 mt-1 font-mono">
                      {alert.address.slice(0, 10)}...{alert.address.slice(-8)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Monitoring: Flash Loans, Large Mints, Suspicious Transfers</span>
          <button
            onClick={() => setAlerts([])}
            className="hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
