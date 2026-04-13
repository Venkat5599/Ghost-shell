'use client'

import { useState } from 'react'
import ContractScanner from '@/components/ContractScanner'
import WalletAnalyzer from '@/components/WalletAnalyzer'
import RiskCheckModal from '@/components/RiskCheckModal'
import AnomalyMonitor from '@/components/AnomalyMonitor'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'contract' | 'wallet'>('contract')
  const [showRiskCheck, setShowRiskCheck] = useState(false)

  return (
    <>
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blur-purple opacity-40"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blur-cyan opacity-30"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-44 pb-20 px-8 flex flex-col items-center text-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-8 border-secondary/20">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="text-[10px] font-label uppercase tracking-[0.2em] text-secondary">
            Securing HashKey Ecosystem
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-headline text-7xl md:text-8xl font-bold tracking-tighter text-white mb-6">
          GHOST SHELL
        </h1>
        <h2 className="font-headline text-3xl md:text-4xl font-light text-white/90 mb-8">
          攻殻機動隊 • Security Protocol
        </h2>
        <p className="max-w-2xl text-lg text-white/50 font-body leading-relaxed mb-12">
          Real-time security layer for DeFi applications on HashKey Chain. <br className="hidden md:block"/>
          Leveraging neural networks to detect exploits before they happen.
        </p>

        {/* Main Glass Container */}
        <div className="w-full max-w-5xl glass-panel rounded-xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('contract')}
              className={`flex-1 py-6 flex items-center justify-center gap-3 font-headline text-sm font-bold transition-all ${
                activeTab === 'contract'
                  ? 'bg-white/5 text-white border-b-2 border-white'
                  : 'text-white/40 hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">terminal</span>
              Contract Scanner
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-6 flex items-center justify-center gap-3 font-headline text-sm transition-all ${
                activeTab === 'wallet'
                  ? 'bg-white/5 text-white border-b-2 border-white font-bold'
                  : 'text-white/40 font-medium hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              Wallet Analyzer
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8 md:p-12">
            {activeTab === 'contract' ? <ContractScanner /> : <WalletAnalyzer />}
          </div>
        </div>

        {/* Feature Cards */}
        <section className="w-full max-w-7xl mt-24 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-10 rounded-xl flex flex-col gap-6 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <h3 className="font-headline text-2xl font-bold">Neural Engine</h3>
              <p className="text-white/50 font-body leading-relaxed">
                Trained on 10,000+ known exploits and bug bounties to recognize patterns before they reach the mainnet.
              </p>
            </div>

            <div className="glass-panel p-10 rounded-xl flex flex-col gap-6 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <h3 className="font-headline text-2xl font-bold">Instant Shield</h3>
              <p className="text-white/50 font-body leading-relaxed">
                Real-time transaction monitoring that blocks suspicious calls before they can execute on the blockchain.
              </p>
            </div>

            <div className="glass-panel p-10 rounded-xl flex flex-col gap-6 group hover:translate-y-[-8px] transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <span className="material-symbols-outlined text-3xl">hub</span>
              </div>
              <h3 className="font-headline text-2xl font-bold">HashKey Native</h3>
              <p className="text-white/50 font-body leading-relaxed">
                Optimized for HashKey Chain's unique architecture, providing deep integration and ultra-low latency.
              </p>
            </div>
          </div>
        </section>

        {/* Anomaly Monitor Section */}
        <section className="w-full max-w-5xl mt-16 px-4">
          <AnomalyMonitor />
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={() => setShowRiskCheck(true)}
          className="group relative flex items-center justify-center p-0.5 rounded-full overflow-hidden transition-transform active:scale-90"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-tertiary animate-spin-slow opacity-50 blur-lg"></div>
          <div className="relative glass-panel rounded-full px-8 py-4 flex items-center gap-3 border-white/20 hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
            <span className="font-headline font-bold text-sm text-white">Quick Risk Check</span>
          </div>
        </button>
      </div>

      {/* Risk Check Modal */}
      {showRiskCheck && <RiskCheckModal onClose={() => setShowRiskCheck(false)} />}
    </>
  )
}
