'use client'

import { useState } from 'react'
import { useTransactionGuard } from '@/hooks/useTransactionGuard'
import { BrowserProvider } from 'ethers'

export default function VaultPage() {
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { isEnabled, guardTransaction, toggleGuard } = useTransactionGuard()

  const handleDeposit = async () => {
    if (!depositAmount || !window.ethereum) return

    setLoading(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      // Vault contract address
      const vaultAddress = '0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3'

      // Create transaction
      const tx = {
        to: vaultAddress,
        from: userAddress,
        value: (parseFloat(depositAmount) * 1e18).toString(),
        data: '0x' // deposit function call data would go here
      }

      // Guard the transaction
      const allowed = await guardTransaction(tx)

      if (allowed) {
        alert('Transaction would be sent here (demo mode)')
        // In production: await signer.sendTransaction(tx)
        setDepositAmount('')
      } else {
        alert('Transaction cancelled by user or blocked by Ghost Shell')
      }
    } catch (error) {
      console.error('Deposit error:', error)
      alert('Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || !window.ethereum) return

    setLoading(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      const vaultAddress = '0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3'

      const tx = {
        to: vaultAddress,
        from: userAddress,
        data: '0x' // withdraw function call data
      }

      const allowed = await guardTransaction(tx)

      if (allowed) {
        alert('Withdrawal would be processed here (demo mode)')
        setWithdrawAmount('')
      } else {
        alert('Transaction cancelled')
      }
    } catch (error) {
      console.error('Withdraw error:', error)
      alert('Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-headline font-bold mb-4">
            Secure Vault
          </h1>
          <p className="text-white/60 font-body text-lg">
            Protected by Ghost Shell security protocol
          </p>
        </div>

        {/* Ghost Shell Status */}
        <div className="mb-8 glass-panel rounded-lg p-4 border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-green-500">shield</span>
            <div>
              <h3 className="font-headline font-bold text-sm">Ghost Shell Protection</h3>
              <p className="text-xs text-white/60">
                {isEnabled ? 'Active - All transactions are monitored' : 'Disabled - Transactions not protected'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleGuard}
            className={`px-4 py-2 rounded-full text-xs font-headline font-bold transition-colors ${
              isEnabled 
                ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                : 'bg-red-500/20 text-red-500 border border-red-500/30'
            }`}
          >
            {isEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vault Info */}
          <div className="glass-panel rounded-lg p-8 border-white/10">
            <h2 className="text-2xl font-headline font-bold mb-6">Vault Information</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/60 font-label text-sm">Contract Address</span>
                <span className="font-mono text-sm">0x6483...d1c3</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/60 font-label text-sm">Total Value Locked</span>
                <span className="font-headline text-xl font-bold">0.00 HSK</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/60 font-label text-sm">Your Balance</span>
                <span className="font-headline text-xl font-bold">0.00 HSK</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/60 font-label text-sm">Security Status</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-green-500 font-label text-sm">PROTECTED</span>
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-500">shield</span>
                <div>
                  <h3 className="font-headline font-bold text-sm mb-1">Ghost Shell Protected</h3>
                  <p className="text-xs text-white/60">
                    This vault uses the GhostShellGuard modifier to prevent interactions with malicious contracts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Deposit/Withdraw */}
          <div className="space-y-6">
            {/* Deposit */}
            <div className="glass-panel rounded-lg p-8 border-white/10">
              <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Deposit
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-label text-xs text-white/40 mb-2">AMOUNT</label>
                  <input
                    type="number"
                    placeholder="0.0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-white/20 focus:outline-none"
                  />
                </div>
                
                <button 
                  onClick={handleDeposit}
                  disabled={loading || !depositAmount}
                  className="w-full bg-white text-black py-3 rounded-full font-headline font-bold hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Deposit HSK'}
                </button>
              </div>
            </div>

            {/* Withdraw */}
            <div className="glass-panel rounded-lg p-8 border-white/10">
              <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">remove_circle</span>
                Withdraw
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-label text-xs text-white/40 mb-2">AMOUNT</label>
                  <input
                    type="number"
                    placeholder="0.0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-white/20 focus:outline-none"
                  />
                </div>
                
                <button 
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAmount}
                  className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-full font-headline font-bold hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Withdraw HSK'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 glass-panel rounded-lg p-8 border-white/10">
          <h2 className="text-xl font-headline font-bold mb-6">Recent Transactions</h2>
          
          <div className="text-center py-12 text-white/40">
            <span className="material-symbols-outlined text-6xl mb-4">receipt_long</span>
            <p className="font-body">No transactions yet</p>
          </div>
        </div>
      </div>
    </main>
  )
}
