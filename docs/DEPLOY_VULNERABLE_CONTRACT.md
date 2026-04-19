# 🚨 Deploy Vulnerable Contract for Demo

## ⚠️ IMPORTANT: This is for DEMONSTRATION ONLY

This contract is **deliberately vulnerable** to showcase Ghost Shell's automatic blocking capabilities.

## 📋 Steps to Deploy

### 1. Add Your Private Key

Edit `contracts/.env` and add your private key:

```bash
HASHKEY_TESTNET_RPC=https://testnet.hsk.xyz
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

**How to get your private key:**
1. Open MetaMask
2. Click the 3 dots menu
3. Account Details → Show Private Key
4. Enter your password
5. Copy the private key (without 0x prefix)

### 2. Make Sure You Have Test HSK

Get test HSK from the faucet:
- https://testnet-explorer.hsk.xyz/faucet
- You need at least 0.01 HSK for deployment

### 3. Deploy the Contract

```bash
cd contracts
npm run compile
npx hardhat run scripts/deploy-vulnerable.ts --network hashkeyTestnet
```

### 4. Copy the Contract Address

The script will output something like:

```
✅ VulnerableContract deployed to: 0xABCDEF1234567890...

📋 Contract Address:
    0xABCDEF1234567890...

🔗 View on Explorer:
    https://testnet-explorer.hsk.xyz/address/0xABCDEF1234567890...
```

**Copy this address!** You'll use it to demonstrate blocking.

## 🎯 How to Demo Automatic Blocking

### For Judges:

1. **Open Ghost Shell**
   - Go to http://localhost:3000/send
   - Connect MetaMask

2. **Enter the Vulnerable Contract Address**
   - Paste the deployed contract address as recipient
   - Enter amount: 0.001 HSK

3. **Click "Send Transaction"**

4. **Watch the Magic! 🛡️**

The system will:
- ✅ Scan the contract in real-time
- ✅ Detect 5 critical vulnerabilities:
  1. Reentrancy
  2. Missing Access Control
  3. Dangerous Delegatecall
  4. Unchecked External Calls
  5. tx.origin Authentication
- ✅ Calculate risk score: **90-100 (CRITICAL)**
- ✅ **AUTOMATICALLY BLOCK** the transaction

### What the Modal Will Show:

```
┌─────────────────────────────────────────────┐
│  🛡️ Ghost Shell Protection                 │
│  Pre-Transaction Risk Check                 │
├─────────────────────────────────────────────┤
│                                             │
│  RISK LEVEL              95/100             │
│  CRITICAL                                   │
│                                             │
│  ┌──────────────┬──────────────┐           │
│  │ CONTRACT     │ WALLET       │           │
│  │ RISK         │ RISK         │           │
│  │ 95/100 🔴    │ 15/100 🟢    │           │
│  └──────────────┴──────────────┘           │
│                                             │
│  ⚠️ Warnings                                │
│  • High contract risk detected (95/100)    │
│  • 🔴 Reentrancy Vulnerability             │
│  • 🔴 Missing Access Control               │
│  • 🔴 Dangerous Delegatecall               │
│  • 🔴 Unchecked External Calls             │
│  • 🔴 tx.origin Authentication             │
│                                             │
│  🐛 Detected Vulnerabilities                │
│                                             │
│  [CRITICAL] Reentrancy Vulnerability       │
│  The contract contains a critical          │
│  reentrancy vulnerability that allows      │
│  attackers to drain funds...               │
│  💡 Use checks-effects-interactions        │
│                                             │
│  [CRITICAL] Missing Access Control         │
│  Critical functions lack proper access     │
│  control. Anyone can call privileged       │
│  functions...                              │
│  💡 Implement role-based access control    │
│                                             │
│  [CRITICAL] Dangerous Delegatecall         │
│  The contract uses delegatecall with       │
│  user-controlled addresses...              │
│  💡 Never use delegatecall with untrusted  │
│     addresses                              │
│                                             │
│  [MEDIUM] Unchecked External Call          │
│  External calls are made without checking  │
│  return values...                          │
│  💡 Always check return values             │
│                                             │
│  [HIGH] tx.origin Authentication           │
│  Using tx.origin instead of msg.sender     │
│  for authentication...                     │
│  💡 Always use msg.sender                  │
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

**Key Point:** There is NO "Proceed Anyway" button! The transaction is completely blocked.

## 🎤 What to Say to Judges

> "Let me demonstrate Ghost Shell's automatic protection. I'm going to try sending funds to this contract that I deployed specifically for testing. Watch what happens..."
>
> [Enter address and click Send]
>
> "As you can see, Ghost Shell immediately scanned the contract, detected 5 critical vulnerabilities including reentrancy and missing access control, and **automatically blocked the transaction**. The user cannot proceed - their funds are protected."
>
> "This happens in real-time, before the transaction is broadcast to the blockchain. Traditional security tools only warn you after the fact. Ghost Shell prevents the loss before it happens."

## 📊 Vulnerabilities in the Contract

The deployed contract contains:

1. **Reentrancy** (Critical)
   - External call before state update in `withdraw()`
   - Allows recursive draining of funds

2. **Missing Access Control** (Critical)
   - `emergencyWithdraw()` has no access control
   - Anyone can drain the entire contract

3. **Dangerous Delegatecall** (Critical)
   - `executeCode()` allows arbitrary code execution
   - User-controlled delegatecall target

4. **Unchecked External Calls** (Medium)
   - `unsafeTransfer()` doesn't check return value
   - Silent failures possible

5. **tx.origin Authentication** (High)
   - `transferOwnership()` uses tx.origin
   - Vulnerable to phishing attacks

## 🎯 Expected Results

- **Risk Score:** 90-100 (Critical)
- **Contract Risk:** 90-95
- **Action:** BLOCKED
- **User Can Proceed:** NO
- **Funds Protected:** YES ✅

## 🔄 Alternative: Use Existing Contract

If you don't want to deploy, you can use the GhostShellRegistry contract which already has some vulnerabilities detected:

**Address:** `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
- Risk Score: ~70 (Warning level)
- Shows vulnerabilities but doesn't block (for comparison)

## 💡 Pro Tips for Demo

1. **Show the contrast:**
   - First send to a safe wallet (low risk, proceeds)
   - Then send to vulnerable contract (blocked)

2. **Highlight the speed:**
   - "This analysis happens in under 1 second"

3. **Emphasize the protection:**
   - "No 'Proceed Anyway' button - truly blocked"
   - "Prevents loss before it happens"

4. **Show the details:**
   - Scroll through the vulnerability list
   - Point out the severity levels
   - Show the recommendations

## 🚀 Ready to Impress!

Once deployed, you have a real, live demonstration of Ghost Shell's automatic blocking capabilities on HashKey Chain testnet! 🛡️
