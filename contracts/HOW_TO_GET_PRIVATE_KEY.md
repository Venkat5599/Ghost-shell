# How to Get Your Private Key and Deploy

## ⚠️ IMPORTANT SECURITY WARNING

**NEVER share your private key with anyone!**
**NEVER commit your .env file to GitHub!**

The `.env` file is already in `.gitignore` to protect you.

---

## Step 1: Get Your Private Key from MetaMask

### Method 1: Export from MetaMask (Recommended for Testing)

1. **Open MetaMask** browser extension
2. **Click the 3 dots** (⋮) in the top right
3. **Click "Account Details"**
4. **Click "Show Private Key"**
5. **Enter your MetaMask password**
6. **Click to reveal** and **copy the private key**

⚠️ **For testnet only!** Use a separate wallet for testing, not your main wallet!

### Method 2: Create a New Test Wallet

For safety, create a dedicated wallet for testing:

1. **Open MetaMask**
2. **Click the account icon** (top right)
3. **Click "Add account or hardware wallet"**
4. **Click "Add a new account"**
5. **Name it** "Ghost Shell Testnet"
6. **Export the private key** (follow Method 1)

---

## Step 2: Add Private Key to .env File

### Open the .env file

**Location**: `contracts/.env`

You can open it with:
- VS Code: `code contracts/.env`
- Notepad: `notepad contracts\.env`
- Any text editor

### Edit the file

Replace `your_private_key_here` with your actual private key:

```env
# Before:
PRIVATE_KEY=your_private_key_here

# After (example - use YOUR key):
PRIVATE_KEY=0abc123def456789abc123def456789abc123def456789abc123def456789abc
```

⚠️ **Important**: 
- Include the `0x` prefix if your key has it
- No spaces
- No quotes
- Just the key itself

### Full .env file example:

```env
# Private key for deployment (DO NOT COMMIT!)
PRIVATE_KEY=0abc123def456789abc123def456789abc123def456789abc123def456789abc

# HashKey Chain RPC URLs
HASHKEY_TESTNET_RPC=https://hashkey-testnet-rpc.example.com
HASHKEY_MAINNET_RPC=https://hashkey-mainnet-rpc.example.com

# Block Explorer API Key (for verification)
HASHKEY_API_KEY=your_api_key_here
```

---

## Step 3: Get Test Tokens

Before deploying, you need test tokens for gas fees.

### Get HashKey Testnet Tokens

1. **Copy your wallet address** from MetaMask
2. **Go to HashKey Chain faucet**: 
   - Check HashKey Chain documentation for faucet URL
   - Usually something like: `https://faucet.hashkey.com`
3. **Paste your address** and request tokens
4. **Wait** for tokens to arrive (usually 1-2 minutes)

### Verify you have tokens

In MetaMask:
1. **Switch to HashKey Testnet** network
2. **Check your balance** (should show some test tokens)

---

## Step 4: Deploy!

Now you're ready to deploy:

```bash
cd contracts
npm run deploy:testnet
```

You should see:
```
🚀 Deploying Ghost Shell Contracts...

Deploying with account: 0xYourAddress
Account balance: 10.0 ETH

📝 Deploying GhostShellRegistry...
✅ GhostShellRegistry deployed to: 0x...

📝 Deploying SecureVault...
✅ SecureVault deployed to: 0x...

🎉 Deployment Complete!
```

**Save those contract addresses!** You'll need them later.

---

## Troubleshooting

### "Error: insufficient funds for gas"
- You need test tokens from the faucet
- Check your balance in MetaMask
- Make sure you're on the correct network

### "Error: invalid private key"
- Check the format (should be 64 hex characters)
- Include `0x` prefix if needed
- No spaces or quotes
- Make sure you copied the full key

### "Error: network not found"
- Check your RPC URL in `.env`
- Make sure HashKey Chain RPC is accessible
- Try a different RPC endpoint

### "Cannot find module 'dotenv'"
- Run `npm install` in the contracts folder
- Make sure all dependencies are installed

---

## Security Best Practices

✅ **DO:**
- Use a separate wallet for testing
- Keep private keys in `.env` file (it's in .gitignore)
- Use testnet first before mainnet
- Backup your private key securely

❌ **DON'T:**
- Share your private key with anyone
- Commit `.env` file to GitHub
- Use your main wallet for testing
- Store private keys in code files

---

## What's Next?

After successful deployment:

1. ✅ **Save contract addresses**
2. ✅ **Authorize backend wallet** (see DEPLOY_GUIDE.md)
3. ✅ **Deploy backend to Vercel**
4. ✅ **Deploy frontend to Vercel**
5. ✅ **Test the full system**

See [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) for complete instructions.

---

## Need Help?

- Check [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
- Review [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)
- Read [Hardhat Documentation](https://hardhat.org/docs)

Good luck with your deployment! 🚀
