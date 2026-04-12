'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import WalletConnect from './WalletConnect'

export default function Navbar() {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showShield, setShowShield] = useState(false)
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  // Mock notifications
  const notifications = [
    { id: 1, type: 'warning', message: 'High risk transaction detected', time: '2 min ago' },
    { id: 2, type: 'success', message: 'Contract scan completed', time: '5 min ago' },
    { id: 3, type: 'info', message: 'New security update available', time: '1 hour ago' },
  ]

  // Shield status
  const shieldStatus = {
    active: true,
    protectionLevel: 'Maximum',
    threatsBlocked: 12,
    lastScan: '2 minutes ago'
  }

  return (
    <nav className="flex justify-between items-center px-8 h-20 w-full fixed top-0 z-50 bg-black/60 backdrop-blur-lg shadow-[0_1px_rgba(255,255,255,0.05)] shadow-2xl shadow-purple-500/10">
      <Link href="/" className="text-2xl font-bold tracking-tighter text-white italic font-headline hover:text-white/80 transition-colors">
        GHOST SHELL
      </Link>
      
      <div className="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm font-medium">
        <Link 
          href="/" 
          className={`${isActive('/') && pathname === '/' ? 'text-white border-b-2 border-white pb-1' : 'text-white/50 hover:text-white/80'} transition-all duration-300`}
        >
          Dashboard
        </Link>
        <Link 
          href="/send" 
          className={`${isActive('/send') ? 'text-white border-b-2 border-white pb-1' : 'text-white/50 hover:text-white/80'} transition-all duration-300 flex items-center gap-1`}
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          Send TRX
        </Link>
        <Link 
          href="/scanner" 
          className={`${isActive('/scanner') ? 'text-white border-b-2 border-white pb-1' : 'text-white/50 hover:text-white/80'} transition-all duration-300`}
        >
          Scanner
        </Link>
        <Link 
          href="/vault" 
          className={`${isActive('/vault') ? 'text-white border-b-2 border-white pb-1' : 'text-white/50 hover:text-white/80'} transition-all duration-300`}
        >
          Vault
        </Link>
        <Link 
          href="/audits" 
          className={`${isActive('/audits') ? 'text-white border-b-2 border-white pb-1' : 'text-white/50 hover:text-white/80'} transition-all duration-300`}
        >
          Audits
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4 relative">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowShield(false)
              }}
              className="relative"
            >
              <span className="material-symbols-outlined text-white/70 cursor-pointer hover:text-white transition-colors">
                notifications
              </span>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 glass-panel rounded-lg p-4 border-white/10 shadow-2xl z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`material-symbols-outlined text-sm ${
                          notif.type === 'warning' ? 'text-yellow-500' :
                          notif.type === 'success' ? 'text-green-500' :
                          'text-blue-500'
                        }`}>
                          {notif.type === 'warning' ? 'warning' :
                           notif.type === 'success' ? 'check_circle' :
                           'info'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-white/90">{notif.message}</p>
                          <p className="text-xs text-white/40 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 py-2 text-xs text-white/60 hover:text-white transition-colors">
                  View All Notifications
                </button>
              </div>
            )}
          </div>

          {/* Shield Status */}
          <div className="relative">
            <button
              onClick={() => {
                setShowShield(!showShield)
                setShowNotifications(false)
              }}
              className="relative"
            >
              <span className={`material-symbols-outlined cursor-pointer transition-colors ${
                shieldStatus.active ? 'text-green-500' : 'text-white/70'
              }`}>
                security
              </span>
            </button>

            {showShield && (
              <div className="absolute right-0 top-12 w-72 glass-panel rounded-lg p-4 border-white/10 shadow-2xl z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold">Shield Status</h3>
                  <button
                    onClick={() => setShowShield(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                    <span className="text-sm text-white/70">Status</span>
                    <span className="text-sm font-bold text-green-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-white/70">Protection Level</span>
                    <span className="text-sm font-bold text-white">{shieldStatus.protectionLevel}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-white/70">Threats Blocked</span>
                    <span className="text-sm font-bold text-white">{shieldStatus.threatsBlocked}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-white/70">Last Scan</span>
                    <span className="text-sm font-bold text-white/60">{shieldStatus.lastScan}</span>
                  </div>

                  <Link
                    href="/live-shield"
                    className="w-full block text-center py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                    onClick={() => setShowShield(false)}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <WalletConnect />
      </div>
    </nav>
  )
}
