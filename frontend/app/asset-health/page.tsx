'use client'

import { useState, useEffect } from 'react'
import { BrowserProvider, formatEther } from 'ethers'
import { analyzeWallet } from '@/lib/api'

interface Asset {
  name: string
  balance: string
  value: string
  change: string
  health: number
}

export default function AssetHealthPage() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [portfolioAssets, setPortfolioAssets] = useState<Asset[]>([])
  const [healthScore, setHealthScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [totalValue, setTotalValue] = useState('0.00')
  const [walletData, setWalletData] = useState<any>(null)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const address = accounts[0].address
          setConnectedWallet(address)
          await loadWalletData(address)
        }
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }
  }

  const loadWalletData = async (address: string) => {
    setLoading(true)
    try {
      const provider = new BrowserProvider(window.ethereum!)
      
      // Check network
      const network = await provider.getNetwork()
      console.log('Connected to network:', network.chainId.toString())
      
      // If not on HashKey Testnet (133), try to switch
      if (Number(network.chainId) !== 133) {
        console.log('Not on HashKey Testnet, attempting to switch...')
        try {
          await window.ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x85' }], // 133 in hex
          })
          // Reload after switching
          window.location.reload()
          return
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum!.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x85',
                    chainName: 'HashKey Chain Testnet',
                    nativeCurrency: {
                      name: 'HSK',
                      symbol: 'HSK',
                      decimals: 18,
                    },
                    rpcUrls: ['https://testnet.hsk.xyz'],
                    blockExplorerUrls: ['https://testnet-explorer.hsk.xyz'],
                  },
                ],
              })
              // Reload after adding
              window.location.reload()
              return
            } catch (addError) {
              console.error('Error adding network:', addError)
              alert('Please add HashKey Chain Testnet to your wallet manually')
              setLoading(false)
              return
            }
          } else {
            console.error('Error switching network:', switchError)
            alert('Please switch to HashKey Chain Testnet manually')
            setLoading(false)
            return
          }
        }
      }
      
      // Get real balance from HashKey Testnet
      const balance = await provider.getBalance(address)
      const balanceInEth = formatEther(balance)
      
      console.log('Balance:', balanceInEth, 'HSK')
      
      // Get transaction count for health calculation
      const txCount = await provider.getTransactionCount(address)
      
      // Analyze wallet via API
      let analysis
      try {
        analysis = await analyzeWallet(address)
        setWalletData(analysis)
      } catch (apiError) {
        console.error('API error:', apiError)
        // If API fails, create a basic analysis from blockchain data
        analysis = {
          riskScore: 0,
          riskLevel: 'low',
          transactionCount: txCount,
          factors: [],
          aiSummary: 'Unable to fetch detailed analysis. Showing basic blockchain data.',
        }
        setWalletData(analysis)
      }
      
      // Calculate health score (inverse of risk score)
      const health = Math.max(0, 100 - analysis.riskScore)
      setHealthScore(health)
      
      // Build real asset list
      const assets: Asset[] = [
        {
          name: 'HSK',
          balance: parseFloat(balanceInEth).toFixed(4),
          value: `$${(parseFloat(balanceInEth) * 1.5).toFixed(2)}`,
          change: '+0.0%',
          health: health,
        },
      ]
      
      setPortfolioAssets(assets)
      setTotalValue((parseFloat(balanceInEth) * 1.5).toFixed(2))
      
    } catch (error) {
      console.error('Error loading wallet data:', error)
      
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Detailed error:', errorMessage)
      
      // Don't alert, just log - we'll show the data we can get
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-headline font-bold mb-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-blue-500">monitor_heart</span>
            Asset Health
          </h1>
          <p className="text-white/60 font-body text-lg">
            Monitor your portfolio security and asset health
          </p>
        </div>

        {!connectedWallet ? (
          <div className="glass-panel rounded-lg p-12 border-white/10 text-center">
            <span className="material-symbols-outlined text-6xl text-white/40 mb-4">account_balance_wallet</span>
            <h2 className="text-2xl font-headline font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">Connect your wallet to view real-time asset health data</p>
            <button
              onClick={checkWalletConnection}
              className="px-6 py-3 bg-white text-black rounded-full font-headline font-bold hover:scale-[0.98] transition-transform"
            >
              Connect Wallet
            </button>
          </div>
        ) : loading ? (
          <div className="glass-panel rounded-lg p-12 border-white/10 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Loading your asset data...</p>
          </div>
        ) : (
          <>
            {/* Overall Health Score */}
            <div className="glass-panel rounded-lg p-8 border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold">Portfolio Health Score</h2>
                <span className="text-xs font-label text-white/40">WALLET: {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}</span>
              </div>

              <div className="flex items-center gap-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={healthScore >= 70 ? '#22c55e' : healthScore >= 40 ? '#eab308' : '#ef4444'}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - healthScore / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-headline font-bold">{healthScore}</span>
                    <span className="text-xs text-white/60">
                      {healthScore >= 70 ? 'HEALTHY' : healthScore >= 40 ? 'CAUTION' : 'AT RISK'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="text-xs font-label text-white/60">SECURE</span>
                    </div>
                    <p className="text-2xl font-headline font-bold">{portfolioAssets.filter(a => a.health >= 70).length}</p>
                    <p className="text-xs text-white/40">Assets</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      <span className="text-xs font-label text-white/60">CAUTION</span>
                    </div>
                    <p className="text-2xl font-headline font-bold">{portfolioAssets.filter(a => a.health >= 40 && a.health < 70).length}</p>
                    <p className="text-xs text-white/40">Assets</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="text-xs font-label text-white/60">AT RISK</span>
                    </div>
                    <p className="text-2xl font-headline font-bold">{portfolioAssets.filter(a => a.health < 40).length}</p>
                    <p className="text-xs text-white/40">Assets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-panel rounded-lg p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-3xl text-green-500">account_balance_wallet</span>
                  <span className="text-xs font-label text-white/40">TOTAL VALUE</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-1">${totalValue}</h3>
                <p className="text-sm text-white/60">Real-time balance</p>
              </div>

              <div className="glass-panel rounded-lg p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-3xl text-blue-500">security</span>
                  <span className="text-xs font-label text-white/40">RISK LEVEL</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-1">{walletData?.riskLevel.toUpperCase()}</h3>
                <p className="text-sm text-white/60">Risk Score: {walletData?.riskScore}/100</p>
              </div>

              <div className="glass-panel rounded-lg p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-3xl text-purple-500">receipt_long</span>
                  <span className="text-xs font-label text-white/40">ACTIVITY</span>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-1">{walletData?.transactionCount || 0}</h3>
                <p className="text-sm text-white/60">Total transactions</p>
              </div>
            </div>

            {/* Asset List */}
            <div className="glass-panel rounded-lg p-8 border-white/10 mb-8">
              <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">inventory_2</span>
                Your Assets
              </h2>

              <div className="space-y-4">
                {portfolioAssets.map((asset, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="font-headline font-bold">{asset.name[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-headline font-bold text-lg">{asset.name}</h3>
                          <p className="text-sm text-white/60">{asset.balance} tokens</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-headline font-bold text-lg">{asset.value}</p>
                        <p className="text-sm text-white/60">{asset.change}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            asset.health >= 70 ? 'bg-green-500' :
                            asset.health >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${asset.health}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-label text-white/60">
                        Health: {asset.health}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Recommendations */}
            <div className="glass-panel rounded-lg p-8 border-white/10">
              <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-500">lightbulb</span>
                Security Recommendations
              </h2>

              <div className="space-y-4">
                {walletData?.factors.length === 0 ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-green-500">check_circle</span>
                      <div>
                        <h3 className="font-headline font-bold text-sm mb-1">All Clear!</h3>
                        <p className="text-xs text-white/60">
                          Your wallet shows no risk factors. Continue following security best practices.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  walletData?.factors.map((factor: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        factor.severity === 'high' ? 'bg-red-500/10 border-red-500/20' :
                        factor.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                        'bg-blue-500/10 border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`material-symbols-outlined ${
                          factor.severity === 'high' ? 'text-red-500' :
                          factor.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`}>
                          {factor.severity === 'high' ? 'warning' : 'info'}
                        </span>
                        <div>
                          <h3 className="font-headline font-bold text-sm mb-1">{factor.description}</h3>
                          <p className="text-xs text-white/60">
                            {factor.evidence.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {walletData?.aiSummary && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
                      <div>
                        <h3 className="font-headline font-bold text-sm mb-1">AI Analysis</h3>
                        <p className="text-xs text-white/60">{walletData.aiSummary}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
