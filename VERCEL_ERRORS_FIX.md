# Vercel Error Troubleshooting Guide

## Most Common Errors for React Apps

### 1. NOT_FOUND (404) - Fixed ✅
**Solution**: `vercel.json` with rewrite rules is already in place.

### 2. ROUTER_CANNOT_MATCH (502)
**Cause**: Routing configuration issues
**Fix**: Ensure `vercel.json` is correct:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3. DEPLOYMENT_NOT_FOUND (404)
**Cause**: Wrong root directory or build settings
**Fix in Vercel Dashboard**:
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### 4. FUNCTION_INVOCATION_FAILED (500)
**Cause**: If you're trying to use API routes (you're not, so ignore this)

### 5. RESOURCE_NOT_FOUND (404)
**Cause**: Missing files or incorrect paths
**Check**:
- All files are committed to Git
- `package.json` exists in `client/` folder
- Build completes successfully

## Step-by-Step Fix

### Step 1: Verify Vercel Configuration

1. Go to Vercel Dashboard → Your Project → Settings
2. Check these settings:

**General Settings:**
- Framework Preset: `Create React App`
- Root Directory: `client` ⚠️ **IMPORTANT**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

**Environment Variables:**
- Add if needed: `REACT_APP_API_URL` (your backend URL)

### Step 2: Check Build Logs

1. Go to Deployments tab
2. Click on failed deployment
3. Check Build Logs for errors
4. Common issues:
   - Missing dependencies
   - Build errors
   - TypeScript errors (if using TS)

### Step 3: Verify File Structure

Your project should have:
```
cattle/
├── client/
│   ├── vercel.json ✅
│   ├── package.json ✅
│   ├── public/
│   ├── src/
│   └── ...
└── server/
```

### Step 4: Common Fixes

#### Fix 1: Clear Cache and Redeploy
1. Vercel Dashboard → Settings → General
2. Scroll to "Clear Build Cache"
3. Click "Clear"
4. Redeploy

#### Fix 2: Check Node Version
In `client/package.json`, ensure Node version is compatible:
```json
"engines": {
  "node": ">=18.0.0"
}
```

#### Fix 3: Verify vercel.json Location
`vercel.json` must be in the `client/` folder (root of what Vercel builds)

#### Fix 4: Check for Large Files
Vercel has limits:
- Individual file: 50MB
- Total deployment: 100MB

Remove large files from Git if present.

## Quick Diagnostic Checklist

- [ ] `vercel.json` exists in `client/` folder
- [ ] Root Directory set to `client` in Vercel
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] No build errors in logs
- [ ] All dependencies in `package.json`
- [ ] No large files (>50MB) in repo
- [ ] Environment variables set (if needed)

## Testing Locally Before Deploy

```bash
cd client
npm install
npm run build
npm install -g serve
serve -s build
```

If this works locally, it should work on Vercel.

## Still Getting Errors?

### Check Deployment Logs
1. Vercel Dashboard → Deployments
2. Click on deployment
3. Check "Build Logs" and "Function Logs"
4. Look for specific error messages

### Common Error Messages and Solutions

**"Module not found"**
- Missing dependency in `package.json`
- Run `npm install` locally and commit `package-lock.json`

**"Cannot find module"**
- Check import paths
- Verify all files are committed

**"Build failed"**
- Check Node version compatibility
- Review build logs for specific errors

**"404 on routes"**
- Verify `vercel.json` rewrite rules
- Check that React Router is configured correctly

## Need More Help?

1. Check Vercel Build Logs for specific error
2. Share the exact error code/message
3. Verify your Vercel project settings match the checklist above

## Quick Fix Command

If you want to test the build locally:
```bash
cd client
npm run build
```

If this succeeds, your Vercel deployment should work too!

