# Vercel Deployment Guide

## Prerequisites

- A GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com))

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your `Tafseer-OnTheGo` repository from GitHub
4. Vercel will auto-detect the Vite framework

### Step 3: Configure Build Settings

Vercel should automatically detect these settings from `vercel.json`:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project directory:

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

The CLI will guide you through:
- Linking to an existing project or creating a new one
- Setting up build configuration
- Deploying your app

## Method 3: One-Click Deploy

Click the button below to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aslamcue/Tafseer-OnTheGo)

## Configuration Details

### vercel.json

The project includes a `vercel.json` file with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**What this does:**
- Routes all paths to `index.html` for SPA routing
- Sets long-term cache headers for static assets
- Configures Vite as the build framework

## Environment Variables (Optional)

If you want to add OpenAI API key securely:

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Key:** `VITE_OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
   - **Environment:** Production, Preview, Development

4. Update `src/constants/translations.js`:
```javascript
export const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "YOUR_OPENAI_KEY_HERE";
```

5. Redeploy the project

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy every push to `main` branch to production
- Create preview deployments for pull requests
- Show build status in GitHub

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure `package.json` has all dependencies
3. Verify Node.js version (should use Node 18+)

### 404 Errors on Routes

The `vercel.json` rewrites configuration handles this. If you still see 404s:
1. Verify `vercel.json` is in the root directory
2. Check that the rewrite rule is present
3. Redeploy the project

### Static Assets Not Loading

1. Check that assets are in the `dist/` folder after build
2. Verify the `outputDirectory` in `vercel.json` is set to `dist`
3. Clear Vercel cache and redeploy

### API Calls Blocked

The app uses external APIs. Make sure:
1. CORS proxy (allorigins.win) is accessible
2. API endpoints are not blocked by firewall
3. Check browser console for CORS errors

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Asset compression (gzip/brotli)
- ✅ Edge caching
- ✅ Image optimization (if using Vercel Image)

## Monitoring

Access deployment analytics:
1. Go to your project in Vercel
2. Click "Analytics" tab
3. View:
   - Page views
   - Response times
   - Error rates
   - Geographic distribution

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Project Issues](https://github.com/aslamcue/Tafseer-OnTheGo/issues)
