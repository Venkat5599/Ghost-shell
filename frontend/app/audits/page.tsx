'use client'

import { useState } from 'react'

type AuditStatus = 'safe' | 'warning' | 'critical'

interface Audit {
  id: string
  contractAddress: string
  contractName: string
  date: string
  riskScore: number
  status: AuditStatus
  issues: number
}

export default function AuditsPage() {
  const [audits] = useState<Audit[]>([
    {
      id: '1',
      contractAddress: '0x2CD70324C4043D90f3C45D6ac7E84aB828708205',
      contractName: 'GhostShellRegistry',
      date: '2026-04-12',
      riskScore: 60,
      status: 'warning',
      issues: 3,
    },
    {
      id: '2',
      contractAddress: '0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3',
      contractName: 'SecureVault',
      date: '2026-04-12',
      riskScore: 45,
      status: 'warning',
      issues: 2,
    },
  ])

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-headline font-bold mb-4">
            Security Audits
          </h1>
          <p className="text-white/60 font-body text-lg">
            View and manage your contract security audits
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel rounded-lg p-6 border-white/10">
            <div className="text-3xl font-headline font-bold mb-2">{audits.length}</div>
            <div className="text-sm text-white/60 font-label">Total Audits</div>
          </div>
          
          <div className="glass-panel rounded-lg p-6 border-white/10">
            <div className="text-3xl font-headline font-bold mb-2 text-green-500">0</div>
            <div className="text-sm text-white/60 font-label">Safe Contracts</div>
          </div>
          
          <div className="glass-panel rounded-lg p-6 border-white/10">
            <div className="text-3xl font-headline font-bold mb-2 text-yellow-500">{audits.length}</div>
            <div className="text-sm text-white/60 font-label">Warnings</div>
          </div>
          
          <div className="glass-panel rounded-lg p-6 border-white/10">
            <div className="text-3xl font-headline font-bold mb-2 text-error">0</div>
            <div className="text-sm text-white/60 font-label">Critical Issues</div>
          </div>
        </div>

        {/* Audits List */}
        <div className="glass-panel rounded-lg border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-headline font-bold">Audit History</h2>
          </div>

          <div className="divide-y divide-white/10">
            {audits.map((audit) => (
              <div key={audit.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-headline font-bold text-lg">{audit.contractName}</h3>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-label font-bold ${
                        audit.status === 'critical' ? 'bg-error/20 text-error' :
                        audit.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {audit.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-white/60">
                      <span className="font-mono">{audit.contractAddress.slice(0, 10)}...{audit.contractAddress.slice(-8)}</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {audit.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                        {audit.issues} issues
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-headline font-bold mb-1">{audit.riskScore}</div>
                      <div className="text-xs text-white/40 font-label">RISK SCORE</div>
                    </div>

                    <button className="px-6 py-2 glass-panel rounded-full text-sm font-headline font-bold hover:bg-white/10 transition-colors">
                      View Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Audit Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = '/scanner'}
            className="px-8 py-4 bg-white text-black rounded-full font-headline font-bold hover:scale-[0.98] transition-transform inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            New Security Audit
          </button>
        </div>
      </div>
    </main>
  )
}
