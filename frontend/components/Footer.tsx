export default function Footer() {
  return (
    <footer className="mt-20 py-20 px-8 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div>
          <div className="font-headline text-3xl font-black italic tracking-tighter mb-4">
            GHOST SHELL
          </div>
          <p className="text-white/40 text-sm font-body">
            攻殻機動隊 • Protecting the HashKey Chain cyberspace.
          </p>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col gap-4">
            <h5 className="font-headline text-xs font-bold text-white tracking-widest uppercase">
              Protocol
            </h5>
            <a className="text-sm text-white/40 hover:text-white transition-colors" href="/scanner">
              Scanner
            </a>
            <a className="text-sm text-white/40 hover:text-white transition-colors" href="/live-shield">
              Shield
            </a>
            <a className="text-sm text-white/40 hover:text-white transition-colors" href="/asset-health">
              Analytics
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className="font-headline text-xs font-bold text-white tracking-widest uppercase">
              Ecosystem
            </h5>
            <a 
              className="text-sm text-white/40 hover:text-white transition-colors" 
              href="https://www.hashkey.com/en/hashkey-chain"
              target="_blank"
              rel="noopener noreferrer"
            >
              HashKey Chain
            </a>
            <a className="text-sm text-white/40 hover:text-white transition-colors" href="/docs">
              Partners
            </a>
            <a className="text-sm text-white/40 hover:text-white transition-colors" href="/audits">
              Audits
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className="font-headline text-xs font-bold text-white tracking-widest uppercase">
              Company
            </h5>
            <a className="text-sm text-white/40 hover:text-white transition-colors" href="/support">
              About
            </a>
            <a 
              className="text-sm text-white/40 hover:text-white transition-colors" 
              href="https://github.com/Venkat5599/Ghost-shell"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a 
              className="text-sm text-white/40 hover:text-white transition-colors" 
              href="https://x.com/Archuser__"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 flex justify-between items-center border-t border-white/5 pt-8">
        <span className="text-xs text-white/20">© 2024 GHOST SHELL. All rights secured.</span>
        <div className="flex gap-6 text-white/20 text-xs">
          <a className="hover:text-white transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-white transition-colors" href="#">
            Terms of Service
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </footer>
  )
}
