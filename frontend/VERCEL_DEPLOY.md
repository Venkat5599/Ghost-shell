# 🚀 Deploy Frontend to Vercel (FREE)

## Prerequisites

- Vercel account (free)
- Backend deployed and URL ready

---

## Step 1: Create Environment File

Create `.env.local` in the frontend folder:

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api" > .env.local
```

Replace `your-backend.vercel.app` with your actual backend URL.

---

## Step 2: Test Locally (Optional)

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- UI loads correctly
- Can connect to backend
- Contract scanner works
- Wallet analyzer works

---

## Step 3: Deploy to Vercel

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **ghost-shell** (or your choice)
- Directory? **./frontend**
- Override settings? **N**

---

## Step 4: Add Environment Variable in Vercel

Go to Vercel dashboard: https://vercel.com/dashboard

1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add:

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

---

## Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Step 6: Test Your Deployment

Open your frontend URL: `https://your-project.vercel.app`

### Test Checklist

- [ ] UI loads with Ghost Shell branding
- [ ] Glassmorphism styling works
- [ ] Sidebar appears on hover
- [ ] Contract Scanner tab works
- [ ] Wallet Analyzer tab works
- [ ] Can scan a contract address
- [ ] Can analyze a wallet
- [ ] Risk check modal appears
- [ ] AI explanations load

---

## 🎯 Your Frontend URL

```
https://your-project.vercel.app
```

Share this with users!

---

## 🎨 Features to Test

### Contract Scanner
1. Enter contract address: `0x2CD70324C4043D90f3C45D6ac7E84aB828708205`
2. Click "Scan Contract"
3. View vulnerability report
4. Check AI explanation

### Wallet Analyzer
1. Enter wallet address
2. Click "Analyze Wallet"
3. View risk score
4. Check transaction patterns

### Risk Check Modal
1. Click "Check Risk" button
2. Enter transaction details
3. View risk assessment
4. Get AI recommendations

---

## 🔧 Troubleshooting

### "Failed to fetch"
- Check backend URL in environment variables
- Verify backend is deployed and running
- Check browser console for CORS errors

### "Styles not loading"
- Clear browser cache
- Check Tailwind CSS is configured
- Verify `globals.css` is imported

### "API errors"
- Check backend logs in Vercel
- Verify GROQ_API_KEY is set in backend
- Check network tab for error details

### "Wallet connection issues"
- Make sure MetaMask is installed
- Switch to HashKey Chain Testnet
- Check wallet has test tokens

---

## 💰 Cost

**$0/month** on Vercel Free Tier:
- Unlimited deployments
- 100GB bandwidth
- Automatic HTTPS
- Global CDN

---

## 🎉 Success!

Your Ghost Shell frontend is now live with:
- ✅ Beautiful glassmorphism UI
- ✅ Anime-themed branding (攻殻機動隊)
- ✅ Contract vulnerability scanner
- ✅ Wallet risk analyzer
- ✅ Pre-transaction risk checks
- ✅ AI-powered explanations

**Share your app and make DeFi safer!** 🛡️

---

## 📱 Custom Domain (Optional)

Want a custom domain like `ghostshell.com`?

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your domain
5. Update DNS records

Still **FREE** on Vercel!

---

## 🔄 Updates

To update your deployment:

```bash
git add .
git commit -m "Update"
git push
```

Vercel auto-deploys on push! Or manually:

```bash
vercel --prod
```

---

**Project**: Ghost Shell (攻殻機動隊)
**Status**: ✅ Fully Deployed
**Cost**: $0/month
**Time**: ~5 minutes
