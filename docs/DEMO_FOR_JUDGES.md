# 🎯 Ghost Shell Demo Guide for Judges

## 🚀 Quick Setup (5 minutes)

### Step 1: Deploy Vulnerable Contract

```bash
# 1. Add your private key to contracts/.env
# Edit contracts/.env and replace YOUR_PRIVATE_KEY_HERE with your actual key

# 2. Deploy the contract
cd contracts
npx hardhat run scripts/deploy-vulnerable.ts --network hashkeyTestnet

# 3. Copy the contract address from the output
```

### Step 2: Make Sure Servers Are Running

```bash
# Backend (Terminal 1)
cd backend
npm run dev:server

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 🎬 Demo Script

### Part 1: Show Safe Transaction (Baseline)

**Say:** "First, let me show you a normal, safe transaction."

1. Open http://localhost:3000/send
2. Connect MetaMask
3. Enter your own wallet address as recipient
4. Amount: 0.001 HSK
5. Click "Send Transaction"

**Result:** 
- ✅ Risk modal shows LOW RISK (0-30)
- ✅ Contract Risk: 0 (it's a wallet, not a contract)
- ✅ Green indicators
- ✅ "Proceed Anyway" button available
- ✅ User can complete transaction

**Say:** "As you can see, for a normal wallet-to-wallet transfer, Ghost Shell shows low risk and allows the transaction to proceed."

---

### Part 2: Show Automatic Blocking (The Main Feature!)

**Say:** "Now, let me try sending to a malicious contract. This is a real contract I deployed that contains multiple critical vulnerabilities."

1. Clear the recipient field
2. Paste the vulnerable contract address (from deployment)
3. Amount: 0.001 HSK
4. Click "Send Transaction"

**Result:**
- 🔴 Risk modal shows CRITICAL RISK (90-100)
- 🔴 Contract Risk: 90-95
- 🔴 Red indicators everywhere
- 🔴 Lists 5 critical vulnerabilities:
  - Reentrancy
  - Missing Access Control
  - Dangerous Delegatecall
  - Unchecked External Calls
  - tx.origin Authentication
- 🚫 **"Transaction Blocked" button (NOT "Proceed Anyway")**
- 🚫 **User CANNOT proceed**

**Say:** "Ghost Shell detected 5 critical vulnerabilities in real-time and **automatically blocked** the transaction. Notice there's no 'Proceed Anyway' button - the user is completely protected. This happens before the transaction reaches the blockchain, preventing loss of funds."

---

### Part 3: Show the Details (Impress Them!)

**Scroll through the vulnerability list and say:**

"Let me show you what Ghost Shell detected:

1. **Reentrancy Vulnerability** - The contract makes external calls before updating state, allowing attackers to recursively drain funds.

2. **Missing Access Control** - Critical functions have no access control, meaning anyone can call them and drain the contract.

3. **Dangerous Delegatecall** - The contract allows arbitrary code execution through user-controlled delegatecall.

4. **Unchecked External Calls** - Return values aren't checked, leading to silent failures.

5. **tx.origin Authentication** - Uses tx.origin instead of msg.sender, vulnerable to phishing.

Each vulnerability includes:
- Severity level (Critical/High/Medium/Low)
- Detailed description
- Specific recommendations for fixing
- CWE (Common Weakness Enumeration) ID"

---

### Part 4: Highlight Key Differentiators

**Say:**

"What makes Ghost Shell unique:

1. **Real-Time Protection** - Analysis happens in under 1 second, before the transaction is broadcast.

2. **Automatic Blocking** - High-risk transactions are blocked automatically, not just warned about.

3. **AI-Powered** - Uses Groq's ultra-fast AI to explain vulnerabilities in plain language.

4. **On-Chain Transparency** - Security manifests are stored on HashKey Chain for verifiability.

5. **Native to HashKey** - Built specifically for HashKey Chain's ecosystem.

Traditional security tools only warn you AFTER you've lost funds. Ghost Shell prevents the loss BEFORE it happens."

---

## 🎯 Key Points to Emphasize

### 1. Real Blockchain Data
- "This is not a mock or simulation"
- "Real contract deployed on HashKey testnet"
- "Real vulnerability scanning"
- "Real automatic blocking"

### 2. Speed
- "Analysis completes in under 1 second"
- "Powered by Groq's ultra-fast AI inference"
- "No waiting, no delays"

### 3. Protection Level
- "Not just a warning - actual blocking"
- "User cannot override critical risks"
- "Funds are truly protected"

### 4. User Experience
- "Clean, visual risk indicators"
- "Plain language explanations"
- "No technical knowledge required"

### 5. HashKey Integration
- "Built for HashKey Chain"
- "Uses HashKey testnet RPC"
- "Optimized for HSK ecosystem"

---

## 📊 Expected Questions & Answers

### Q: "What if the user really wants to proceed?"
**A:** "For critical risks (>70), we block completely. For medium risks (31-70), users can proceed with full knowledge of the risks. This protects users from themselves while maintaining control for informed decisions."

### Q: "How accurate is the vulnerability detection?"
**A:** "We use bytecode analysis to detect known vulnerability patterns. The system detects 15+ vulnerability types including reentrancy, access control issues, and dangerous opcodes. Each detection includes the specific pattern found and recommendations."

### Q: "Does this work with any contract?"
**A:** "Yes! It works with any address on HashKey Chain - both verified and unverified contracts. For unverified contracts, we analyze the bytecode directly."

### Q: "What about false positives?"
**A:** "We use severity levels. Critical issues are well-established vulnerability patterns. Medium/Low issues may require context. The AI explanation helps users understand the specific risk."

### Q: "How does this compare to traditional audits?"
**A:** "Traditional audits are slow (weeks), expensive ($10k-$100k), and one-time. Ghost Shell provides instant, continuous protection for every transaction at zero cost."

---

## 🎬 Demo Flow Summary

```
1. Safe Transaction (30 seconds)
   ↓
   Shows: Low risk, green, can proceed
   
2. Malicious Contract (1 minute)
   ↓
   Shows: Critical risk, red, BLOCKED
   
3. Explain Vulnerabilities (1 minute)
   ↓
   Shows: Detailed list, severity, recommendations
   
4. Highlight Differentiators (1 minute)
   ↓
   Emphasize: Speed, blocking, AI, HashKey native

Total Demo Time: 3-4 minutes
```

---

## 🚨 Troubleshooting

### If the backend isn't responding:
```bash
cd backend
npm run dev:server
```

### If the frontend isn't loading:
```bash
cd frontend
npm run dev
```

### If MetaMask isn't connecting:
- Make sure you're on HashKey Testnet (Chain ID: 133)
- Add network manually if needed:
  - RPC: https://testnet.hsk.xyz
  - Chain ID: 133
  - Symbol: HSK

### If contract deployment fails:
- Check you have test HSK (get from faucet)
- Verify private key is in contracts/.env
- Make sure you're connected to HashKey testnet

---

## 🎉 You're Ready!

With this setup, you can demonstrate:
- ✅ Real vulnerability detection
- ✅ Automatic transaction blocking
- ✅ AI-powered explanations
- ✅ Real-time protection
- ✅ HashKey Chain integration

**Go impress those judges!** 🏆🛡️
