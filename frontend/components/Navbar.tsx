'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import WalletConnect from './WalletConnect'

export default function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
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
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-white/70 cursor-pointer hover:text-white transition-colors">
            notifications
          </span>
          <span className="material-symbols-outlined text-white/70 cursor-pointer hover:text-white transition-colors">
            security
          </span>
        </div>
        <WalletConnect />
      </div>
    </nav>
  )
}
