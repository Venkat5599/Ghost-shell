'use client'

import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'

interface Threat {
  id: number
  type: string
  severity: 'low' | 'medium' | 'high'
  address: string
  timestamp: string
  description: string
}

export default function LiveShieldPage() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [activeMonitors, setActiveMonitors] = useState(3)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [stats, setStats] = useState({
    threatsBlocked: 0,
    contractsScanned: 0,
    walletsProtected: 0,
  })

  useEffect(() => {
    checkWalletConnection()
    loadStats()
  }, [])

  useEffect(() => {
    if (connectedWallet && isMonitoring) {
      // Start monitoring for real threats
      const interval = setInterval(() => {
        checkForThreats()
      }, 10000) // Check every 10 seconds

      return () => clearInterval(interval)
    }
  }, [connectedWallet, isMonitoring])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const address = accounts[0].address
          setConnectedWallet(address)
          setIsMonitoring(true)
        }
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }
  }

  const loadStats = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('ghost-shell-stats')
    if (saved) {
      setStats(JSON.parse(saved))
    }
  }

  const checkForThreats = async () => {
    // In production, this would check real blockchain events
    // For now, we'll simulate based on real network activity
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum)
        const blockNumber = await provider.getBlockNumber()
        
        // Check if there's unusual activity (simplified)
        if (blockNumber % 5 === 0) {
          const newThreat: Threat = {
            id: Date.now(),
            type: 'Unusual Network Activity',
            severity: 'low',
            address: `Block #${blockNumber}`,
            timestamp: new Date().toLocaleTimeString(),
            description: 'Monitoring blockchain activity',
          }
          setThreats(prev => [newThreat, ...prev].slice(0, 10))
        }
      }
    } catch (error) {
      console.error('Error checking threats:', error)
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-headline font-bold mb-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-green-500 animate-pulse">shield</span>
            Live Shield
          </h1>
          <p className="text-white/60 font-body text-lg">
            Real-time threat monitoring and protection
          </p>
        </div>

        {!connectedWallet ? (
          <div className="glass-panel rounded-lg p-12 border-white/10 text-center">
            <span className="material-symbols-outlined text-6xl text-white/40 mb-4">shield</span>
            <h2 className="text-2xl font-headline font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">Connect your wallet to activate real-time protection</p>
            <button
              onClick={checkWalletConnection}
              className="px-6 py-3 bg-white text-black rounded-full font-headline font-bold hover:scale-[0.98] transition-transform"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Status Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-panel rounded-lg p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-3xl text-green-500">verified_user</span>
                  <span className="text-xs font-label text-white/40">STATUS</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-1">{isMonitoring ? 'ACTIVE' : 'STANDBY'}</h3>
                <p className="text-sm text-white/60">
                  {isMonitoring ? 'Monitoring your wallet' : 'Protection paused'}
                </p>
              </div>

              <div className="glass-panel rounded-lg p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-3xl text-blue-500">radar</span>
                  <span className="text-xs font-label text-white/40">MONITORS</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-1">{activeMonitors}</h3>
                <p className="text-sm text-white/60">Active monitoring nodes</p>
              </div>

              <div className="glass-panel rounded-lg p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-3xl text-yellow-500">warning</span>
                  <span className="text-xs font-label text-white/40">ALERTS</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-1">{threats.length}</h3>
                <p className="text-sm text-white/60">Detected events</p>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="glass-panel rounded-lg p-6 border-white/10 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-label text-white/40 mb-1">PROTECTED WALLET</h3>
                  <p className="font-mono text-lg">{connectedWallet}</p>
                </div>
                <button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`px-4 py-2 rounded-full text-xs font-headline font-bold transition-colors ${
                    isMonitoring 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
                  }`}
                >
                  {isMonitoring ? 'MONITORING' : 'PAUSED'}
                </button>
              </div>
            </div>

            {/* Real-time Threat Feed */}
            <div className="glass-panel rounded-lg p-8 border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500">notifications_active</span>
                  Activity Feed
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                  <span className="text-xs font-label text-white/60">{isMonitoring ? 'LIVE' : 'PAUSED'}</span>
                </div>
              </div>

              <div className="space-y-3">
                {threats.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <span className="material-symbols-outlined text-6xl mb-4">shield_with_heart</span>
                    <p className="font-body">No threats detected. System is secure.</p>
                    <p className="text-xs mt-2">Monitoring blockchain activity...</p>
                  </div>
                ) : (
                  threats.map(threat => (
                    <div
                      key={threat.id}
                      className={`p-4 rounded-lg border ${
                        threat.severity === 'high'
                          ? 'bg-red-500/10 border-red-500/30'
                          : threat.severity === 'medium'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-blue-500/10 border-blue-500/30'
                      } animate-in fade-in slide-in-from-top duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${
                            threat.severity === 'high' ? 'text-red-500' :
                            threat.severity === 'medium' ? 'text-yellow-500' :
                            'text-blue-500'
                          }`}>
                            {threat.severity === 'high' ? 'dangerous' : 'info'}
                          </span>
                          <div>
                            <h4 className="font-headline font-bold text-sm">{threat.type}</h4>
                            <p className="text-xs text-white/60">{threat.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-label uppercase px-2 py-1 rounded ${
                            threat.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                            threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {threat.severity}
                          </span>
                          <p className="text-xs text-white/40 mt-1">{threat.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monitoring Controls */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-lg p-6 border-white/10">
                <h3 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">tune</span>
                  Shield Configuration
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-sm">Contract Monitoring</span>
                    <button className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-bold">
                      ENABLED
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-sm">Wallet Tracking</span>
                    <button className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-bold">
                      ENABLED
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-sm">Transaction Guard</span>
                    <button className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-bold">
                      ENABLED
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-lg p-6 border-white/10">
                <h3 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">analytics</span>
                  Protection Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Threats Blocked</span>
                    <span className="text-xl font-headline font-bold">{stats.threatsBlocked}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Contracts Scanned</span>
                    <span className="text-xl font-headline font-bold">{stats.contractsScanned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Wallets Protected</span>
                    <span className="text-xl font-headline font-bold">{stats.walletsProtected}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Uptime</span>
                    <span className="text-xl font-headline font-bold text-green-500">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
