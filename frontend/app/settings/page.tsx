'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [protectionEnabled, setProtectionEnabled] = useState(true)
  const [autoScan, setAutoScan] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [riskThreshold, setRiskThreshold] = useState(70)

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold mb-4">Settings</h1>
          <p className="text-white/60">Configure your Ghost Shell security preferences</p>
        </div>

        {/* Security Settings */}
        <div className="glass-panel rounded-lg p-6 border-white/10 mb-6">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">security</span>
            Security Settings
          </h2>

          <div className="space-y-6">
            {/* Transaction Protection */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <h3 className="font-bold mb-1">Transaction Protection</h3>
                <p className="text-sm text-white/60">AI-powered pre-transaction risk analysis</p>
              </div>
              <button
                onClick={() => setProtectionEnabled(!protectionEnabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  protectionEnabled ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    protectionEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Scan */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <h3 className="font-bold mb-1">Auto-Scan Contracts</h3>
                <p className="text-sm text-white/60">Automatically scan contracts before interaction</p>
              </div>
              <button
                onClick={() => setAutoScan(!autoScan)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  autoScan ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    autoScan ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Risk Threshold */}
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold mb-1">Risk Threshold</h3>
                  <p className="text-sm text-white/60">Block transactions above this risk score</p>
                </div>
                <span className="text-2xl font-bold">{riskThreshold}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${riskThreshold}%, rgba(255,255,255,0.1) ${riskThreshold}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white/40 mt-2">
                <span>Safe (0)</span>
                <span>Critical (100)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-panel rounded-lg p-6 border-white/10 mb-6">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">notifications</span>
            Notifications
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div>
                <h3 className="font-bold mb-1">Security Alerts</h3>
                <p className="text-sm text-white/60">Get notified about security threats</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="glass-panel rounded-lg p-6 border-white/10 mb-6">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">language</span>
            Network
          </h2>

          <div className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Current Network</h3>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-bold">
                Connected
              </span>
            </div>
            <div className="text-sm text-white/60 space-y-1">
              <p>HashKey Chain Testnet</p>
              <p className="font-mono text-xs">Chain ID: 133</p>
              <p className="font-mono text-xs">RPC: https://testnet.hsk.xyz</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-panel rounded-lg p-6 border-white/10">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            About
          </h2>

          <div className="space-y-4 text-sm text-white/60">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Smart Contracts</span>
              <span className="text-white">Deployed</span>
            </div>
            <div className="flex justify-between">
              <span>AI Model</span>
              <span className="text-white">llama-3.3-70b-versatile</span>
            </div>
            <div className="flex justify-between">
              <span>Registry Contract</span>
              <span className="text-white font-mono text-xs">0x2CD7...8205</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => alert('Settings saved successfully!')}
            className="px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  )
}
