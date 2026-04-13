import type { VercelRequest, VercelResponse } from '@vercel/node';
import AnomalyDetector from '../src/services/AnomalyDetector';

const RPC_URL = process.env.HASHKEY_CHAIN_RPC_URL || 'https://testnet.hsk.xyz';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { txHash, contractAddress, walletAddress } = req.body;

    if (!txHash && !contractAddress && !walletAddress) {
      return res.status(400).json({ 
        error: 'Please provide txHash, contractAddress, or walletAddress' 
      });
    }

    const detector = new AnomalyDetector(RPC_URL);
    let alerts: any[] = [];

    // Analyze transaction
    if (txHash) {
      const txAlerts = await detector.analyzeTransaction(txHash);
      alerts = [...alerts, ...txAlerts];
    }

    // Monitor contract
    if (contractAddress) {
      const contractAlerts = await detector.monitorContract(contractAddress);
      alerts = [...alerts, ...contractAlerts];
    }

    // Analyze wallet
    if (walletAddress) {
      const walletAlerts = await detector.analyzeWalletBehavior(walletAddress);
      alerts = [...alerts, ...walletAlerts];
    }

    // Determine overall risk level
    const hasCritical = alerts.some(a => a.severity === 'critical');
    const hasHigh = alerts.some(a => a.severity === 'high');
    const hasMedium = alerts.some(a => a.severity === 'medium');

    const overallRisk = hasCritical ? 'critical' : 
                       hasHigh ? 'high' : 
                       hasMedium ? 'medium' : 'low';

    return res.status(200).json({
      success: true,
      overallRisk,
      alertCount: alerts.length,
      alerts,
      timestamp: new Date().toISOString(),
      message: alerts.length === 0 
        ? 'No anomalies detected' 
        : `${alerts.length} anomal${alerts.length === 1 ? 'y' : 'ies'} detected`
    });

  } catch (error) {
    console.error('Anomaly detection error:', error);
    return res.status(500).json({ 
      error: 'Failed to check for anomalies',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
