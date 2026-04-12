'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [showQuickScan, setShowQuickScan] = useState(false)
  
  const isActive = (path: string) => pathname === path

  const handleQuickScan = () => {
    setShowQuickScan(true)
    // Redirect to scanner after a moment
    setTimeout(() => {
      window.location.href = '/scanner'
    }, 500)
  }

  return (
    <>
      {/* Sidebar Hint - Pulsing indicator */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden xl:block group-hover:opacity-0 transition-opacity pointer-events-none">
        <div className="relative">
          {/* Pulsing circles */}
          <div className="absolute w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute w-3 h-3 bg-white/50 rounded-full"></div>
          {/* Arrow hint */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-r-lg border-l-2 border-white/50">
            <span className="text-white/70 text-xs font-label">Hover here</span>
            <span className="text-white/70">→</span>
          </div>
        </div>
      </div>

      <aside className="group fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] flex-col py-8 z-40 bg-black/40 backdrop-blur-2xl rounded-r-xl my-4 bg-white/5 shadow-[40px_0_40px_rgba(195,192,255,0.05)] hidden xl:flex -translate-x-[calc(100%-1rem)] hover:translate-x-4 transition-transform duration-300 ease-in-out">
        <div className="px-8 mb-10">
          <h3 className="text-xl font-black text-white font-headline">Section 9 Node</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-label">
            公安9課 • HashKey Chain: Active
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={`${
              isActive('/') 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-white/40 hover:text-white'
            } rounded-full mx-4 py-3 px-6 flex items-center gap-4 transition-all duration-300 hover:translate-x-2`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : "'FILL' 0" }}>
              grid_view
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest font-bold">Overview</span>
          </Link>
          
          <Link
            href="/live-shield"
            className={`${
              isActive('/live-shield') 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-white/40 hover:text-white'
            } rounded-full mx-4 py-3 px-6 flex items-center gap-4 transition-all duration-300 hover:translate-x-2`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/live-shield') ? "'FILL' 1" : "'FILL' 0" }}>
              shield
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest">Live Shield</span>
          </Link>
          
          <Link
            href="/asset-health"
            className={`${
              isActive('/asset-health') 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-white/40 hover:text-white'
            } rounded-full mx-4 py-3 px-6 flex items-center gap-4 transition-all duration-300 hover:translate-x-2`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/asset-health') ? "'FILL' 1" : "'FILL' 0" }}>
              monitor_heart
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest">Asset Health</span>
          </Link>
          
          <Link
            href="/risk-map"
            className={`${
              isActive('/risk-map') 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-white/40 hover:text-white'
            } rounded-full mx-4 py-3 px-6 flex items-center gap-4 transition-all duration-300 hover:translate-x-2`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/risk-map') ? "'FILL' 1" : "'FILL' 0" }}>
              map
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest">Risk Map</span>
          </Link>
          
          <button
            onClick={() => alert('Settings coming soon!')}
            className="text-white/40 hover:text-white mx-4 py-3 px-6 flex items-center gap-4 hover:translate-x-2 transition-all duration-300 text-left"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label text-[10px] uppercase tracking-widest">Settings</span>
          </button>
        </nav>

        <div className="mt-auto px-8 pt-8 border-t border-white/5">
          <button 
            onClick={handleQuickScan}
            className="w-full bg-secondary-container/30 text-secondary border border-secondary/30 py-3 rounded-xl font-label text-[10px] uppercase tracking-widest font-bold mb-6 hover:bg-secondary-container/50 transition-colors"
          >
            {showQuickScan ? 'Loading...' : 'Quick Scan'}
          </button>
          <div className="flex flex-col gap-4">
            <Link
              href="/support"
              className="flex items-center gap-3 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span className="font-label text-[10px] uppercase tracking-widest">Support</span>
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-3 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span className="font-label text-[10px] uppercase tracking-widest">Documentation</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
