# Ghost Shell Backend - 攻殻機動隊

AI-powered DeFi security backend for HashKey Chain.

## Deployment Options

### Option 1: Vercel Serverless (Recommended - FREE!)
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
```bash
vercel
```

### Option 2: Local Development
```bash
npm install
cp .env.example .env
# Add your Groq API key
npm run dev
```

## Features

- 🔍 Smart Contract Vulnerability Scanner
- 👛 Wallet Risk Analyzer
- 🤖 Groq AI-Powered Explanations
- ⚡ Ultra-fast serverless functions
- 🛡️ Pre-transaction risk checks

## API Endpoints

### Contract Scanner
```
POST /api/scan-contract
Body: { "contractAddress": "0x..." }
```

### Wallet Analyzer
```
POST /api/analyze-wallet
Body: { "walletAddress": "0x..." }
```

### Pre-Transaction Risk Check
```
POST /api/risk-check
Body: {
  "contractAddress": "0x...",
  "walletAddress": "0x..."
}
```

### Health Check
```
GET /api/health
```

## Architecture

**Serverless Functions:**
- Each API endpoint is a separate serverless function
- Auto-scales based on demand
- No server management needed
- FREE on Vercel (up to 100GB-hours/month)

**Services:**
- **ContractScanner**: Detects vulnerabilities in smart contracts
- **WalletAnalyzer**: Analyzes wallet transaction patterns
- **AIExplanationService**: Generates human-readable explanations via Groq
- **RiskAggregator**: Combines contract and wallet risks

## Tech Stack

- Node.js + TypeScript
- Vercel Serverless Functions
- ethers.js (blockchain interaction)
- Groq SDK (AI explanations)
- Zod (validation)

## Environment Variables

Required:
- `GROQ_API_KEY` - Your Groq API key

Optional:
- `HASHKEY_CHAIN_RPC_URL` - HashKey Chain RPC endpoint
- `HASHKEY_CHAIN_ID` - Chain ID (default: 177)

## Cost

**FREE TIER:**
- Vercel: FREE (100GB-hours/month)
- Groq API: FREE tier available
- **Total: $0/month** 🎉

