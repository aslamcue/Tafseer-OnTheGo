# 🚀 Quick Start: Deploy to Vercel

## Fastest Way (2 minutes)

### Step 1: One-Click Deploy

Click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aslamcue/Tafseer-OnTheGo)

### Step 2: Deploy

1. Vercel will auto-detect Vite framework
2. Click "Deploy"
3. Done! ✅

Your app will be live at: `https://your-project-name.vercel.app`

---

## Alternative: Manual Deploy

### Via Vercel Dashboard

1. **Push to GitHub** (if not already done)
   ```bash
   git push origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"

3. **Import Repository**
   - Select `Tafseer-OnTheGo` from your repositories
   - Vercel auto-detects Vite configuration ✨

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app is live! 🎉

### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd Tafseer-OnTheGo
vercel --prod
```

---

## What Happens Automatically

✅ **Build Command:** `npm run build` (auto-detected)  
✅ **Output Directory:** `dist` (auto-detected)  
✅ **Framework:** Vite (auto-detected from package.json)  
✅ **SPA Routing:** All routes → index.html (configured in vercel.json)  
✅ **Asset Caching:** 1 year cache for static files (configured in vercel.json)  
✅ **HTTPS:** Enabled by default  
✅ **CDN:** Global edge network  

---

## After Deployment

### Get Your URL
- Production: `https://your-project.vercel.app`
- You can add a custom domain in Vercel settings

### Continuous Deployment
Every push to `main` branch automatically deploys! 🚀

### Preview Deployments
Pull requests get their own preview URL for testing

---

## Troubleshooting

**Build fails?**
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version is 18+ (set in Vercel settings if needed)

**404 on routes?**
- Already fixed! `vercel.json` handles SPA routing

**Need help?**
- See full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Open an issue on GitHub

---

## Next Steps

1. 🎨 Customize the app (see README.md)
2. 🔑 (Optional) Add OpenAI API key for AI voices
3. 🌐 (Optional) Add custom domain
4. 📊 Check analytics in Vercel dashboard

**Enjoy your deployed Quran study platform! 📖**
