# 🎉 Ghost Shell - Deployment Status

## ✅ Smart Contracts Deployed

**Network**: HashKey Chain Testnet (Chain ID: 133)
**Deployer**: 0x1E0048D83ba01D823dc852cfabeb94fC76B089B7
**Date**: Deployed Successfully

### Contract Addresses

```
GhostShellRegistry: 0x2CD70324C4043D90f3C45D6ac7E84aB828708205
SecureVault: 0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3
```

### Block Explorer Links

- **Registry**: https://testnet-explorer.hsk.xyz/address/0x2CD70324C4043D90f3C45D6ac7E84aB828708205
- **Vault**: https://testnet-explorer.hsk.xyz/address/0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3

---

## 📋 Next Steps

### 1. Authorize Backend Wallet ⏳

You need to authorize your backend wallet address as an auditor so it can register security manifests.

**Get your backend wallet address:**
- Create a new wallet for the backend (or use existing)
- Copy the address

**Authorize it:**
```bash
cd contracts
# Edit scripts/authorize-auditor.ts with:
# - REGISTRY_ADDRESS: 0x2CD70324C4043D90f3C45D6ac7E84aB828708205
# - BACKEND_WALLET: your_backend_wallet_address
npx hardhat run scripts/authorize-auditor.ts --network hashkeyTestnet
```

### 2. Deploy Backend to Vercel ⏳

```bash
cd backend
vercel
```

**Add these environment variables in Vercel Dashboard:**
```
GROQ_API_KEY=your_groq_api_key
REGISTRY_ADDRESS=0x2CD70324C4043D90f3C45D6ac7E84aB828708205
HASHKEY_CHAIN_RPC_URL=https://testnet.hsk.xyz
BACKEND_PRIVATE_KEY=your_backend_wallet_private_key
```

### 3. Deploy Frontend to Vercel ⏳

```bash
cd frontend
# Create .env.local
echo "NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api" > .env.local
vercel
```

### 4. Test Everything ⏳

1. Open frontend URL
2. Scan a contract
3. Analyze a wallet
4. Check risk modal
5. Verify manifests on-chain

---

## 🔗 Important Links

### Testnet Resources
- **Faucet**: Get test HSK tokens
- **Explorer**: https://testnet-explorer.hsk.xyz
- **RPC**: https://testnet.hsk.xyz
- **Chain ID**: 133

### Your Contracts
- **Registry**: 0x2CD70324C4043D90f3C45D6ac7E84aB828708205
- **Vault Example**: 0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3

---

## 💡 Quick Commands

### Check Registry Owner
```bash
npx hardhat console --network hashkeyTestnet
```
```javascript
const registry = await ethers.getContractAt("GhostShellRegistry", "0x2CD70324C4043D90f3C45D6ac7E84aB828708205")
await registry.owner()
```

### Authorize Auditor
```javascript
await registry.authorizeAuditor("BACKEND_WALLET_ADDRESS")
```

### Check if Authorized
```javascript
await registry.isAuthorizedAuditor("BACKEND_WALLET_ADDRESS")
```

### Register Test Manifest
```javascript
await registry.registerManifest(
  "0xTEST_CONTRACT_ADDRESS",
  "ipfs://test-hash",
  85,
  "Test manifest"
)
```

---

## ✅ Deployment Checklist

- [x] Contracts compiled
- [x] Tests passing (13/13)
- [x] Deployed to HashKey Testnet
- [x] Contract addresses saved
- [ ] Backend wallet authorized
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Full integration tested

---

**Status**: Contracts deployed! Ready for backend deployment.
**Next**: Authorize backend wallet and deploy services.
