<p align="center"><img src="https://img.shields.io/badge/🛡️-Ghost_Shell_攻殻機動隊-00D4FF?style=for-the-badge&labelColor=0a0f12" alt="Ghost Shell" /></p>

<h1 align="center">Ghost Shell (攻殻機動隊)</h1>

<p align="center"><strong>AI-Powered DeFi Security Guard Platform on HashKey Chain</strong></p>

<p align="center">
<a href="https://testnet-explorer.hsk.xyz/address/0x2CD70324C4043D90f3C45D6ac7E84aB828708205"><img src="https://img.shields.io/badge/🔴_LIVE-HashKey_Testnet-00D4FF?style=for-the-badge" alt="Live on HashKey" /></a>
<a href="https://testnet-explorer.hsk.xyz/address/0x2CD70324C4043D90f3C45D6ac7E84aB828708205"><img src="https://img.shields.io/badge/✅_VERIFIED-Smart_Contracts-00FF88?style=for-the-badge" alt="Verified" /></a>
<img src="https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity" alt="Solidity" />
</p>

---

## 📋 Project Overview

**Ghost Shell** is an AI-powered security platform that protects DeFi users from malicious contracts, risky wallets, and dangerous transactions on HashKey Chain by Ghost in the Shell (攻殻機動隊), it acts as your personal Section 9 security team.

### What It Does

- **Scans smart contracts** - Detects reentrancy, access control flaws, delegatecall risks
- **Analyzes wallets** - Identifies suspicious transaction patterns and risky interactions
- **Blocks dangerous transactions** - AI-powered pre-transaction protection
- **Provides real-time insights** - Live threat monitoring and asset health tracking
- **Creates audit trail** - On-chain security manifests for transparency

### Key Innovation

Unlike traditional security tools that only warn after the fact, Ghost Shell **prevents** malicious transactions before they execute. Our AI analyzes every transaction in real-time and blocks it if dangerous - protecting your assets proactively.

```
Traditional Security:  User → Transaction → Exploit → Loss
With Ghost Shell:      User → AI Check → Block → Assets Safe
```

---

## 🌐 Why This Matters for HashKey Chain

### The DeFi Security Problem

DeFi users lose billions annually to:
- Malicious smart contracts (rug pulls, honeypots)
- Compromised wallets and phishing attacks
- Unaudited protocols with hidden vulnerabilities
- **Users have no protection layer between them and danger**

### What We Bring to HashKey Chain

| Benefit | Impact |
|---------|--------|
| **Protects Users** | AI-powered transaction blocking prevents losses before they happen |
| **Builds Trust** | Users feel safe interacting with DeFi on HashKey Chain |
| **Increases Adoption** | Security = confidence = more users joining the ecosystem |
| **Native Integration** | Built specifically for HashKey Chain, optimized for HSK |

### Market Need

- DeFi users need protection from malicious contracts
- Wallet users need pre-transaction risk assessment
- Developers need security audit infrastructure
- **All of these need real-time AI analysis that can't be bypassed**

---

## 🚀 Deployment Information

### Live Contracts on HashKey Testnet

| Contract | Address | Explorer |
|----------|---------|----------|
| **GhostShellRegistry** | `0x2CD70324C4043D90f3C45D6ac7E84aB828708205` | [✅ View Code](https://testnet-explorer.hsk.xyz/address/0x2CD70324C4043D90f3C45D6ac7E84aB828708205) |
| **SecureVault** | `0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3` | [✅ View Code](https://testnet-explorer.hsk.xyz/address/0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3) |

### Network Details

```
Network:     HashKey Chain Testnet
Chain ID:    133
RPC URL:     https://testnet.hsk.xyz
Explorer:    https://testnet-explorer.hsk.xyz
Currency:    HSK (test HSK)
Faucet:      https://testnet-explorer.hsk.xyz/faucet
```

### Deploy Your Own

```bash
# 1. Clone the repository
git clone https://github.com/Venkat5599/Ghost-shell.git
cd Ghost-shell

# 2. Install dependencies
npm install
cd contracts && npm install
cd ../backend && npm install
cd ../frontend && npm install

# 3. Configure environment
cp contracts/.env.example contracts/.env
# Edit contracts/.env with your private key

# 4. Deploy to HashKey Testnet
cd contracts
npx hardhat run scripts/deploy.ts --network hashkeyTestnet

# 5. Deploy backend to Vercel
cd ../backend
vercel

# 6. Deploy frontend to Vercel
cd ../frontend
vercel
```

---

## 📖 How to Use the Platform

### Option 1: Web Interface (Easiest)

1. **Visit the platform** (after deployment)
2. **Connect MetaMask** to HashKey Chain Testnet
3. **Scan a contract** - Paste address, get instant security report
4. **Analyze a wallet** - Check any wallet's risk score
5. **Send transactions** - AI automatically protects you

### Option 2: Direct Contract Interaction

#### Register Security Manifest

```solidity
// Solidity - Call from your contract
interface IGhostShellRegistry {
    function registerManifest(
        address contractAddress,
        string memory manifestHash,
        uint8 riskScore,
        string memory summary
    ) external;
}

IGhostShellRegistry registry = IGhostShellRegistry(
    0x2CD70324C4043D90f3C45D6ac7E84aB828708205
);

registry.registerManifest(
    0xYourContract,
    "ipfs://QmHash...",
    25, // Low risk
    "Audited by Ghost Shell"
);
```

#### Query Security Manifest

```solidity
(
    string memory manifestHash,
    uint8 riskScore,
    string memory summary,
    address auditor,
    uint256 timestamp,
    bool exists
) = registry.getManifest(contractAddress);

require(exists, "No security audit found");
require(riskScore < 50, "Risk too high");
```

### Option 3: API Integration

```typescript
import axios from 'axios';

// Scan contract for vulnerabilities
const scanResult = await axios.post('https://your-backend.vercel.app/api/scan-contract', {
  contractAddress: '0x2CD70324C4043D90f3C45D6ac7E84aB828708205'
});

console.log(scanResult.data);
// {
//   riskScore: 15,
//   vulnerabilities: [...],
//   aiExplanation: "This contract appears safe...",
//   recommendation: "SAFE"
// }

// Analyze wallet risk
const walletResult = await axios.post('https://your-backend.vercel.app/api/analyze-wallet', {
  walletAddress: '0xYourWallet...'
});

// Check transaction before sending
const riskCheck = await axios.post('https://your-backend.vercel.app/api/risk-check', {
  from: '0xYourWallet...',
  to: '0xRecipient...',
  value: '1000000000000000000' // 1 HSK in wei
});

if (riskCheck.data.riskLevel === 'CRITICAL') {
  console.log('⛔ Transaction blocked:', riskCheck.data.reason);
} else {
  // Proceed with transaction
}
```

### Contract Functions Reference

| Function | Description | Access |
|----------|-------------|--------|
| `registerManifest(address, string, uint8, string)` | Register security audit | Authorized auditors |
| `getManifest(address)` | Get security manifest | Anyone (view) |
| `isAuthorizedAuditor(address)` | Check auditor status | Anyone (view) |
| `authorizeAuditor(address)` | Add authorized auditor | Owner only |
| `revokeAuditor(address)` | Remove auditor | Owner only |

---

## 🛡️ Security Features

### Contract Scanner

Detects 15+ vulnerability types:

| Vulnerability | Detection Method | Risk Level |
|---------------|------------------|------------|
| Reentrancy | Bytecode pattern analysis | CRITICAL |
| Access Control | Function modifier check | HIGH |
| Delegatecall | Opcode detection | CRITICAL |
| Selfdestruct | Opcode detection | HIGH |
| Unprotected Functions | Modifier analysis | MEDIUM |
| Integer Overflow | Solidity version check | LOW (0.8+) |

### Wallet Analyzer

Analyzes wallet behavior:

- Transaction frequency patterns
- Interaction with known malicious contracts
- Balance verification
- Historical risk assessment
- AI-generated risk summary

### Transaction Protection

Real-time blocking system:

```
User initiates transaction
         ↓
Ghost Shell intercepts
         ↓
AI analyzes in <1 second
         ↓
┌────────┴────────┐
│                 │
SAFE            RISKY
│                 │
Execute         Block/Warn
```

Protection levels:
- **SAFE** (0-30): Transaction proceeds automatically
- **WARNING** (31-70): User confirmation required
- **CRITICAL** (71-100): Transaction blocked, manual override available

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER/DAPP                                   │
│                    (Web Interface or Direct Integration)                │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14)                            │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  Contract   │  │   Wallet    │  │    Send     │  │    Risk     │   │
│  │   Scanner   │  │  Analyzer   │  │     TRX     │  │    Modal    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                  │                                      │
└──────────────────────────────────┼──────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Vercel Serverless)                           │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │ Contract Scanner │  │ Wallet Analyzer  │  │  Risk Aggregator │     │
│  │  - Bytecode      │  │  - Transactions  │  │  - Combine data  │     │
│  │  - Opcodes       │  │  - Patterns      │  │  - Calculate     │     │
│  │  - Patterns      │  │  - Balance       │  │  - Generate      │     │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘     │
│           │                     │                     │                │
│           └─────────────────────┴─────────────────────┘                │
│                                  │                                      │
│                                  ▼                                      │
│                     ┌─────────────────────────┐                        │
│                     │   AI Explanation        │                        │
│                     │   (Groq - Llama 3.3)    │                        │
│                     │   - Risk assessment     │                        │
│                     │   - Attack scenarios    │                        │
│                     │   - Recommendations     │                        │
│                     └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SMART CONTRACTS (Solidity)                            │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │              GhostShellRegistry                               │      │
│  │              0x2CD70324C4043D90f3C45D6ac7E84aB828708205       │      │
│  │                                                               │      │
│  │  - registerManifest()  → Store security audits               │      │
│  │  - getManifest()       → Retrieve audit data                 │      │
│  │  - authorizeAuditor()  → Manage auditors                     │      │
│  │  - Events: ManifestRegistered, AuditorAuthorized             │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │              SecureVault (Example)                            │      │
│  │              0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3       │      │
│  │                                                               │      │
│  │  - Uses GhostShellGuard modifier                             │      │
│  │  - Demonstrates integration pattern                          │      │
│  │  - Production-ready example                                  │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      HASHKEY CHAIN TESTNET                               │
│                                                                          │
│  Chain ID: 133                                                           │
│  RPC: https://testnet.hsk.xyz                                            │
│  Explorer: https://testnet-explorer.hsk.xyz                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Ghost-shell/
├── frontend/              # Next.js 14 web application
│   ├── app/              # App router pages
│   │   ├── page.tsx      # Dashboard
│   │   ├── scanner/      # Contract scanner
│   │   ├── vault/        # Secure vault
│   │   ├── send/         # Send transactions
│   │   ├── audits/       # Audit history
│   │   ├── support/      # Support page
│   │   └── docs/         # Documentation
│   ├── components/       # React components
│   │   ├── ContractScanner.tsx
│   │   ├── WalletAnalyzer.tsx
│   │   ├── RiskCheckModal.tsx
│   │   ├── WalletConnect.tsx
│   │   └── PlumBackground.tsx
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client
│   │   ├── web3.ts       # Web3 utilities
│   │   └── transactionGuard.ts
│   └── hooks/            # Custom hooks
│
├── backend/              # Vercel serverless functions
│   ├── api/              # API endpoints
│   │   ├── health.ts
│   │   ├── scan-contract.ts
│   │   ├── analyze-wallet.ts
│   │   └── risk-check.ts
│   └── src/
│       ├── services/     # Business logic
│       │   ├── ContractScanner.ts
│       │   ├── WalletAnalyzer.ts
│       │   ├── AIExplanationService.ts
│       │   ├── RiskAggregator.ts
│       │   └── CacheService.ts
│       └── types/        # TypeScript types
│
├── contracts/            # Smart contracts
│   ├── contracts/
│   │   ├── GhostShellRegistry.sol
│   │   ├── GhostShellGuard.sol
│   │   └── SecureVault.sol
│   ├── scripts/          # Deployment scripts
│   │   ├── deploy.ts
│   │   ├── authorize-backend.ts
│   │   └── test-manifest.ts
│   └── test/             # Contract tests
│
└── docs/                 # Documentation
    ├── README.md
    ├── QUICK_REFERENCE.md
    ├── INTEGRATION_GUIDE.md
    ├── DEPLOYMENT_COMPLETE.md
    └── TRANSACTION_PROTECTION.md
```

---

## 📚 Documentation

- [Quick Reference](./docs/QUICK_REFERENCE.md) - Commands and addresses
- [Integration Guide](./docs/INTEGRATION_GUIDE.md) - How to integrate
- [Transaction Protection](./docs/TRANSACTION_PROTECTION.md) - Protection system
- [Real Data Implementation](./docs/REAL_DATA_IMPLEMENTATION.md) - No mock data
- [Testnet Testing Guide](./docs/TESTNET_TESTING_GUIDE.md) - Testing guide
- [Deployment Complete](./docs/DEPLOYMENT_COMPLETE.md) - Deployment status

---

## 🧪 Testing

### Run Contract Tests

```bash
cd contracts
npx hardhat test
```

Expected output:
```
  GhostShellRegistry
    ✓ Should deploy with correct owner
    ✓ Should register manifest
    ✓ Should authorize auditor
    ✓ Should get manifest
    ... (13 tests total)

  13 passing (2s)
```

### Test Backend Locally

```bash
cd backend
npm run dev:server

# In another terminal
curl http://localhost:3001/api/health
```

### Test Frontend Locally

```bash
cd frontend
npm run dev

# Open http://localhost:3002
# Connect wallet and test features
```

### Integration Testing

```bash
# Test contract scanning
curl -X POST http://localhost:3001/api/scan-contract \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"0x2CD70324C4043D90f3C45D6ac7E84aB828708205"}'

# Test wallet analysis
curl -X POST http://localhost:3001/api/analyze-wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0xYourWallet..."}'
```

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Registry Contract** | [View on Explorer](https://testnet-explorer.hsk.xyz/address/0x2CD70324C4043D90f3C45D6ac7E84aB828708205) |
| **Vault Contract** | [View on Explorer](https://testnet-explorer.hsk.xyz/address/0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3) |
| **HashKey Testnet** | [Network Info](https://testnet.hsk.xyz) |
| **HashKey Explorer** | [Block Explorer](https://testnet-explorer.hsk.xyz) |
| **HashKey Faucet** | [Get Test HSK](https://testnet-explorer.hsk.xyz/faucet) |
| **Groq AI** | [AI Platform](https://groq.com) |

---

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity 0.8.20, Hardhat, OpenZeppelin
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, ethers.js v6
- **Backend:** Vercel Serverless, TypeScript, ethers.js v6
- **AI:** Groq (llama-3.3-70b-versatile)
- **Blockchain:** HashKey Chain Testnet (EVM-compatible)
- **Design:** Glassmorphism, Anime-inspired (Ghost in the Shell)

---

## 💰 Cost Breakdown

```
┌──────────────────────┬──────────────┬─────────────────────┐
│ Service              │ Cost/Month   │ Tier                │
├──────────────────────┼──────────────┼─────────────────────┤
│ Smart Contracts      │ $0           │ Testnet             │
│ Backend (Vercel)     │ $0           │ Free (100GB-hours)  │
│ Frontend (Vercel)    │ $0           │ Free (100GB)        │
│ Groq AI              │ $0           │ Free Tier           │
│ HashKey Testnet      │ $0           │ Free                │
├──────────────────────┼──────────────┼─────────────────────┤
│ TOTAL                │ $0/month     │ 🎉 COMPLETELY FREE! │
└──────────────────────┴──────────────┴─────────────────────┘
```

---

## 📈 Roadmap

- [x] Core contracts deployed & verified
- [x] Contract scanner with AI analysis
- [x] Wallet analyzer with risk scoring
- [x] Transaction protection system
- [x] Frontend dashboard with glassmorphism UI
- [x] Backend API with Vercel serverless
- [x] Real blockchain data (no mocks)
- [x] Documentation complete
- [ ] Security audit
- [ ] Mainnet deployment
- [ ] Multi-chain support
- [ ] Mobile app
- [ ] Browser extension

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by **Ghost in the Shell (攻殻機動隊)** - Section 9 Security
- Built for **HashKey Chain** ecosystem
- Powered by **Groq AI** (llama-3.3-70b-versatile)
- UI design inspired by **glassmorphism** and **cyberpunk aesthetics**
- Special thanks to the **HashKey Chain** team for testnet support

---

## 📞 Support

Need help? We're here for you:

- **Documentation:** [/docs](./docs)
- **Issues:** [GitHub Issues](https://github.com/Venkat5599/Ghost-shell/issues)
- **Email:** support@ghostshell.io
- **Twitter:** [@GhostShellSec](https://twitter.com/GhostShellSec)

---

<div align="center">

## Built for HashKey Chain Ecosystem 🏆

**Protecting DeFi Users with AI-Powered Security**

*Making Web3 safer, one transaction at a time*

---

**⭐ Star this repo if you find it useful!**

[⬆ Back to Top](#ghost-shell-攻殻機動隊)

</div>
