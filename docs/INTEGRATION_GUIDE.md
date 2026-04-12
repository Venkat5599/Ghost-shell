# Ghost Shell Integration Guide - 攻殻機動隊

Complete guide to integrating Ghost Shell security into your DeFi application.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Your DApp Frontend                     │
│              (React, Next.js, Vue, etc.)                  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Ghost Shell Backend (Vercel)                 │
│  - Contract Scanner                                       │
│  - Wallet Analyzer                                        │
│  - AI Explanations (Groq)                                 │
│  - Risk Aggregator                                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ registerManifest()
                     ▼
┌──────────────────────────────────────────────────────────┐
│         GhostShellRegistry (On-Chain)                     │
│  - Stores security manifests                              │
│  - Provides safety checks                                 │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ ghostShellProtected()
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Your Smart Contract                          │
│  + GhostShellGuard                                        │
│  - Automatic pre-transaction checks                       │
└──────────────────────────────────────────────────────────┘
```

## Step 1: Deploy Smart Contracts

### 1.1 Install Dependencies
```bash
cd contracts
npm install
```

### 1.2 Configure Environment
```bash
cp .env.example .env
# Add your private key and RPC URLs
```

### 1.3 Deploy to HashKey Chain
```bash
npm run deploy:testnet
```

Save the deployed addresses:
- `GhostShellRegistry`: 0x...
- `SecureVault`: 0x...

## Step 2: Deploy Backend (Vercel)

### 2.1 Deploy to Vercel
```bash
cd backend
vercel
```

### 2.2 Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
GROQ_API_KEY=your_groq_api_key
HASHKEY_CHAIN_RPC_URL=https://hashkey-rpc.example.com
HASHKEY_CHAIN_ID=177
```

### 2.3 Get Backend URL
After deployment: `https://your-backend.vercel.app`

## Step 3: Authorize Backend as Auditor

Connect to your deployed registry and authorize the backend:

```typescript
import { ethers } from "ethers";

const registry = await ethers.getContractAt(
  "GhostShellRegistry",
  "YOUR_REGISTRY_ADDRESS"
);

// Authorize backend to register manifests
await registry.authorizeAuditor("YOUR_BACKEND_WALLET_ADDRESS");
```

## Step 4: Deploy Frontend

### 4.1 Configure API URL
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

### 4.2 Deploy to Vercel
```bash
vercel
```

## Step 5: Integrate in Your DApp

### 5.1 Install Ghost Shell SDK (Optional)
```bash
npm install @ghost-shell/sdk
```

### 5.2 Add Pre-Transaction Checks

```typescript
import { checkRisk } from './lib/api'

async function handleTransaction(contractAddress: string, walletAddress: string) {
  // Check risk before transaction
  const risk = await checkRisk(contractAddress, walletAddress)
  
  if (risk.overallRiskLevel === 'critical') {
    alert('⚠️ CRITICAL RISK: Transaction blocked for your safety')
    return
  }
  
  if (risk.overallRiskLevel === 'warning') {
    const proceed = confirm(`⚠️ WARNING: ${risk.reasoning}\n\nProceed anyway?`)
    if (!proceed) return
  }
  
  // Execute transaction
  await executeTransaction()
}
```

### 5.3 Display Security Badges

```tsx
import { useState, useEffect } from 'react'

function SecurityBadge({ contractAddress }: { contractAddress: string }) {
  const [risk, setRisk] = useState(null)
  
  useEffect(() => {
    fetch(`${API_URL}/scan-contract`, {
      method: 'POST',
      body: JSON.stringify({ contractAddress })
    })
      .then(res => res.json())
      .then(data => setRisk(data.data))
  }, [contractAddress])
  
  if (!risk) return null
  
  return (
    <div className={`badge ${risk.status}`}>
      {risk.status === 'safe' && '🟢 SAFE'}
      {risk.status === 'warning' && '⚠️ WARNING'}
      {risk.status === 'critical' && '🔴 CRITICAL'}
      <span>Risk Score: {risk.riskScore}</span>
    </div>
  )
}
```

## Step 6: Integrate in Your Smart Contracts

### 6.1 Inherit GhostShellGuard

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ghost-shell/contracts/GhostShellGuard.sol";

contract MyDeFiProtocol is GhostShellGuard {
    constructor(address _registry) GhostShellGuard(_registry) {}
    
    // Add protection to external interactions
    function swapTokens(address tokenIn, address tokenOut, uint256 amount) 
        external 
        ghostShellProtected(tokenIn)  // Check tokenIn safety
        ghostShellProtected(tokenOut) // Check tokenOut safety
    {
        // Your swap logic here
    }
    
    function addLiquidity(address pool, uint256 amount) 
        external 
        ghostShellProtected(pool) // Check pool safety
    {
        // Your liquidity logic here
    }
}
```

### 6.2 Deploy Your Contract

```typescript
const MyProtocol = await ethers.getContractFactory("MyDeFiProtocol");
const protocol = await MyProtocol.deploy(REGISTRY_ADDRESS);
```

## Step 7: Backend Integration (Register Manifests)

### 7.1 Add Manifest Registration

```typescript
import { ethers } from 'ethers'

async function registerManifestOnChain(scanResult: ScanResult) {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  
  const registry = new ethers.Contract(
    REGISTRY_ADDRESS,
    REGISTRY_ABI,
    wallet
  )
  
  // Upload full manifest to IPFS
  const ipfsHash = await uploadToIPFS(scanResult.manifest)
  
  // Register on-chain
  const tx = await registry.registerManifest(
    scanResult.manifest.manifestId,
    scanResult.contractAddress,
    scanResult.riskScore,
    getRiskLevelEnum(scanResult.status),
    ipfsHash
  )
  
  await tx.wait()
  console.log('Manifest registered on-chain:', tx.hash)
}

function getRiskLevelEnum(status: string): number {
  switch (status) {
    case 'safe': return 0
    case 'warning': return 1
    case 'critical': return 2
    default: return 1
  }
}
```

## Step 8: Testing

### 8.1 Test Contract Scanner
```bash
curl -X POST https://your-backend.vercel.app/api/scan-contract \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"0x..."}'
```

### 8.2 Test Wallet Analyzer
```bash
curl -X POST https://your-backend.vercel.app/api/analyze-wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x..."}'
```

### 8.3 Test Risk Check
```bash
curl -X POST https://your-backend.vercel.app/api/risk-check \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress":"0x...",
    "walletAddress":"0x..."
  }'
```

### 8.4 Test Smart Contract Protection
```typescript
// This should succeed (safe contract)
await myProtocol.swapTokens(safeToken, otherToken, amount)

// This should revert (critical risk contract)
await myProtocol.swapTokens(riskyToken, otherToken, amount)
// Error: "Ghost Shell: CRITICAL RISK - Transaction blocked"
```

## Step 9: Monitor & Maintain

### 9.1 Monitor Backend
- Check Vercel logs for errors
- Monitor Groq API usage
- Track scan success rates

### 9.2 Update Manifests
- Re-scan contracts periodically
- Invalidate incorrect manifests
- Update risk scores as needed

### 9.3 Manage Auditors
```typescript
// Add new auditor
await registry.authorizeAuditor(newAuditorAddress)

// Remove auditor
await registry.revokeAuditor(oldAuditorAddress)
```

## Common Integration Patterns

### Pattern 1: Pre-Transaction Modal
Show risk check before every transaction:
```typescript
const RiskCheckModal = ({ onProceed, onCancel }) => {
  const [risk, setRisk] = useState(null)
  
  useEffect(() => {
    checkRisk(contractAddress, walletAddress)
      .then(setRisk)
  }, [])
  
  if (risk?.overallRiskLevel === 'critical') {
    return <BlockedModal risk={risk} onClose={onCancel} />
  }
  
  return <WarningModal risk={risk} onProceed={onProceed} onCancel={onCancel} />
}
```

### Pattern 2: Security Badge Display
Show security status on every contract:
```tsx
<ContractCard>
  <SecurityBadge address={contract.address} />
  <ContractInfo {...contract} />
</ContractCard>
```

### Pattern 3: Automatic Blocking
Block risky interactions at contract level:
```solidity
function interact(address target) 
    external 
    ghostShellProtected(target) // Automatic check!
{
    // Your logic
}
```

## Troubleshooting

**Backend not scanning?**
- Check Groq API key is set
- Verify RPC URL is correct
- Check Vercel logs

**Contract reverts with "Not authorized auditor"?**
- Run `registry.authorizeAuditor(backendAddress)`
- Verify backend wallet has funds

**Frontend can't connect?**
- Check `NEXT_PUBLIC_API_URL` is set
- Verify CORS is enabled
- Check network connectivity

## Support

- Documentation: https://docs.ghost-shell.io
- GitHub: https://github.com/ghost-shell
- Discord: https://discord.gg/ghost-shell

## License

MIT
