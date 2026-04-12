'use client'

import { useState, useEffect } from 'react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useTransactionGuard } from '@/hooks/useTransactionGuard'

export default function SendPage() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [balance, setBalance] = useState('0')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [wrongNetwork, setWrongNetwork] = useState(false)
  const [currentChainId, setCurrentChainId] = useState<number | null>(null)
  const [txSuccess, setTxSuccess] = useState<{
    hash: string
    from: string
    to: string
    amount: string
    timestamp: string
  } | null>(null)
  const { isEnabled, guardTransaction, toggleGuard } = useTransactionGuard()

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum)
        
        // Check network first
        const network = await provider.getNetwork()
        const chainId = Number(network.chainId)
        setCurrentChainId(chainId)
        console.log('Connected to network:', chainId)
        
        // Check if on HashKey Testnet (133)
        if (chainId !== 133) {
          console.log('Wrong network! Need HashKey Testnet (133)')
          setWrongNetwork(true)
          setBalance('0')
          
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            setConnectedWallet(accounts[0].address)
          }
          return
        }
        
        setWrongNetwork(false)
        
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const address = accounts[0].address
          setConnectedWallet(address)
          
          // Get balance
          const bal = await provider.getBalance(address)
          const balanceInEth = formatEther(bal)
          console.log('Balance:', balanceInEth, 'HSK')
          setBalance(balanceInEth)
        }
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }
  }

  const switchToHashKeyTestnet = async () => {
    if (typeof window.ethereum === 'undefined') return
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x85' }], // 133 in hex
      })
      // Reload after switching
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
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
          setTimeout(() => {
            window.location.reload()
          }, 500)
        } catch (addError) {
          console.error('Error adding network:', addError)
          alert('Failed to add HashKey Chain Testnet. Please add it manually.')
        }
      } else {
        console.error('Error switching network:', switchError)
        alert('Failed to switch network. Please switch manually in your wallet.')
      }
    }
  }

  const handleSend = async () => {
    if (!recipient || !amount || !window.ethereum) return

    setLoading(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      // Create transaction
      const tx = {
        to: recipient,
        from: userAddress,
        value: parseEther(amount).toString(),
        data: '0x',
      }

      // AI-powered transaction guard
      const allowed = await guardTransaction(tx)

      if (allowed) {
        // Send transaction
        const txResponse = await signer.sendTransaction({
          to: recipient,
          value: parseEther(amount),
        })

        // Show success modal immediately
        setTxSuccess({
          hash: txResponse.hash,
          from: userAddress,
          to: recipient,
          amount: amount,
          timestamp: new Date().toISOString(),
        })
        
        // Wait for confirmation in background
        txResponse.wait().then(() => {
          console.log('Transaction confirmed!')
          // Refresh balance
          provider.getBalance(userAddress).then((newBalance) => {
            setBalance(formatEther(newBalance))
          })
        })
        
        // Reset form
        setRecipient('')
        setAmount('')
      } else {
        alert('Transaction cancelled or blocked by Ghost Shell protection')
      }
    } catch (error) {
      console.error('Send error:', error)
      alert('Transaction failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const setMaxAmount = () => {
    console.log('Current balance:', balance)
    // Leave some for gas (0.001 HSK)
    const maxAmount = Math.max(0, parseFloat(balance) - 0.001)
    console.log('Max amount:', maxAmount)
    setAmount(maxAmount.toFixed(6))
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-headline font-bold mb-4 flex items-center justify-center gap-4">
            <span className="material-symbols-outlined text-6xl text-green-500">send</span>
            Send Transaction
          </h1>
          <p className="text-white/60 font-body text-lg">
            AI-protected secure transactions on HashKey Chain
          </p>
        </div>

        {!connectedWallet ? (
          <div className="glass-panel rounded-lg p-12 border-white/10 text-center">
            <span className="material-symbols-outlined text-6xl text-white/40 mb-4">account_balance_wallet</span>
            <h2 className="text-2xl font-headline font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">Connect your wallet to send transactions</p>
            <button
              onClick={checkWalletConnection}
              className="px-6 py-3 bg-white text-black rounded-full font-headline font-bold hover:scale-[0.98] transition-transform"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Wrong Network Warning */}
            {wrongNetwork && (
              <div className="glass-panel rounded-lg p-8 border-red-500/30 mb-8 bg-red-500/10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
                  <div>
                    <h3 className="font-headline font-bold text-xl text-red-500">Wrong Network</h3>
                    <p className="text-white/80">
                      You're connected to Chain ID: {currentChainId}. Please switch to HashKey Chain Testnet (Chain ID: 133)
                    </p>
                  </div>
                </div>
                <button
                  onClick={switchToHashKeyTestnet}
                  className="w-full bg-red-500 text-white py-3 rounded-full font-headline font-bold hover:scale-[0.98] transition-transform"
                >
                  Switch to HashKey Testnet
                </button>
              </div>
            )}

            {/* AI Protection Status */}
            <div className="glass-panel rounded-lg p-6 border-white/10 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isEnabled ? 'bg-green-500/20 animate-pulse' : 'bg-gray-500/20'
                  }`}>
                    <span className={`material-symbols-outlined text-2xl ${
                      isEnabled ? 'text-green-500' : 'text-gray-500'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isEnabled ? 'verified_user' : 'shield'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm">AI Transaction Protection</h3>
                    <p className="text-xs text-white/60">
                      {isEnabled 
                        ? 'Every transaction is analyzed before execution' 
                        : 'Protection disabled - transactions not monitored'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleGuard}
                  className={`px-4 py-2 rounded-full text-xs font-headline font-bold transition-colors ${
                    isEnabled 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
                  }`}
                >
                  {isEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            {/* Balance Card */}
            <div className="glass-panel rounded-lg p-6 border-white/10 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-label text-white/40 mb-1">YOUR BALANCE</p>
                  <p className="text-3xl font-headline font-bold">{parseFloat(balance).toFixed(4)} HSK</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-label text-white/40 mb-1">WALLET</p>
                  <p className="font-mono text-sm">{connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}</p>
                </div>
              </div>
            </div>

            {/* Send Form */}
            <div className="glass-panel rounded-lg p-8 border-white/10">
              <h2 className="text-2xl font-headline font-bold mb-6">Send HSK</h2>

              <div className="space-y-6">
                {/* Recipient */}
                <div>
                  <label className="block font-label text-xs text-white/40 mb-2">RECIPIENT ADDRESS</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-white/20 focus:outline-none"
                  />
                </div>

                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-label text-xs text-white/40">AMOUNT</label>
                    <button
                      onClick={setMaxAmount}
                      className="text-xs font-label text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.000001"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-16 text-white font-mono text-lg focus:border-white/20 focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-headline text-sm">
                      HSK
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    Available: {parseFloat(balance).toFixed(6)} HSK
                  </p>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={loading || !recipient || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(balance)}
                  className="w-full bg-white text-black py-4 rounded-full font-headline font-bold text-lg hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Send Transaction
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500">info</span>
                <div>
                  <h3 className="font-headline font-bold text-sm mb-1">How AI Protection Works</h3>
                  <ul className="text-xs text-white/60 space-y-1">
                    <li>• Recipient address is scanned for known malicious contracts</li>
                    <li>• Transaction risk is analyzed in real-time (&lt;1 second)</li>
                    <li>• High-risk transactions are blocked before execution</li>
                    <li>• You maintain full control - can proceed with warnings</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Success Modal */}
      {txSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-panel rounded-lg p-8 max-w-lg w-full mx-4 border-2 border-green-500/30 animate-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="material-symbols-outlined text-5xl text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h2 className="text-3xl font-headline font-bold text-green-500 mb-2">Transaction Sent!</h2>
              <p className="text-white/60 text-sm">Your transaction has been broadcast to the network</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs font-label text-white/40 mb-1">TRANSACTION HASH</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-white flex-1 truncate">{txSuccess.hash}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(txSuccess.hash)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs font-label text-white/40 mb-1">FROM</p>
                  <p className="font-mono text-xs text-white truncate">{txSuccess.from.slice(0, 10)}...{txSuccess.from.slice(-8)}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs font-label text-white/40 mb-1">TO</p>
                  <p className="font-mono text-xs text-white truncate">{txSuccess.to.slice(0, 10)}...{txSuccess.to.slice(-8)}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs font-label text-white/40 mb-1">AMOUNT</p>
                <p className="text-2xl font-headline font-bold text-white">{txSuccess.amount} HSK</p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs font-label text-white/40 mb-1">TIMESTAMP</p>
                <p className="text-sm text-white">{new Date(txSuccess.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`https://testnet-explorer.hsk.xyz/tx/${txSuccess.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-white text-black rounded-full font-headline font-bold text-center hover:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View on Explorer
              </a>
              <button
                onClick={() => setTxSuccess(null)}
                className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-full font-headline font-bold hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-green-500 text-sm">info</span>
                <p className="text-xs text-white/60">
                  Transaction is being confirmed on the blockchain. This may take a few moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
