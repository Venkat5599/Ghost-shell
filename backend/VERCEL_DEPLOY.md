# 🚀 Deploy Backend to Vercel (FREE)

## Prerequisites

- Vercel account (free)
- Groq API key
- Backend wallet private key

---

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

---

## Step 2: Deploy

```bash
cd backend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **ghost-shell-backend** (or your choice)
- Directory? **./backend**
- Override settings? **N**

---

## Step 3: Add Environment Variables

Go to your Vercel dashboard: https://vercel.com/dashboard

1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

### Required Variables

```
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
HASHKEY_CHAIN_RPC_URL=https://testnet.hsk.xyz
HASHKEY_CHAIN_ID=133
REGISTRY_ADDRESS=0x2CD70324C4043D90f3C45D6ac7E84aB828708205
BACKEND_PRIVATE_KEY=your_backend_wallet_private_key
```

### Optional Variables

```
API_RATE_LIMIT=100
CACHE_TTL_CONTRACT=86400
CACHE_TTL_WALLET=3600
```

---

## Step 4: Redeploy

After adding environment variables:

```bash
vercel --prod
```

---

## Step 5: Test Your Deployment

### Health Check
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Ghost Shell Security Protocol",
  "version": "1.0.0"
}
```

### Scan Contract
```bash
curl -X POST https://your-project.vercel.app/api/scan-contract \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"0x2CD70324C4043D90f3C45D6ac7E84aB828708205"}'
```

---

## 🎯 Your Backend URL

Save this URL for frontend configuration:
```
https://your-project.vercel.app/api
```

---

## 📋 API Endpoints

All endpoints are under `/api`:

- `GET /api/health` - Health check
- `POST /api/scan-contract` - Scan contract for vulnerabilities
- `POST /api/analyze-wallet` - Analyze wallet risk
- `POST /api/risk-check` - Pre-transaction risk check

---

## 🔧 Troubleshooting

### "Module not found"
- Make sure all dependencies are in `package.json`
- Run `npm install` locally first

### "Environment variable not set"
- Check Vercel dashboard → Settings → Environment Variables
- Redeploy after adding variables

### "CORS error"
- CORS headers are already configured in each API file
- Check that frontend is using correct API URL

### "Groq API error"
- Verify GROQ_API_KEY is correct
- Check Groq API rate limits

---

## 💰 Cost

**$0/month** on Vercel Free Tier:
- 100GB-hours of serverless function execution
- 100GB bandwidth
- Unlimited API requests (within fair use)

---

## 🎉 Success!

Your backend is now live and ready to:
- Scan contracts for vulnerabilities
- Analyze wallet risk
- Generate AI explanations
- Register security manifests on-chain

**Next**: Deploy frontend and connect it to this backend URL!
