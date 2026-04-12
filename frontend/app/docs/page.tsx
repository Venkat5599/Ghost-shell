'use client'

import { useState } from 'react'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: 'rocket_launch' },
    { id: 'contract-scanner', title: 'Contract Scanner', icon: 'terminal' },
    { id: 'wallet-analyzer', title: 'Wallet Analyzer', icon: 'account_balance_wallet' },
    { id: 'send-transactions', title: 'Send Transactions', icon: 'send' },
    { id: 'api-reference', title: 'API Reference', icon: 'code' },
    { id: 'smart-contracts', title: 'Smart Contracts', icon: 'description' },
  ]

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-headline font-bold mb-4 flex items-center justify-center gap-4">
            <span className="material-symbols-outlined text-6xl text-purple-500">menu_book</span>
            Documentation
          </h1>
          <p className="text-white/60 font-body text-lg">
            Complete guide to using Ghost Shell security platform
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="glass-panel rounded-lg p-4 border-white/10 sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{section.icon}</span>
                    <span className="font-label text-xs uppercase tracking-wider">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="glass-panel rounded-lg p-8 border-white/10">
              {activeSection === 'getting-started' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-headline font-bold mb-4">Getting Started</h2>
                  
                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">What is Ghost Shell?</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Ghost Shell (攻殻機動隊) is an AI-powered security platform for DeFi applications on HashKey Chain. 
                    It provides real-time contract scanning, wallet analysis, and transaction protection to keep your assets safe.
                  </p>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">Quick Start</h3>
                  <ol className="list-decimal list-inside space-y-3 text-white/80">
                    <li>Connect your MetaMask wallet</li>
                    <li>Switch to HashKey Chain Testnet (Chain ID: 133)</li>
                    <li>Start scanning contracts or analyzing wallets</li>
                    <li>Enable AI transaction protection for secure sends</li>
                  </ol>

                  <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-blue-500">info</span>
                      <div>
                        <h4 className="font-headline font-bold text-sm mb-1">Network Configuration</h4>
                        <ul className="text-xs text-white/60 space-y-1">
                          <li>• Network: HashKey Chain Testnet</li>
                          <li>• Chain ID: 133</li>
                          <li>• RPC: https://hashkeychain-testnet.alt.technology</li>
                          <li>• Explorer: https://testnet-explorer.hsk.xyz</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'contract-scanner' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-headline font-bold mb-4">Contract Scanner</h2>
                  
                  <p className="text-white/80 leading-relaxed mb-6">
                    The Contract Scanner analyzes smart contract bytecode to detect vulnerabilities and security issues.
                  </p>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">How to Use</h3>
                  <ol className="list-decimal list-inside space-y-3 text-white/80">
                    <li>Navigate to the Dashboard or Scanner page</li>
                    <li>Enter a contract address (0x...)</li>
                    <li>Click "Scan Contract"</li>
                    <li>Review the security report</li>
                  </ol>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">What We Check</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Reentrancy vulnerabilities</li>
                    <li>Access control issues</li>
                    <li>Unchecked external calls</li>
                    <li>Dangerous delegatecall patterns</li>
                    <li>Contract verification status</li>
                  </ul>

                  <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-headline font-bold mb-2">Risk Levels</h4>
                    <ul className="text-sm text-white/80 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span>Safe (0-30): No critical issues found</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span>Warning (31-70): Some issues detected</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span>Critical (71-100): Serious vulnerabilities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'wallet-analyzer' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-headline font-bold mb-4">Wallet Analyzer</h2>
                  
                  <p className="text-white/80 leading-relaxed mb-6">
                    Analyze wallet behavior and transaction patterns to identify potential risks.
                  </p>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Transaction count analysis</li>
                    <li>Balance verification</li>
                    <li>Suspicious interaction detection</li>
                    <li>AI-powered risk assessment</li>
                  </ul>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">Risk Factors</h3>
                  <p className="text-white/80 mb-4">The analyzer checks for:</p>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>New wallet (low transaction count)</li>
                    <li>High-frequency trading patterns</li>
                    <li>Interactions with flagged contracts</li>
                    <li>Unusual balance changes</li>
                  </ul>
                </div>
              )}

              {activeSection === 'send-transactions' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-headline font-bold mb-4">Send Transactions</h2>
                  
                  <p className="text-white/80 leading-relaxed mb-6">
                    Send HSK tokens with AI-powered transaction protection that blocks malicious transactions before execution.
                  </p>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">How It Works</h3>
                  <ol className="list-decimal list-inside space-y-3 text-white/80">
                    <li>Enter recipient address and amount</li>
                    <li>Ghost Shell analyzes the transaction (&lt;1 second)</li>
                    <li>If risky, a warning modal appears</li>
                    <li>You can proceed or cancel</li>
                    <li>High-risk transactions are blocked automatically</li>
                  </ol>

                  <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-headline font-bold mb-2">Protection Features</h4>
                    <ul className="text-sm text-white/80 space-y-2">
                      <li>✓ Pre-transaction scanning</li>
                      <li>✓ Recipient address verification</li>
                      <li>✓ AI risk analysis</li>
                      <li>✓ Instant blocking of malicious transactions</li>
                      <li>✓ User override for medium-risk transactions</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'api-reference' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-headline font-bold mb-4">API Reference</h2>
                  
                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">Base URL</h3>
                  <div className="p-4 bg-white/5 rounded-lg font-mono text-sm mb-6">
                    http://localhost:3001/api
                  </div>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">Endpoints</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-xs font-bold">POST</span>
                        <code className="text-sm">/scan-contract</code>
                      </div>
                      <p className="text-white/60 text-sm mb-3">Scan a smart contract for vulnerabilities</p>
                      <div className="text-xs">
                        <p className="text-white/40 mb-2">Request Body:</p>
                        <pre className="p-3 bg-black/30 rounded overflow-x-auto">
{`{
  "contractAddress": "0x..."
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-xs font-bold">POST</span>
                        <code className="text-sm">/analyze-wallet</code>
                      </div>
                      <p className="text-white/60 text-sm mb-3">Analyze wallet behavior and risk</p>
                      <div className="text-xs">
                        <p className="text-white/40 mb-2">Request Body:</p>
                        <pre className="p-3 bg-black/30 rounded overflow-x-auto">
{`{
  "walletAddress": "0x..."
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-xs font-bold">POST</span>
                        <code className="text-sm">/risk-check</code>
                      </div>
                      <p className="text-white/60 text-sm mb-3">Combined contract and wallet risk check</p>
                      <div className="text-xs">
                        <p className="text-white/40 mb-2">Request Body:</p>
                        <pre className="p-3 bg-black/30 rounded overflow-x-auto">
{`{
  "contractAddress": "0x...",
  "walletAddress": "0x..."
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'smart-contracts' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-headline font-bold mb-4">Smart Contracts</h2>
                  
                  <p className="text-white/80 leading-relaxed mb-6">
                    Ghost Shell's on-chain security infrastructure deployed on HashKey Chain.
                  </p>

                  <h3 className="text-xl font-headline font-bold mt-8 mb-4">Deployed Contracts</h3>
                  
                  <div className="space-y-4">
                    <div className="p-6 bg-white/5 rounded-lg">
                      <h4 className="font-headline font-bold mb-2">GhostShellRegistry</h4>
                      <p className="text-white/60 text-sm mb-3">
                        Central registry for security manifests and auditor authorization
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-black/30 px-3 py-1 rounded">
                          0x2CD70324C4043D90f3C45D6ac7E84aB828708205
                        </code>
                        <a
                          href="https://testnet-explorer.hsk.xyz/address/0x2CD70324C4043D90f3C45D6ac7E84aB828708205"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-lg">
                      <h4 className="font-headline font-bold mb-2">SecureVault</h4>
                      <p className="text-white/60 text-sm mb-3">
                        Example vault with Ghost Shell protection
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-black/30 px-3 py-1 rounded">
                          0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3
                        </code>
                        <a
                          href="https://testnet-explorer.hsk.xyz/address/0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
