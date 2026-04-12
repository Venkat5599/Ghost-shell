type ScanResultProps = {
  result: {
    contractAddress: string
    riskScore: number
    status: 'safe' | 'warning' | 'critical'
    issues: Array<{
      type: string
      severity: string
      title: string
      description: string
      recommendation: string
    }>
    aiExplanation: string
    timestamp: string
  }
}

export default function ScanResult({ result }: ScanResultProps) {
  const getRiskColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400 border-green-400/30 bg-green-400/10'
      case 'warning': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
      case 'critical': return 'text-red-400 border-red-400/30 bg-red-400/10'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (status: string) => {
    switch (status) {
      case 'safe': return '🟢'
      case 'warning': return '⚠️'
      case 'critical': return '🔴'
      default: return '⚪'
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-8 space-y-6">
      {/* Risk Score Header */}
      <div className={`rounded-2xl p-6 border ${getRiskColor(result.status)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl mb-2">{getRiskIcon(result.status)}</div>
            <h3 className="text-2xl font-bold uppercase">{result.status}</h3>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{result.riskScore}</div>
            <div className="text-sm opacity-70">Risk Score</div>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="glass rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>🤖</span> AI Analysis
        </h4>
        <p className="text-gray-300 leading-relaxed">{result.aiExplanation}</p>
      </div>

      {/* Issues List */}
      {result.issues.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Detected Issues</h4>
          {result.issues.map((issue, idx) => (
            <div key={idx} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-semibold text-lg">{issue.title}</h5>
                <span className={`px-3 py-1 rounded-full text-xs uppercase ${
                  issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  issue.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {issue.severity}
                </span>
              </div>
              <p className="text-gray-400 mb-3">{issue.description}</p>
              <div className="glass rounded-xl p-4 bg-black/30">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Recommendation:</span> {issue.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Download Manifest */}
      <button className="w-full glass hover:bg-white/10 py-4 rounded-xl transition-all">
        📄 Download Assurance Manifest
      </button>
    </div>
  )
}
