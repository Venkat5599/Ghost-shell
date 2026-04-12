# 🧪 Ghost Shell - Testnet Testing Guide

## ✅ Current Status

### Backend Server
- **Status**: ✅ Running
- **URL**: http://localhost:3001
- **API**: http://localhost:3001/api

### Frontend Server
- **Status**: ✅ Running
- **URL**: http://localhost:3002

### Smart Contracts
- **Network**: HashKey Chain Testnet (Chain ID: 133)
- **Registry**: `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
- **Vault**: `0x6483d00d9E5Ff9cCE4e2b549d78A0B8885E5d1c3`

---

## 🧪 Testing Checklist

### 1. Backend API Tests ✅

All backend services tested and working:
- ✅ Contract Scanner
- ✅ Wallet Analyzer
- ✅ Risk Aggregator
- ✅ AI Service (Groq)

### 2. Frontend Tests (In Progress)

Open http://localhost:3002 and test:

#### Test 1: UI Loading
- [ ] Page loads without errors
- [ ] Ghost Shell branding visible (攻殻機動隊)
- [ ] Glassmorphism styling applied
- [ ] Sidebar appears on hover
- [ ] Navigation tabs work

#### Test 2: Contract Scanner
- [ ] Navigate to "Contract Scanner" tab
- [ ] Enter contract address: `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
- [ ] Click "Scan Contract"
- [ ] Results display correctly
- [ ] Risk score shows
- [ ] Issues list appears
- [ ] AI explanation loads

#### Test 3: Wallet Analyzer
- [ ] Navigate to "Wallet Analyzer" tab
- [ ] Enter wallet address: `0x1E0048D83ba01D823dc852cfabeb94fC76B089B7`
- [ ] Click "Analyze Wallet"
- [ ] Risk score displays
- [ ] Transaction count shows
- [ ] Risk factors listed
- [ ] AI summary appears

#### Test 4: Risk Check Modal
- [ ] Click "Check Risk" button
- [ ] Modal opens
- [ ] Enter contract address
- [ ] Enter wallet address
- [ ] Click "Check Risk"
- [ ] Overall risk score displays
- [ ] Recommendations show
- [ ] Warnings listed

### 3. Smart Contract Integration Tests

#### Test 1: Check Registry Owner
```bash
cd contracts
npx hardhat console --network hashkeyTestnet
```

```javascript
const registry = await ethers.getContractAt("GhostShellRegistry", "0x2CD70324C4043D90f3C45D6ac7E84aB828708205")
await registry.owner()
// Should return: 0x1E0048D83ba01D823dc852cfabeb94fC76B089B7
```

#### Test 2: Authorize Backend Wallet
```javascript
// First, get your backend wallet address
const backendWallet = "YOUR_BACKEND_WALLET_ADDRESS"

// Authorize it
await registry.authorizeAuditor(backendWallet)

// Verify
await registry.isAuthorizedAuditor(backendWallet)
// Should return: true
```

#### Test 3: Register Test Manifest
```javascript
await registry.registerManifest(
  "0x2CD70324C4043D90f3C45D6ac7E84aB828708205",
  "ipfs://test-manifest-hash",
  85,
  "Test security manifest"
)

// Verify
const manifest = await registry.getManifest("0x2CD70324C4043D90f3C45D6ac7E84aB828708205")
console.log(manifest)
```

---

## 🔧 Manual API Testing

### Test Health Endpoint
```bash
curl http://localhost:3001/api/health
```

Expected:
```json
{
  "status": "ok",
  "service": "Ghost Shell Security Protocol",
  "version": "1.0.0",
  "timestamp": "2026-04-12T..."
}
```

### Test Contract Scanner
```bash
curl -X POST http://localhost:3001/api/scan-contract \
  -H "Content-Type: application/json" \
  -d "{\"contractAddress\":\"0x2CD70324C4043D90f3C45D6ac7E84aB828708205\"}"
```

Expected:
```json
{
  "success": true,
  "data": {
    "contractAddress": "0x2CD70324C4043D90f3C45D6ac7E84aB828708205",
    "riskScore": 60,
    "issues": [...],
    "aiExplanation": "..."
  }
}
```

### Test Wallet Analyzer
```bash
curl -X POST http://localhost:3001/api/analyze-wallet \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\":\"0x1E0048D83ba01D823dc852cfabeb94fC76B089B7\"}"
```

### Test Risk Check
```bash
curl -X POST http://localhost:3001/api/risk-check \
  -H "Content-Type: application/json" \
  -d "{\"contractAddress\":\"0x2CD70324C4043D90f3C45D6ac7E84aB828708205\",\"walletAddress\":\"0x1E0048D83ba01D823dc852cfabeb94fC76B089B7\"}"
```

---

## 🌐 Browser Testing

### Open Frontend
1. Open browser: http://localhost:3002
2. Open DevTools (F12)
3. Check Console for errors
4. Check Network tab for API calls

### Test Flow
1. **Home Page**
   - Verify UI loads
   - Check styling
   - Test sidebar hover

2. **Contract Scanner**
   - Enter: `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
   - Click "Scan"
   - Wait for results
   - Verify data displays

3. **Wallet Analyzer**
   - Enter: `0x1E0048D83ba01D823dc852cfabeb94fC76B089B7`
   - Click "Analyze"
   - Check results

4. **Risk Modal**
   - Click "Check Risk"
   - Fill both addresses
   - Submit
   - Review recommendations

---

## 🐛 Common Issues & Fixes

### Backend Issues

**"Cannot connect to backend"**
- Check backend is running: http://localhost:3001/api/health
- Verify .env file has correct values
- Check GROQ_API_KEY is valid

**"Groq API error"**
- Model updated to `llama-3.3-70b-versatile`
- Check API key is valid
- Monitor rate limits

**"RPC error"**
- Verify HashKey testnet RPC: https://testnet.hsk.xyz
- Check network connectivity
- Try alternative RPC if needed

### Frontend Issues

**"Failed to fetch"**
- Check .env.local has: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- Verify backend is running
- Check CORS headers

**"Styles not loading"**
- Clear browser cache
- Check Tailwind config
- Verify globals.css imported

**"Port already in use"**
- Frontend auto-switches to 3002 if 3001 is taken
- Update .env.local if needed

### Contract Issues

**"Insufficient funds"**
- Get test HSK from faucet
- Check wallet balance

**"Not authorized"**
- Run authorization script
- Verify with `isAuthorizedAuditor()`

---

## 📊 Test Results Template

```
═══════════════════════════════════════════════════
🧪 Ghost Shell - Testnet Test Results
═══════════════════════════════════════════════════

Date: _______________
Tester: _______________

Backend Tests:
[ ] Health endpoint working
[ ] Contract scanner working
[ ] Wallet analyzer working
[ ] Risk check working
[ ] AI explanations generating

Frontend Tests:
[ ] UI loads correctly
[ ] Contract scanner UI works
[ ] Wallet analyzer UI works
[ ] Risk modal works
[ ] API integration working

Contract Tests:
[ ] Registry deployed
[ ] Can authorize auditors
[ ] Can register manifests
[ ] Can retrieve manifests

Integration Tests:
[ ] Frontend → Backend → Contracts
[ ] End-to-end scan flow
[ ] End-to-end analysis flow
[ ] End-to-end risk check

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: [ ] PASS  [ ] FAIL
═══════════════════════════════════════════════════
```

---

## 🎯 Success Criteria

Your testnet testing is complete when:

- ✅ All backend API endpoints return 200
- ✅ Frontend loads without console errors
- ✅ Can scan contracts and see results
- ✅ Can analyze wallets and see risk scores
- ✅ Risk check modal works end-to-end
- ✅ AI explanations generate successfully
- ✅ Smart contracts respond correctly
- ✅ Can authorize auditors on-chain
- ✅ Can register and retrieve manifests

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Stop local servers**
   ```bash
   # Stop backend (Ctrl+C in terminal)
   # Stop frontend (Ctrl+C in terminal)
   ```

2. **Deploy to Vercel**
   - Backend: `cd backend && vercel --prod`
   - Frontend: `cd frontend && vercel --prod`

3. **Update environment variables**
   - Add production URLs
   - Update API endpoints

4. **Test production deployment**
   - Verify all features work
   - Check performance
   - Monitor logs

5. **Go live!**
   - Share with users
   - Monitor usage
   - Collect feedback

---

## 📞 Support

If you encounter issues:
- Check console logs
- Review network tab
- Verify environment variables
- Test API endpoints individually
- Check smart contract state

---

**Current Status**: Backend ✅ | Frontend ✅ | Contracts ✅
**Next**: Complete browser testing and integration tests
