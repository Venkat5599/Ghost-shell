# 🧪 How to Test Ghost Shell Transaction Protection

## 🚀 Quick Start

Both servers are already running:
- ✅ Backend: http://localhost:3001
- ✅ Frontend: http://localhost:3000

## 📋 Test Scenarios

### Scenario 1: Send to Your Own Wallet (Low Risk)

**Steps:**
1. Open http://localhost:3000/send in your browser
2. Connect MetaMask to HashKey Testnet (Chain ID: 133)
3. In the "Recipient Address" field, paste your own wallet address
4. Enter amount: `0.001` HSK
5. Click "Send Transaction"

**What You'll See:**
```
┌─────────────────────────────────────────────┐
│  🛡️ Ghost Shell Protection                 │
│  Pre-Transaction Risk Check                 │
├─────────────────────────────────────────────┤
│                                             │
│  RISK LEVEL              0/100              │
│  SAFE                                       │
│                                             │
│  ┌──────────────┬──────────────┐           │
│  │ CONTRACT     │ WALLET       │           │
│  │ RISK         │ RISK         │           │
│  │ 0/100 🟢     │ 5/100 🟢     │           │
│  └──────────────┴──────────────┘           │
│                                             │
│  ℹ️ This is a regular wallet address       │
│     (EOA), not a smart contract.           │
│     No contract vulnerabilities to scan.   │
│                                             │
│  💡 Low risk detected. Transaction         │
│     appears safe to proceed.               │
│                                             │
│  [Proceed Anyway]  [Cancel]                │
└─────────────────────────────────────────────┘
```

**Result:** ✅ You can proceed with the transaction

---

### Scenario 2: Send to GhostShellRegistry Contract (Warning Risk)

**Steps:**
1. Open http://localhost:3000/send
2. Connect MetaMask
3. In "Recipient Address", paste: `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
4. Enter amount: `0.001` HSK
5. Click "Send Transaction"

**What You'll See:**
```
┌─────────────────────────────────────────────┐
│  🛡️ Ghost Shell Protection                 │
│  Pre-Transaction Risk Check                 │
├─────────────────────────────────────────────┤
│                                             │
│  RISK LEVEL              49/100             │
│  WARNING                                    │
│                                             │
│  ┌──────────────┬──────────────┐           │
│  │ CONTRACT     │ WALLET       │           │
│  │ RISK         │ RISK         │           │
│  │ 70/100 🟡    │ 1/100 🟢     │           │
│  └──────────────┴──────────────┘           │
│                                             │
│  ⚠️ Warnings                                │
│  • High contract risk detected (70/100)    │
│  • 🔴 Reentrancy Vulnerability Detected    │
│  • 🔴 Dangerous Delegatecall               │
│                                             │
│  🐛 Detected Vulnerabilities                │
│                                             │
│  [CRITICAL] Reentrancy Vulnerability       │
│  The contract may be vulnerable to         │
│  reentrancy attacks. External calls are    │
│  made before state updates.                │
│  💡 Use the checks-effects-interactions    │
│     pattern or implement ReentrancyGuard   │
│                                             │
│  [MEDIUM] Unchecked External Call          │
│  External calls are made without checking  │
│  return values.                            │
│  💡 Always check return values of external │
│     calls or use SafeERC20.                │
│                                             │
│  [CRITICAL] Dangerous Delegatecall         │
│  Delegatecall is used with user-controlled │
│  addresses.                                │
│  💡 Avoid delegatecall to untrusted        │
│     contracts or implement strict          │
│     whitelisting.                          │
│                                             │
│  💡 Moderate risk detected. Review the     │
│     security findings carefully before     │
│     proceeding.                            │
│                                             │
│  [Proceed Anyway]  [Cancel]                │
└─────────────────────────────────────────────┘
```

**Result:** ⚠️ Warning shown, but you can still proceed if you choose

---

### Scenario 3: High-Risk Contract (Blocked)

**To simulate a blocked transaction:**
- The system blocks when:
  - Overall Risk > 70/100
  - OR Contract Risk > 80/100

**What You'll See:**
```
┌─────────────────────────────────────────────┐
│  🛡️ Ghost Shell Protection                 │
│  Pre-Transaction Risk Check                 │
├─────────────────────────────────────────────┤
│                                             │
│  RISK LEVEL              85/100             │
│  CRITICAL                                   │
│                                             │
│  ┌──────────────┬──────────────┐           │
│  │ CONTRACT     │ WALLET       │           │
│  │ RISK         │ RISK         │           │
│  │ 90/100 🔴    │ 25/100 🟢    │           │
│  └──────────────┴──────────────┘           │
│                                             │
│  ⚠️ Warnings                                │
│  • High contract risk detected (90/100)    │
│  • 🔴 Multiple critical vulnerabilities    │
│                                             │
│  🐛 Detected Vulnerabilities                │
│  [List of vulnerabilities...]              │
│                                             │
│  💡 Critical vulnerabilities detected in   │
│     the target contract. Do not proceed    │
│     with this transaction.                 │
│                                             │
│  [🚫 Transaction Blocked]                  │
│                                             │
│  🚫 This transaction has been              │
│     automatically blocked due to critical  │
│     security risks. Ghost Shell has        │
│     prevented potential loss of funds.     │
└─────────────────────────────────────────────┘
```

**Result:** 🚫 Transaction is BLOCKED - cannot proceed

---

## 🎯 What Each Risk Level Means

### 🟢 SAFE (0-30)
- Low or no vulnerabilities detected
- Transaction can proceed
- Minimal warnings

### 🟡 WARNING (31-70)
- Moderate vulnerabilities detected
- User can proceed with caution
- Detailed warnings shown
- "Proceed Anyway" button available

### 🔴 CRITICAL (71-100)
- Severe vulnerabilities detected
- Transaction is BLOCKED
- No "Proceed Anyway" button
- User must cancel

## 🔧 Toggle Protection

You can enable/disable the protection:

1. Look for the "AI Transaction Protection" card on the Send page
2. Click the "ENABLED" / "DISABLED" button to toggle
3. When disabled:
   - Transactions proceed without checks
   - No risk modal shown
   - Not recommended!

## 📊 Understanding the Risk Breakdown

### Contract Risk (70% weight)
- Scans smart contract bytecode
- Detects vulnerabilities:
  - Reentrancy
  - Access control issues
  - Unchecked calls
  - Dangerous delegatecall
  - And more...

### Wallet Risk (30% weight)
- Analyzes transaction history
- Checks for:
  - High-frequency trading
  - Bot activity
  - Empty active wallets
  - New wallets with limited history

### Overall Risk
```
Overall = (Contract Risk × 0.7) + (Wallet Risk × 0.3)
```

## 🎨 Visual Indicators

- 🟢 **Green** = Safe (0-30)
- 🟡 **Yellow** = Warning (31-70)
- 🔴 **Red** = Critical (71-100)

## 💡 Tips

1. **Always review the vulnerabilities** - Even if you can proceed, read what was detected
2. **Check the contract risk** - This is the most important indicator
3. **Verify the recipient** - Make sure you're sending to the right address
4. **Start with small amounts** - Test with minimal HSK first

## 🐛 Troubleshooting

### "Unable to perform risk check"
- ✅ **FIXED!** This error should no longer appear
- If you still see it, check that both servers are running

### Backend not responding
```bash
# Check backend status
curl http://localhost:3001/api/health

# Restart backend if needed
cd backend
npm run dev:server
```

### Frontend not loading
```bash
# Restart frontend
cd frontend
npm run dev
```

## 🎉 You're Ready!

The transaction protection system is now fully operational. Try sending transactions to different addresses and see the protection in action!

**Remember:** Ghost Shell is protecting you from malicious contracts and risky transactions automatically! 🛡️
