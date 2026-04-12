# Deploying Ghost Shell Backend to Vercel

## Prerequisites
- Vercel account (free tier works!)
- Groq API key

## Deployment Steps

### 1. Install Vercel CLI (optional)
```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set the root directory to `backend`
5. Add environment variables:
   - `GROQ_API_KEY` - Your Groq API key
   - `HASHKEY_CHAIN_RPC_URL` - HashKey Chain RPC endpoint
   - `HASHKEY_CHAIN_ID` - Chain ID (default: 177)
6. Click "Deploy"

### 3. Deploy via CLI

```bash
cd backend
vercel
```

Follow the prompts and add environment variables when asked.

### 4. Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
GROQ_API_KEY=your_groq_api_key_here
HASHKEY_CHAIN_RPC_URL=https://hashkey-chain-rpc.example.com
HASHKEY_CHAIN_ID=177
NODE_ENV=production
```

### 5. Update Frontend API URL

After deployment, update your frontend `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

## API Endpoints

Your deployed backend will have these endpoints:

- `https://your-backend.vercel.app/api/scan-contract`
- `https://your-backend.vercel.app/api/analyze-wallet`
- `https://your-backend.vercel.app/api/risk-check`
- `https://your-backend.vercel.app/api/health`

## Notes

- ✅ Vercel Serverless Functions are FREE (up to 100GB-hours/month)
- ✅ No VPS needed
- ✅ Auto-scaling
- ✅ Global CDN
- ⚠️ Redis and PostgreSQL are optional (caching disabled on serverless)
- ⚠️ Each function has 10s execution limit (Hobby plan) or 60s (Pro plan)

## Testing

Test your deployed API:

```bash
curl https://your-backend.vercel.app/api/health
```

## Troubleshooting

**Function timeout?**
- Groq API is ultra-fast (< 1s), so this shouldn't happen
- If it does, upgrade to Vercel Pro for 60s timeout

**CORS errors?**
- CORS headers are already configured in the serverless functions
- Make sure your frontend URL is correct

**Environment variables not working?**
- Redeploy after adding environment variables
- Check they're set in Vercel Dashboard

## Cost Estimate

**FREE TIER:**
- Vercel: FREE (100GB-hours/month)
- Groq API: FREE tier available
- Total: $0/month 🎉

**If you exceed free tier:**
- Vercel Pro: $20/month (unlimited functions)
- Groq: Pay-as-you-go (very cheap)
