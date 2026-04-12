# Ghost Shell Contract Deployment Guide

## ✅ Compilation Complete!

Your contracts have been successfully compiled. Now let's deploy them!

## Deployment Options

### Option 1: Deploy to Local Hardhat Network (Testing)

**Step 1: Start local node**
```bash
npx hardhat node
```

**Step 2: Deploy (in new terminal)**
```bash
npm run deploy
```

This will deploy to your local Hardhat network for testing.

---

### Option 2: Deploy to HashKey Chain Testnet

**Step 1: Get Test Tokens**
- Go to HashKey Chain testnet faucet
- Get some test tokens for gas fees

**Step 2: Setup Environment**
```bash
cp .env.example .env
```

Edit `.env` and add:
```
PRIVATE_KEY=your_private_key_here
HASHKEY_TESTNET_RPC=https://hashkey-testnet-rpc-url
```

⚠️ **IMPORTANT**: Never commit your `.env` file!

**Step 3: Deploy**
```bash
npm run deploy:testnet
```

**Step 4: Save Contract Addresses**
After deployment, you'll see:
```
GhostShellRegistry: 0x...
SecureVault: 0x...
```

Save these addresses! You'll need them for:
- Backend configuration
- Frontend integration
- Authorizing auditors

---

### Option 3: Deploy to HashKey Chain Mainnet

⚠️ **WARNING**: Only deploy to mainnet when you're ready for production!

**Step 1: Get Real Tokens**
- You'll need real HSK tokens for gas fees

**Step 2: Setup Environment**
```bash
# Edit .env
PRIVATE_KEY=your_mainnet_private_key
HASHKEY_MAINNET_RPC=https://hashkey-mainnet-rpc-url
```

**Step 3: Deploy**
```bash
npx hardhat run scripts/deploy.ts --network hashkeyMainnet
```

---

## After Deployment

### 1. Verify Contracts (Optional but Recommended)

```bash
npx hardhat verify --network hashkeyTestnet REGISTRY_ADDRESS
npx hardhat verify --network hashkeyTestnet VAULT_ADDRESS REGISTRY_ADDRESS
```

### 2. Authorize Backend as Auditor

You need to authorize your backend wallet to register security manifests.

**Using Hardhat Console:**
```bash
npx hardhat console --network hashkeyTestnet
```

Then run:
```javascript
const registry = await ethers.getContractAt("GhostShellRegistry", "YOUR_REGISTRY_ADDRESS")
await registry.authorizeAuditor("YOUR_BACKEND_WALLET_ADDRESS")
```

**Or create a script:**
```typescript
// scripts/authorize.ts
import { ethers } from "hardhat";

async function main() {
  const registryAddress = "YOUR_REGISTRY_ADDRESS";
  const backendAddress = "YOUR_BACKEND_WALLET_ADDRESS";
  
  const registry = await ethers.getContractAt("GhostShellRegistry", registryAddress);
  const tx = await registry.authorizeAuditor(backendAddress);
  await tx.wait();
  
  console.log("✅ Backend authorized as auditor!");
}

main();
```

Run it:
```bash
npx hardhat run scripts/authorize.ts --network hashkeyTestnet
```

### 3. Update Backend Configuration

Edit `backend/.env`:
```
REGISTRY_ADDRESS=0x...  # Your deployed registry address
HASHKEY_CHAIN_RPC_URL=https://...
HASHKEY_CHAIN_ID=177
```

### 4. Update Frontend Configuration

The frontend will automatically use the backend API, which connects to the registry.

---

## Testing Your Deployment

### Test 1: Check Registry Owner
```bash
npx hardhat console --network hashkeyTestnet
```

```javascript
const registry = await ethers.getContractAt("GhostShellRegistry", "REGISTRY_ADDRESS")
const owner = await registry.owner()
console.log("Owner:", owner)
```

### Test 2: Register a Test Manifest
```javascript
const manifestId = "test-001"
const contractAddress = "0x1234567890123456789012345678901234567890"
const riskScore = 50
const riskLevel = 1 // WARNING
const ipfsHash = "QmTest123"

const tx = await registry.registerManifest(
  manifestId,
  contractAddress,
  riskScore,
  riskLevel,
  ipfsHash
)
await tx.wait()
console.log("✅ Manifest registered!")
```

### Test 3: Query Manifest
```javascript
const manifest = await registry.getManifest(contractAddress)
console.log("Manifest:", manifest)
```

---

## Troubleshooting

**Error: "insufficient funds"**
- You need test tokens from the faucet
- Check your wallet balance

**Error: "nonce too high"**
- Reset your account in MetaMask
- Or wait a few minutes and try again

**Error: "network not found"**
- Check your RPC URL in hardhat.config.ts
- Make sure the network name matches

**Error: "Not authorized auditor"**
- Run the authorize script first
- Make sure you're using the owner wallet

---

## Next Steps

After successful deployment:

1. ✅ Deploy backend to Vercel
2. ✅ Configure backend with registry address
3. ✅ Authorize backend wallet
4. ✅ Deploy frontend to Vercel
5. ✅ Test the full flow!

See [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) for complete integration instructions.

---

## Contract Addresses (Save These!)

**Testnet:**
- GhostShellRegistry: `0x...` (fill after deployment)
- SecureVault: `0x...` (fill after deployment)

**Mainnet:**
- GhostShellRegistry: `0x...` (fill after deployment)
- SecureVault: `0x...` (fill after deployment)

---

## Security Checklist

Before mainnet deployment:

- [ ] Contracts audited by professional auditor
- [ ] All tests passing
- [ ] Environment variables secured
- [ ] Private keys stored safely (use hardware wallet!)
- [ ] Backup deployment account
- [ ] Test on testnet first
- [ ] Verify contracts on block explorer
- [ ] Document all contract addresses
- [ ] Setup monitoring and alerts

---

## Support

Need help? Check:
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [HashKey Chain Docs](https://docs.hashkey.com)

Good luck with your deployment! 🚀
