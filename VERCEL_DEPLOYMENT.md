# Vercel Deployment Guide

## Issue: 404 Error on Vercel

The 404 error occurs because:
1. React Router needs special configuration for SPA routing
2. API calls need to point to your backend server (not localhost)
3. Environment variables need to be set in Vercel

## Solution

### Step 1: Deploy Frontend to Vercel

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from client folder:**
   ```bash
   cd client
   vercel
   ```

   Or connect your GitHub repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to: `client`
   - Framework Preset: **Create React App**

### Step 2: Configure Vercel Settings

In Vercel Dashboard → Your Project → Settings:

1. **Root Directory**: Set to `client`

2. **Build Command**: 
   ```
   npm run build
   ```

3. **Output Directory**: 
   ```
   build
   ```

4. **Install Command**:
   ```
   npm install
   ```

### Step 3: Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these variables:

```
REACT_APP_API_URL=https://your-backend-url.com
```

**Important**: Replace `https://your-backend-url.com` with your actual backend URL.

### Step 4: Deploy Backend Separately

Vercel is primarily for frontend. You need to deploy your backend separately:

#### Option A: Deploy Backend to Railway/Render/Heroku

1. **Railway** (Recommended - Easy MySQL setup):
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Add MySQL database
   - Deploy your backend
   - Update `REACT_APP_API_URL` in Vercel with Railway URL

2. **Render**:
   - Go to [render.com](https://render.com)
   - Create Web Service
   - Connect your GitHub repo
   - Set root directory to project root
   - Add MySQL database
   - Update environment variables

3. **Heroku**:
   - Similar process to Render

#### Option B: Use Vercel Serverless Functions

Convert your Express backend to Vercel serverless functions (more complex).

### Step 5: Update API Configuration

The frontend now uses `src/config/axios.js` which reads from `REACT_APP_API_URL`.

Make sure to:
1. Set `REACT_APP_API_URL` in Vercel environment variables
2. Point it to your deployed backend URL

### Step 6: Redeploy

After setting environment variables:
1. Go to Vercel Dashboard
2. Click "Redeploy" on your latest deployment
3. Or push a new commit to trigger automatic deployment

## Quick Fix Checklist

- [ ] `vercel.json` file created in `client/` folder ✅
- [ ] Root directory set to `client` in Vercel
- [ ] Environment variable `REACT_APP_API_URL` set in Vercel
- [ ] Backend deployed separately (Railway/Render/Heroku)
- [ ] Backend URL added to `REACT_APP_API_URL`
- [ ] Redeployed after changes

## Testing Locally

To test with production API:

```bash
cd client
REACT_APP_API_URL=https://your-backend-url.com npm start
```

## Common Issues

### "404 Not Found" on routes
- ✅ Fixed by `vercel.json` rewrite rules

### "Network Error" or CORS issues
- Check backend CORS settings
- Verify `REACT_APP_API_URL` is correct
- Check backend is accessible

### "Cannot GET /api/..."
- Backend not deployed or URL incorrect
- Check `REACT_APP_API_URL` environment variable

## Database Setup for Production

Your backend needs a MySQL database. Options:

1. **Railway MySQL** (Easiest)
2. **PlanetScale** (Free tier available)
3. **AWS RDS** (More complex)
4. **ClearDB** (Heroku addon)

Update your backend `.env` with production database credentials.

## Next Steps

1. Deploy backend to Railway/Render
2. Get backend URL
3. Set `REACT_APP_API_URL` in Vercel
4. Redeploy frontend
5. Test your domain

Your app should now work! 🚀

