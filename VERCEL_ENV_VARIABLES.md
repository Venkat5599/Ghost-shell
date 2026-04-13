# 🔐 Vercel Environment Variables Setup

## Frontend Environment Variables

Go to your **frontend project** in Vercel Dashboard:
1. Click on your project (e.g., `ghost-shell`)
2. Go to **Settings** → **Environment Variables**
3. Add this variable:

### Required Variable

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.vercel.app/api` | Backend API URL |

**Important:** 
- Replace `your-backend-url.vercel.app` with your actual backend URL
- Check all 3 environments: **Production**, **Preview**, **Development**

---

## Backend Environment Variables

Go to your **backend project** in Vercel Dashboard:
1. Click on your project (e.g., `ghost-shell-backend`)
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

### Required Variables

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `GROQ_API_KEY` | `gsk_xxxxxxxxxxxxx` | Your Groq API key from https://console.groq.com |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Groq AI model to use |
| `HASHKEY_CHAIN_RPC_URL` | `https://testnet.hsk.xyz` | HashKey Chain Testnet RPC |
| `HASHKEY_CHAIN_ID` | `133` | HashKey Chain ID |
| `REGISTRY_ADDRESS` | `0x2CD70324C4043D90f3C45D6ac7E84aB828708205` | GhostShellRegistry contract address |
| `BACKEND_PRIVATE_KEY` | `0xYourPrivateKey` | Backend wallet private key |

**Important:** 
- Check all 3 environments: **Production**, **Preview**, **Development**
- Keep your private key secret!

---

## 📝 Step-by-Step Instructions

### Step 1: Get Your API Keys

#### Groq API Key
1. Go to https://console.groq.com
2. Sign up or login
3. Click on **API Keys** in the left sidebar
4. Click **Create API Key**
5. Copy the key (starts with `gsk_`)

#### Backend Private Key
1. Open MetaMask
2. Create a new account: **Account Menu** → **Create Account**
3. Name it "Ghost Shell Backend"
4. Click on the account
5. Click **⋮** (three dots) → **Account Details**
6. Click **Export Private Key**
7. Enter your password
8. Copy the private key (starts with `0x`)
9. Get test HSK from faucet: https://testnet-explorer.hsk.xyz/faucet

### Step 2: Add Variables to Vercel

#### For Backend:

```bash
# In Vercel Dashboard → Backend Project → Settings → Environment Variables

# Click "Add New" for each variable:

Name:  GROQ_API_KEY
Value: gsk_your_actual_key_here
Environments: ✓ Production ✓ Preview ✓ Development

Name:  GROQ_MODEL
Value: llama-3.3-70b-versatile
Environments: ✓ Production ✓ Preview ✓ Development

Name:  HASHKEY_CHAIN_RPC_URL
Value: https://testnet.hsk.xyz
Environments: ✓ Production ✓ Preview ✓ Development

Name:  HASHKEY_CHAIN_ID
Value: 133
Environments: ✓ Production ✓ Preview ✓ Development

Name:  REGISTRY_ADDRESS
Value: 0x2CD70324C4043D90f3C45D6ac7E84aB828708205
Environments: ✓ Production ✓ Preview ✓ Development

Name:  BACKEND_PRIVATE_KEY
Value: 0xYourActualPrivateKeyHere
Environments: ✓ Production ✓ Preview ✓ Development
```

#### For Frontend:

```bash
# In Vercel Dashboard → Frontend Project → Settings → Environment Variables

# Click "Add New":

Name:  NEXT_PUBLIC_API_URL
Value: https://your-backend-url.vercel.app/api
Environments: ✓ Production ✓ Preview ✓ Development
```

**Note:** You'll get the backend URL after deploying the backend first.

### Step 3: Redeploy After Adding Variables

After adding all environment variables:

1. Go to **Deployments** tab
2. Click **⋮** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

---

## 🧪 Testing Environment Variables

### Test Backend

```bash
# Health check (should return 200 OK)
curl https://your-backend-url.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "service": "Ghost Shell Security Protocol",
  "version": "1.0.0",
  "timestamp": "2026-04-12T..."
}
```

### Test Frontend

1. Open your frontend URL
2. Open browser console (F12)
3. Check for API connection errors
4. Try scanning a contract

---

## ⚠️ Common Issues

### Issue 1: "GROQ_API_KEY is not defined"

**Solution:**
- Make sure you added the variable in Vercel Dashboard
- Check that you selected all 3 environments
- Redeploy after adding the variable

### Issue 2: "Failed to connect to backend"

**Solution:**
- Check that `NEXT_PUBLIC_API_URL` is correct
- Make sure backend is deployed and running
- Test backend health endpoint first

### Issue 3: "Invalid private key"

**Solution:**
- Make sure private key starts with `0x`
- Don't include any spaces or quotes
- Export the key again from MetaMask if needed

### Issue 4: "Network error"

**Solution:**
- Check that `HASHKEY_CHAIN_RPC_URL` is correct: `https://testnet.hsk.xyz`
- Check that `HASHKEY_CHAIN_ID` is `133` (not `"133"` with quotes)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use different private keys** for development and production
3. **Rotate API keys** regularly
4. **Monitor API usage** in Groq dashboard
5. **Keep private keys secure** - never share them

---

## 📋 Quick Copy-Paste Template

### Backend Variables (Replace values with your own)

```
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
HASHKEY_CHAIN_RPC_URL=https://testnet.hsk.xyz
HASHKEY_CHAIN_ID=133
REGISTRY_ADDRESS=0x2CD70324C4043D90f3C45D6ac7E84aB828708205
BACKEND_PRIVATE_KEY=0xYourPrivateKeyHere
```

### Frontend Variables (Replace with your backend URL)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

---

## ✅ Verification Checklist

### Backend Deployment
- [ ] All 6 environment variables added
- [ ] All variables checked for Production, Preview, Development
- [ ] Backend redeployed after adding variables
- [ ] Health endpoint returns 200 OK
- [ ] Can scan contracts via API

### Frontend Deployment
- [ ] NEXT_PUBLIC_API_URL added
- [ ] Variable checked for Production, Preview, Development
- [ ] Frontend redeployed after adding variable
- [ ] Frontend loads without errors
- [ ] Can connect MetaMask
- [ ] Can scan contracts via UI

---

## 🎉 You're Done!

Once all variables are added and both projects are redeployed, your Ghost Shell platform will be fully functional!

**Test it:**
1. Open frontend URL
2. Connect MetaMask
3. Scan contract: `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
4. Check the AI-powered security report

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables
- **Groq Docs**: https://console.groq.com/docs
- **GitHub Issues**: https://github.com/Venkat5599/Ghost-shell/issues
