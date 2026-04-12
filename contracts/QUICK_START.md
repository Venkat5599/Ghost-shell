# 🚀 Quick Start - Deploy in 5 Minutes

## Step 1: Get Your Private Key (2 minutes)

### From MetaMask:
1. Open MetaMask
2. Click ⋮ (3 dots) → Account Details
3. Click "Show Private Key"
4. Enter password
5. Copy the key

⚠️ **Use a test wallet, not your main wallet!**

---

## Step 2: Add to .env File (1 minute)

The `.env` file is already created at: `contracts/.env`

**Open it and edit:**

```env
PRIVATE_KEY=paste_your_key_here
```

**Example:**
```env
PRIVATE_KEY=0abc123def456789abc123def456789abc123def456789abc123def456789abc
```

**Save the file!**

---

## Step 3: Get Test Tokens (2 minutes)

1. Copy your wallet address from MetaMask
2. Go to HashKey Chain faucet
3. Request test tokens
4. Wait for tokens to arrive

---

## Step 4: Deploy! (30 seconds)

```bash
cd contracts
npm run deploy:testnet
```

**That's it!** 🎉

You'll see:
```
✅ GhostShellRegistry deployed to: 0x...
✅ SecureVault deployed to: 0x...
```

**Save those addresses!**

---

## What You Just Did

✅ Deployed GhostShellRegistry (security manifest storage)
✅ Deployed SecureVault (example protected vault)
✅ Contracts are now live on HashKey Testnet!

---

## Next Steps

1. **Authorize Backend** (see DEPLOY_GUIDE.md)
2. **Deploy Backend** to Vercel
3. **Deploy Frontend** to Vercel
4. **Test Everything**

---

## Troubleshooting

**"insufficient funds"** → Get test tokens from faucet
**"invalid private key"** → Check format in .env file
**"network not found"** → Check RPC URL

---

## Files You Need to Know

- `contracts/.env` ← Add your private key here
- `contracts/DEPLOY_GUIDE.md` ← Full deployment guide
- `contracts/HOW_TO_GET_PRIVATE_KEY.md` ← Detailed private key guide

---

**Ready? Let's deploy!** 🚀

```bash
cd contracts
npm run deploy:testnet
```
