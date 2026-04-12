'use client'

import { useState } from 'react'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, send to backend
    console.log('Support request:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-headline font-bold mb-4 flex items-center justify-center gap-4">
            <span className="material-symbols-outlined text-6xl text-blue-500">support_agent</span>
            Support Center
          </h1>
          <p className="text-white/60 font-body text-lg">
            Get help with Ghost Shell security platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Quick Help Cards */}
          <div className="glass-panel rounded-lg p-6 border-white/10 hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-blue-500">book</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-2">Documentation</h3>
            <p className="text-white/60 text-sm mb-4">
              Comprehensive guides and API references
            </p>
            <a
              href="/docs"
              className="text-blue-400 text-sm font-label hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              Read Docs
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="glass-panel rounded-lg p-6 border-white/10 hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-green-500">forum</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-2">Community</h3>
            <p className="text-white/60 text-sm mb-4">
              Join our Discord for community support
            </p>
            <a
              href="https://discord.gg/ghostshell"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 text-sm font-label hover:text-green-300 transition-colors flex items-center gap-1"
            >
              Join Discord
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>

          <div className="glass-panel rounded-lg p-6 border-white/10 hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-purple-500">code</span>
            </div>
            <h3 className="font-headline font-bold text-lg mb-2">GitHub</h3>
            <p className="text-white/60 text-sm mb-4">
              Report bugs and contribute to the project
            </p>
            <a
              href="https://github.com/ghostshell/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 text-sm font-label hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              View on GitHub
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-panel rounded-lg p-8 border-white/10 mb-8">
          <h2 className="text-2xl font-headline font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="font-headline font-bold">How does AI transaction protection work?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="p-4 text-white/60 text-sm">
                Ghost Shell analyzes every transaction before execution using AI models trained on 10,000+ known exploits. 
                If a transaction is flagged as high-risk, it's blocked immediately before your assets leave your wallet.
              </div>
            </details>

            <details className="group">
              <summary className="cursor-pointer p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="font-headline font-bold">What networks are supported?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="p-4 text-white/60 text-sm">
                Currently, Ghost Shell supports HashKey Chain Testnet (Chain ID: 133) and HashKey Chain Mainnet (Chain ID: 177). 
                More networks will be added based on community demand.
              </div>
            </details>

            <details className="group">
              <summary className="cursor-pointer p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="font-headline font-bold">Is my wallet data stored?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="p-4 text-white/60 text-sm">
                No. Ghost Shell never stores your private keys or wallet data. All analysis is performed in real-time, 
                and only scan results are temporarily cached for performance.
              </div>
            </details>

            <details className="group">
              <summary className="cursor-pointer p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between">
                <span className="font-headline font-bold">How much does it cost?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="p-4 text-white/60 text-sm">
                Ghost Shell is currently free to use during the beta period. Future pricing will be announced, 
                but basic security features will always remain free for the community.
              </div>
            </details>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel rounded-lg p-8 border-white/10">
          <h2 className="text-2xl font-headline font-bold mb-6">Contact Support</h2>
          
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">Message Sent!</h3>
              <p className="text-white/60">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label text-xs text-white/40 mb-2">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs text-white/40 mb-2">EMAIL</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-xs text-white/40 mb-2">SUBJECT</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block font-label text-xs text-white/40 mb-2">MESSAGE</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/20 focus:outline-none resize-none"
                  placeholder="Describe your issue or question..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-4 rounded-full font-headline font-bold text-lg hover:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
