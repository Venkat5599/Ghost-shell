import ContractScanner from '@/components/ContractScanner'

export default function ScannerPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-headline font-bold mb-4">
            Contract Scanner
          </h1>
          <p className="text-white/60 font-body text-lg">
            Analyze smart contracts for vulnerabilities and security risks
          </p>
        </div>
        
        <ContractScanner />
      </div>
    </main>
  )
}
