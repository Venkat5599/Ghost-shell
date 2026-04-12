# 🛡️ Ghost Shell - Transaction Protection System

## ✅ Pre-Transaction Risk Prevention

Ghost Shell now includes **real-time transaction interception** and risk checking BEFORE transactions are executed!

---

## 🎯 How It Works

### 1. Transaction Interception
When a user tries to send a transaction:
```
User clicks "Deposit" or "Withdraw"
         ↓
Ghost Shell intercepts transaction
         ↓
Performs real-time risk check
         ↓
Shows risk modal to user
         ↓
User decides: Proceed or Cancel
         ↓
Transaction executes (if allowed)
```

### 2. Risk Assessment
```typescript
// Checks performed:
✅ Contract vulnerability scan
✅ Wallet risk analysis  
✅ Combined risk calculation
✅ AI-powered recommendations
✅ Real-time blockchain data
```

### 3. User Decision
- **Safe (0-40)**: Transaction proceeds automatically
- **Warning (41-70)**: Shows modal, user can proceed
- **Critical (71-100)**: Transaction blocked or strong warning

---

## 🔧 Implementation

### Transaction Guard Service
Located in: `frontend/lib/transactionGuard.ts`

```typescript
// Check transaction risk
const result = await transactionGuard.checkTransaction({
  to: contractAddress,
  from: userAddress,
  value: amount,
  data: calldata
})

// Show modal if risky
if (result.riskLevel !== 'safe') {
  const allowed = await transactionGuard.showRiskModal(result)
  if (!allowed) {
    // Transaction cancelled
    return
  }
}

// Proceed with transaction
await signer.sendTransaction(tx)
```

### React Hook
Located in: `frontend/hooks/useTransactionGuard.ts`

```typescript
const { isEnabled, guardTransaction, toggleGuard } = useTransactionGuard()

// Guard a transaction
const allowed = await guardTransaction(tx)
if (allowed) {
  // Send transaction
}
```

---

## 🎨 Risk Modal UI

The modal shows:
- **Risk Score**: 0-100 with color coding
- **Risk Level**: Safe / Warning / Critical
- **Warnings**: List of detected issues
- **Recommendation**: AI-generated advice
- **Actions**: Proceed or Cancel buttons

**Color Coding:**
- 🟢 Green (0-40): Safe
- 🟡 Yellow (41-70): Warning
- 🔴 Red (71-100): Critical

---

## 💡 Usage Examples

### Example 1: Vault Deposit
```typescript
// User enters amount and clicks deposit
const handleDeposit = async () => {
  const tx = {
    to: vaultAddress,
    from: userAddress,
    value: depositAmount
  }
  
  // Ghost Shell checks the transaction
  const allowed = await guardTransaction(tx)
  
  if (allowed) {
    // User approved, send transaction
    await signer.sendTransaction(tx)
  } else {
    // User cancelled or blocked
    alert('Transaction cancelled')
  }
}
```

### Example 2: Token Transfer
```typescript
const handleTransfer = async () => {
  const tx = {
    to: tokenAddress,
    from: userAddress,
    data: transferCalldata
  }
  
  // Automatic risk check
  const allowed = await guardTransaction(tx)
  
  if (allowed) {
    await contract.transfer(recipient, amount)
  }
}
```

---

## 🧪 Testing the Protection

### Test 1: Safe Transaction
1. Go to Vault page
2. Enter small amount (e.g., 0.01 HSK)
3. Click "Deposit"
4. Should proceed with minimal warning

### Test 2: Risky Transaction
1. Try to interact with a flagged contract
2. Ghost Shell shows risk modal
3. See warnings and risk score
4. Choose to proceed or cancel

### Test 3: Critical Transaction
1. Try to interact with high-risk contract
2. Transaction blocked or strong warning
3. User must explicitly override

---

## 🎯 Features

### ✅ Real-Time Protection
- Checks every transaction before execution
- No transactions bypass the guard
- Instant risk assessment

### ✅ Smart Risk Calculation
- Contract vulnerability score (70% weight)
- Wallet risk score (30% weight)
- Combined risk assessment
- AI-powered analysis

### ✅ User Control
- Can enable/disable protection
- Can override warnings (except critical)
- Clear risk information
- Informed decision making

### ✅ Beautiful UI
- Glassmorphism modal
- Color-coded risk levels
- Clear warnings and recommendations
- Smooth animations

---

## 🔐 Security Levels

### Level 1: Automatic (Safe)
- Risk Score: 0-40
- Action: Proceed automatically
- No modal shown
- Fast user experience

### Level 2: Warning (Caution)
- Risk Score: 41-70
- Action: Show modal
- User can proceed or cancel
- Informed decision

### Level 3: Critical (Block)
- Risk Score: 71-100
- Action: Block or strong warning
- Requires explicit override
- Maximum protection

---

## 📊 Risk Check API

The guard uses the `/api/risk-check` endpoint:

```typescript
POST /api/risk-check
{
  "contractAddress": "0x...",
  "walletAddress": "0x..."
}

Response:
{
  "overallRisk": 65,
  "riskLevel": "warning",
  "contractRisk": 80,
  "walletRisk": 20,
  "warnings": [
    "Critical vulnerabilities detected",
    "Reentrancy vulnerability found"
  ],
  "recommendation": "Exercise caution..."
}
```

---

## 🎊 Benefits

### For Users
- ✅ Protected from malicious contracts
- ✅ Warned about risky transactions
- ✅ Informed decision making
- ✅ Peace of mind

### For Developers
- ✅ Easy to integrate
- ✅ Customizable risk thresholds
- ✅ Real blockchain data
- ✅ Production-ready

### For Hackathon
- ✅ Unique feature
- ✅ Real implementation
- ✅ Demonstrable value
- ✅ Impressive to judges

---

## 🚀 Demo Script

1. **Show Protection Status**
   - Point out "Ghost Shell Protection: Active" banner
   - Toggle it on/off to show control

2. **Attempt Transaction**
   - Enter amount in Vault
   - Click "Deposit"
   - Watch Ghost Shell intercept

3. **Show Risk Modal**
   - Point out risk score
   - Explain color coding
   - Show warnings
   - Read AI recommendation

4. **User Decision**
   - Show "Proceed" and "Cancel" options
   - Explain user has control
   - Demonstrate cancellation

5. **Explain Value**
   - "This prevents users from losing funds"
   - "Real-time protection, not just analysis"
   - "Unique to Ghost Shell"

---

## 💪 Competitive Advantage

**Other Security Tools:**
- ❌ Only scan after deployment
- ❌ No real-time protection
- ❌ No transaction interception
- ❌ Just reports, no prevention

**Ghost Shell:**
- ✅ Scans before AND during
- ✅ Real-time transaction protection
- ✅ Intercepts risky transactions
- ✅ Reports AND prevents

---

## 🎯 Perfect for Hackathon

This feature demonstrates:
1. **Technical Skill**: Complex transaction interception
2. **Real Value**: Actually prevents losses
3. **User Experience**: Beautiful, intuitive UI
4. **Innovation**: Unique approach to security
5. **Completeness**: Full end-to-end solution

---

**Status**: ✅ Transaction Protection Implemented
**Location**: Vault page (/vault)
**Ready**: For demo and judging
**Impact**: High - Prevents real losses
