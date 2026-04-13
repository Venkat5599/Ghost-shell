# ⚡ Environment Variables - Quick Reference

## 🎨 Frontend (1 variable)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🔧 Backend (6 variables)

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile
HASHKEY_CHAIN_RPC_URL=https://testnet.hsk.xyz
HASHKEY_CHAIN_ID=133
REGISTRY_ADDRESS=0x2CD70324C4043D90f3C45D6ac7E84aB828708205
BACKEND_PRIVATE_KEY=0xYourPrivateKeyHere
```

---

## 📍 Where to Add in Vercel

1. Go to https://vercel.com/dashboard
2. Click your project
3. **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter **Name** and **Value**
6. Check: ✓ Production ✓ Preview ✓ Development
7. Click **Save**
8. Repeat for all variables
9. Go to **Deployments** → **Redeploy**

---

## 🔑 Where to Get Values

| Variable | Where to Get It |
|----------|-----------------|
| `GROQ_API_KEY` | https://console.groq.com → API Keys → Create |
| `BACKEND_PRIVATE_KEY` | MetaMask → Account Details → Export Private Key |
| Backend URL | After deploying backend to Vercel |

---

## ✅ Checklist

**Backend:**
- [ ] GROQ_API_KEY
- [ ] GROQ_MODEL
- [ ] HASHKEY_CHAIN_RPC_URL
- [ ] HASHKEY_CHAIN_ID
- [ ] REGISTRY_ADDRESS
- [ ] BACKEND_PRIVATE_KEY
- [ ] Redeploy

**Frontend:**
- [ ] NEXT_PUBLIC_API_URL
- [ ] Redeploy

---

**See [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) for detailed instructions.**
