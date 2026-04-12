# 🚀 Ghost Shell - Quick Reference Card

## 📍 Deployed Contract Addresses

```
GhostShellRegistry: 0x2CD70324C4043D90f3C45D6ac7E84aB828708205
SecureVault:        0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3
```

**Network**: HashKey Chain Testnet (Chain ID: 133)
**Explorer**: https://testnet-explorer.hsk.xyz

---

## ⚡ Quick Commands

### Authorize Backend Wallet
```bash
cd contracts
npx hardhat console --network hashkeyTestnet
```
```javascript
const registry = await ethers.getContractAt("GhostShellRegistry", "0x2CD70324C4043D90f3C45D6ac7E84aB828708205")
await registry.authorizeAuditor("YOUR_BACKEND_WALLET")
```

### Deploy Backend
```bash
cd backend
vercel
# Add env vars in dashboard
vercel --prod
```

### Deploy Frontend
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api" > .env.local
vercel --prod
```

### Test Backend
```bash
curl https://your-backend.vercel.app/api/health
```

---

## 🔑 Environment Variables

### Backend (Vercel Dashboard)
```
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
HASHKEY_CHAIN_RPC_URL=https://testnet.hsk.xyz
HASHKEY_CHAIN_ID=133
REGISTRY_ADDRESS=0x2CD70324C4043D90f3C45D6ac7E84aB828708205
BACKEND_PRIVATE_KEY=your_backend_wallet_private_key
```

### Frontend (Vercel Dashboard)
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

---

## 📋 Deployment Checklist

- [x] Contracts deployed
- [ ] Backend wallet authorized
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Full integration tested

---

## 🔗 Important Links

- **Testnet Faucet**: Get test HSK tokens
- **Explorer**: https://testnet-explorer.hsk.xyz
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Groq Console**: https://console.groq.com

---

## 📚 Documentation

- `FINAL_DEPLOYMENT_CHECKLIST.md` - Complete deployment guide
- `contracts/DEPLOYMENT_STATUS.md` - Contract deployment details
- `backend/VERCEL_DEPLOY.md` - Backend deployment guide
- `frontend/VERCEL_DEPLOY.md` - Frontend deployment guide

---

**Next Step**: Authorize backend wallet and deploy services!
