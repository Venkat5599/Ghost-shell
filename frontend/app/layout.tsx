import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PlumBackground from '@/components/PlumBackground'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'GHOST SHELL - 攻殻機動隊 Security Protocol',
  description: 'Real-time security layer for DeFi applications on HashKey Chain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased selection:bg-secondary selection:text-black overflow-x-hidden">
        <PlumBackground />
        <Navbar />
        <Sidebar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
