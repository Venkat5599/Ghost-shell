'use client'

import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    checkConnection()
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const addr = await signer.getAddress()
          setAddress(addr)
          await updateBalance(addr)
          await updateChainId()
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0])
      updateBalance(accounts[0])
    } else {
      setAddress(null)
      setBalance(null)
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const updateBalance = async (addr: string) => {
    try {
      const provider = new BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(addr)
      const balanceInEth = (Number(balance) / 1e18).toFixed(4)
      setBalance(balanceInEth)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const updateChainId = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))
    } catch (error) {
      console.error('Error fetching chain ID:', error)
    }
  }

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet!')
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const addr = await signer.getAddress()
      setAddress(addr)
      await updateBalance(addr)
      await updateChainId()
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const handleDisconnect = () => {
    setAddress(null)
    setBalance(null)
    setChainId(null)
    setShowMenu(false)
  }

  const handleSwitchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x85' }], // 133 in hex
      })
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x85',
              chainName: 'HashKey Chain Testnet',
              nativeCurrency: {
                name: 'HSK',
                symbol: 'HSK',
                decimals: 18
              },
              rpcUrls: ['https://testnet.hsk.xyz'],
              blockExplorerUrls: ['https://testnet-explorer.hsk.xyz']
            }]
          })
        } catch (addError) {
          console.error('Error adding network:', addError)
        }
      }
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      alert('Address copied!')
    }
  }

  if (!address) {
    return (
      <button
        onClick={handleConnect}
        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-headline font-bold text-white transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-headline font-bold text-white transition-all flex items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-mono text-xs">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        {balance && (
          <span className="text-xs text-white/60">
            {balance} HSK
          </span>
        )}
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-72 glass-panel rounded-lg border border-white/10 shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 font-label">CONNECTED WALLET</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-green-500 font-label">ACTIVE</span>
                </div>
              </div>
              <div className="font-mono text-sm text-white break-all">
                {address}
              </div>
            </div>

            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/40 font-label">BALANCE</span>
              </div>
              <div className="text-xl font-headline font-bold text-white">
                {balance ? `${balance} HSK` : '0.0000 HSK'}
              </div>
            </div>

            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 font-label">NETWORK</span>
                {chainId !== 133 && (
                  <span className="text-[10px] text-yellow-500 font-label">WRONG NETWORK</span>
                )}
              </div>
              <div className="text-sm text-white mb-2">
                {chainId === 133 ? 'HashKey Chain Testnet' : 
                 chainId === 177 ? 'HashKey Chain Mainnet' : 
                 chainId ? `Chain ID: ${chainId}` : 'Unknown'}
              </div>
              {chainId !== 133 && (
                <button
                  onClick={handleSwitchNetwork}
                  className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-xs font-headline font-bold text-yellow-500 transition-colors"
                >
                  Switch to HashKey Testnet
                </button>
              )}
            </div>

            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  window.open(`https://testnet-explorer.hsk.xyz/address/${address}`, '_blank')
                }}
                className="w-full py-2 glass-panel hover:bg-white/5 rounded-lg text-xs font-headline font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                View on Explorer
              </button>
              <button
                onClick={copyAddress}
                className="w-full py-2 glass-panel hover:bg-white/5 rounded-lg text-xs font-headline font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                Copy Address
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full py-2 bg-error/20 hover:bg-error/30 border border-error/30 rounded-lg text-xs font-headline font-bold text-error transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
