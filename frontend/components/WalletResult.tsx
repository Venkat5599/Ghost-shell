type WalletResultProps = {
  result: {
    walletAddress: string
    riskLevel: 'low' | 'medium' | 'high'
    riskScore: number
    factors: Array<{
      type: string
      severity: string
      description: string
      evidence: string[]
    }>
    transactionCount: number
    suspiciousInteractions: number
    aiSummary: string
    timestamp: string
  }
}

export default function WalletResult({ result }: WalletResultProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 border-green-400/30 bg-green-400/10'
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
      case 'high': return 'text-red-400 border-red-400/30 bg-red-400/10'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return '🟢'
      case 'medium': return '⚠️'
      case 'high': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-8 space-y-6">
      {/* Risk Score Header */}
      <div className={`rounded-2xl p-6 border ${getRiskColor(result.riskLevel)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl mb-2">{getRiskIcon(result.riskLevel)}</div>
            <h3 className="text-2xl font-bold uppercase">{result.riskLevel} Risk</h3>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{result.riskScore}</div>
            <div className="text-sm opacity-70">Risk Score</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <div className="text-3xl font-bold">{result.transactionCount}</div>
          <div className="text-sm text-gray-400 mt-1">Total Transactions</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-3xl font-bold text-red-400">{result.suspiciousInteractions}</div>
          <div className="text-sm text-gray-400 mt-1">Suspicious Interactions</div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="glass rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>🤖</span> AI Summary
        </h4>
        <p className="text-gray-300 leading-relaxed">{result.aiSummary}</p>
      </div>

      {/* Risk Factors */}
      {result.factors.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Risk Factors</h4>
          {result.factors.map((factor, idx) => (
            <div key={idx} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-semibold">{factor.description}</h5>
                <span className={`px-3 py-1 rounded-full text-xs uppercase ${
                  factor.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                  factor.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {factor.severity}
                </span>
              </div>
              <ul className="space-y-1">
                {factor.evidence.map((item, i) => (
                  <li key={i} className="text-sm text-gray-400">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
