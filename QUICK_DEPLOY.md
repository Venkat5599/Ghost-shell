# ⚡ Quick Deploy - Ghost Shell to Vercel

**Time to deploy: 10 minutes**

---

## 🚀 Deploy Backend (5 minutes)

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Navigate to backend
cd backend

# 3. Deploy
vercel

# Answer prompts:
# - Set up and deploy? Y
# - Link to existing project? N
# - Project name? ghost-shell-backend
# - Directory? ./
# - Override settings? N

# 4. Deploy to production
vercel --prod
```

### Add Environment Variables

Go to https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these (check all 3 environments):

```
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
HASHKEY_CHAIN_RPC_URL=https://testnet.hsk.xyz
HASHKEY_CHAIN_ID=133
REGISTRY_ADDRESS=0x2CD70324C4043D90f3C45D6ac7E84aB828708205
BACKEND_PRIVATE_KEY=your_backend_wallet_private_key
```

Then redeploy:
```bash
vercel --prod
```

**✅ Backend URL:** `https://ghost-shell-backend-xxx.vercel.app`

---

## 🎨 Deploy Frontend (5 minutes)

```bash
# 1. Navigate to frontend
cd ../frontend

# 2. Create environment file
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api" > .env.local

# 3. Deploy
vercel

# Answer prompts:
# - Set up and deploy? Y
# - Link to existing project? N
# - Project name? ghost-shell
# - Directory? ./
# - Override settings? N

# 4. Deploy to production
vercel --prod
```

### Add Environment Variable

Go to https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

Then redeploy:
```bash
vercel --prod
```

**✅ Frontend URL:** `https://ghost-shell-xxx.vercel.app`

---

## 🧪 Test Deployment

```bash
# Test backend
curl https://your-backend-url.vercel.app/api/health

# Test frontend
# Open https://your-frontend-url.vercel.app in browser
```

---

## 🎉 Done!

Your Ghost Shell is now live:
- **Backend:** `https://ghost-shell-backend-xxx.vercel.app`
- **Frontend:** `https://ghost-shell-xxx.vercel.app`
- **Cost:** $0/month

---

## 📚 Need More Details?

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.
