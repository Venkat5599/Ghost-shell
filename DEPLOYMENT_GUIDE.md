# 🚀 Ghost Shell - Complete Vercel Deployment Guide

This guide will walk you through deploying both backend and frontend to Vercel in under 15 minutes.

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ Vercel account (free) - [Sign up here](https://vercel.com/signup)
- ✅ Vercel CLI installed globally
- ✅ Groq API key - [Get it here](https://console.groq.com)
- ✅ Backend wallet private key (for registering manifests)
- ✅ Git repository pushed to GitHub

---

## 🛠️ Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Verify installation:
```bash
vercel --version
```

---

## 🔐 Step 2: Prepare Environment Variables

### Backend Environment Variables

You'll need these ready:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
HASHKEY_CHAIN_RPC_URL=https://testnet.hsk.xyz
HASHKEY_CHAIN_ID=133
REGISTRY_ADDRESS=0x2CD70324C4043D90f3C45D6ac7E84aB828708205
BACKEND_PRIVATE_KEY=your_backend_wallet_private_key
```

**How to get these:**

1. **GROQ_API_KEY**: 
   - Go to https://console.groq.com
   - Sign up/login
   - Go to API Keys section
   - Create new API key
   - Copy it

2. **BACKEND_PRIVATE_KEY**:
   - Open MetaMask
   - Create a new account called "Ghost Shell Backend"
   - Go to Account Details → Export Private Key
   - Copy it (keep it secret!)
   - Get test HSK from faucet: https://testnet-explorer.hsk.xyz/faucet

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

(You'll get this URL after deploying the backend)

---

## 🎯 Step 3: Deploy Backend to Vercel

### 3.1 Navigate to Backend Directory

```bash
cd backend
```

### 3.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 3.3 Deploy Backend

```bash
vercel
```

**Answer the prompts:**

```
? Set up and deploy "~/Ghost-shell/backend"? [Y/n] Y
? Which scope do you want to deploy to? [Select your account]
? Link to existing project? [N]
? What's your project's name? ghost-shell-backend
? In which directory is your code located? ./
? Want to override the settings? [N]
```

**Wait for deployment...** ⏳

You'll get a URL like: `https://ghost-shell-backend-xxx.vercel.app`

### 3.4 Add Environment Variables via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your `ghost-shell-backend` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `GROQ_API_KEY` | `your_groq_api_key_here` | Production, Preview, Development |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Production, Preview, Development |
| `HASHKEY_CHAIN_RPC_URL` | `https://testnet.hsk.xyz` | Production, Preview, Development |
| `HASHKEY_CHAIN_ID` | `133` | Production, Preview, Development |
| `REGISTRY_ADDRESS` | `0x2CD70324C4043D90f3C45D6ac7E84aB828708205` | Production, Preview, Development |
| `BACKEND_PRIVATE_KEY` | `your_backend_private_key` | Production, Preview, Development |

**Important:** For each variable, check all three environments (Production, Preview, Development)

### 3.5 Redeploy Backend with Environment Variables

```bash
vercel --prod
```

This will deploy to production with your environment variables.

### 3.6 Test Backend Deployment

```bash
# Test health endpoint
curl https://your-backend-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Ghost Shell Security Protocol",
  "version": "1.0.0",
  "timestamp": "2026-04-12T..."
}
```

**✅ Backend deployed successfully!**

Copy your backend URL: `https://your-backend-url.vercel.app/api`

---

## 🎨 Step 4: Deploy Frontend to Vercel

### 4.1 Navigate to Frontend Directory

```bash
cd ../frontend
```

### 4.2 Create Environment File

Create `.env.local` file:

```bash
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api" > .env.local
```

**Replace** `your-backend-url.vercel.app` with your actual backend URL from Step 3.

### 4.3 Test Frontend Locally (Optional)

```bash
npm run dev
```

Open http://localhost:3000 and verify it connects to your deployed backend.

### 4.4 Deploy Frontend

```bash
vercel
```

**Answer the prompts:**

```
? Set up and deploy "~/Ghost-shell/frontend"? [Y/n] Y
? Which scope do you want to deploy to? [Select your account]
? Link to existing project? [N]
? What's your project's name? ghost-shell
? In which directory is your code located? ./
? Want to override the settings? [N]
```

**Wait for deployment...** ⏳

You'll get a URL like: `https://ghost-shell-xxx.vercel.app`

### 4.5 Add Environment Variables via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your `ghost-shell` project
3. Go to **Settings** → **Environment Variables**
4. Add:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.vercel.app/api` | Production, Preview, Development |

### 4.6 Redeploy Frontend with Environment Variables

```bash
vercel --prod
```

**✅ Frontend deployed successfully!**

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend API

```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Scan contract
curl -X POST https://your-backend-url.vercel.app/api/scan-contract \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"0x2CD70324C4043D90f3C45D6ac7E84aB828708205"}'

# Analyze wallet
curl -X POST https://your-backend-url.vercel.app/api/analyze-wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

### 5.2 Test Frontend

1. Open your frontend URL: `https://ghost-shell-xxx.vercel.app`
2. Connect MetaMask to HashKey Chain Testnet
3. Try scanning a contract: `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
4. Try analyzing a wallet
5. Try sending a transaction with protection

---

## 🎉 Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain to Frontend

1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Domains**
3. Add your domain (e.g., `ghostshell.io`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### 6.2 Update Backend Environment Variable

If you add a custom domain, update the CORS settings in your backend to allow your custom domain.

---

## 📊 Deployment Summary

After completing all steps, you should have:

```
✅ Backend deployed:  https://ghost-shell-backend-xxx.vercel.app
✅ Frontend deployed: https://ghost-shell-xxx.vercel.app
✅ All APIs working
✅ Frontend connected to backend
✅ Smart contracts on HashKey Testnet
✅ Total cost: $0/month
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** "Module not found" error
```bash
# Solution: Make sure all dependencies are in package.json
cd backend
npm install
vercel --prod
```

**Problem:** "Environment variable not set"
```bash
# Solution: Check Vercel Dashboard → Settings → Environment Variables
# Make sure all variables are set for Production environment
# Redeploy after adding variables
```

**Problem:** "CORS error"
```bash
# Solution: Backend already has CORS configured
# Check that frontend is using correct API URL
# Verify NEXT_PUBLIC_API_URL in frontend environment variables
```

### Frontend Issues

**Problem:** "API connection failed"
```bash
# Solution: Check NEXT_PUBLIC_API_URL is correct
# Test backend health endpoint first
curl https://your-backend-url.vercel.app/api/health
```

**Problem:** "Build failed"
```bash
# Solution: Test build locally first
cd frontend
npm run build
# Fix any TypeScript errors
# Then redeploy
```

**Problem:** "MetaMask not connecting"
```bash
# Solution: Make sure you're on HashKey Chain Testnet
# Network: HashKey Chain Testnet
# RPC: https://testnet.hsk.xyz
# Chain ID: 133
```

---

## 🔄 Updating Your Deployment

### Update Backend

```bash
cd backend
# Make your changes
git add .
git commit -m "Update backend"
git push

# Vercel will auto-deploy if you connected GitHub
# Or manually deploy:
vercel --prod
```

### Update Frontend

```bash
cd frontend
# Make your changes
git add .
git commit -m "Update frontend"
git push

# Vercel will auto-deploy if you connected GitHub
# Or manually deploy:
vercel --prod
```

---

## 🔗 Connect GitHub for Auto-Deploy (Recommended)

### Enable Automatic Deployments

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Select `backend` or `frontend` directory
5. Configure environment variables
6. Deploy

Now every push to `main` branch will automatically deploy!

---

## 📈 Monitoring Your Deployment

### Vercel Dashboard

- **Analytics**: View traffic and performance
- **Logs**: Check function logs for errors
- **Deployments**: See deployment history
- **Environment Variables**: Manage secrets

### Check Logs

```bash
# View backend logs
vercel logs https://your-backend-url.vercel.app

# View frontend logs
vercel logs https://your-frontend-url.vercel.app
```

---

## 💰 Cost Breakdown

```
┌──────────────────────┬──────────────┬─────────────────────┐
│ Service              │ Cost/Month   │ Limits              │
├──────────────────────┼──────────────┼─────────────────────┤
│ Vercel Backend       │ $0           │ 100GB-hours         │
│ Vercel Frontend      │ $0           │ 100GB bandwidth     │
│ Groq AI              │ $0           │ Free tier           │
│ HashKey Testnet      │ $0           │ Unlimited           │
├──────────────────────┼──────────────┼─────────────────────┤
│ TOTAL                │ $0/month     │ 🎉 FREE!            │
└──────────────────────┴──────────────┴─────────────────────┘
```

---

## 🎯 Quick Commands Reference

```bash
# Deploy backend
cd backend && vercel --prod

# Deploy frontend
cd frontend && vercel --prod

# View logs
vercel logs [url]

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Check Vercel CLI help
vercel --help
```

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: https://github.com/Venkat5599/Ghost-shell/issues
- **Discord**: Join our community

---

## ✅ Deployment Checklist

Use this checklist to track your progress:

### Backend Deployment
- [ ] Vercel CLI installed
- [ ] Groq API key obtained
- [ ] Backend wallet created and funded
- [ ] Navigated to backend directory
- [ ] Ran `vercel` command
- [ ] Added environment variables in Vercel Dashboard
- [ ] Ran `vercel --prod`
- [ ] Tested health endpoint
- [ ] Tested scan-contract endpoint
- [ ] Copied backend URL

### Frontend Deployment
- [ ] Navigated to frontend directory
- [ ] Created `.env.local` with backend URL
- [ ] Tested locally (optional)
- [ ] Ran `vercel` command
- [ ] Added environment variables in Vercel Dashboard
- [ ] Ran `vercel --prod`
- [ ] Opened frontend URL
- [ ] Connected MetaMask
- [ ] Tested contract scanning
- [ ] Tested wallet analysis
- [ ] Tested transaction protection

### Post-Deployment
- [ ] Both deployments working
- [ ] APIs responding correctly
- [ ] Frontend connected to backend
- [ ] MetaMask connecting properly
- [ ] All features tested
- [ ] Custom domain configured (optional)
- [ ] GitHub auto-deploy enabled (optional)

---

<div align="center">

## 🎉 Congratulations!

Your Ghost Shell platform is now live on Vercel!

**Share your deployment:**
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app/api`

[⬆ Back to Top](#-ghost-shell---complete-vercel-deployment-guide)

</div>
