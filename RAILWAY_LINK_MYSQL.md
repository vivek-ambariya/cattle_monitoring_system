# How to Link MySQL to Backend Service in Railway

## Method 1: Using Service Dependencies (Recommended)

### Step 1: Open Your Backend Service
1. Go to your Railway project dashboard
2. Click on your **Node.js backend service** (the one showing the MySQL connection error)
3. You should see tabs: **"Deploy Logs"**, **"Build Logs"**, **"Settings"**, etc.

### Step 2: Go to Settings
1. Click on the **"Settings"** tab
2. Scroll down to find **"Service Dependencies"** section

### Step 3: Add MySQL Dependency
1. In **"Service Dependencies"**, you'll see a section to add dependencies
2. Click **"Add Dependency"** or **"Link Service"** button
3. A dropdown/list will appear showing your MySQL service
4. Select your **MySQL service** from the list
5. Click **"Add"** or **"Link"**

### Step 4: Verify
- After linking, Railway will automatically share MySQL environment variables
- You should see the MySQL service listed under dependencies
- Railway will automatically redeploy your backend service

## Method 2: Using Variables Tab (Alternative)

### Step 1: Check if Variables are Already There
1. Go to your **Node.js backend service**
2. Click **"Variables"** tab
3. Check if you see these variables (Railway auto-adds them when services are in same project):
   - `MYSQLUSER`
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_DATABASE`
   - `RAILWAY_TCP_PROXY_DOMAIN`
   - `RAILWAY_TCP_PROXY_PORT`

### Step 2: If Variables are Missing
1. Go to your **MySQL service**
2. Click **"Variables"** tab
3. Copy the values of:
   - `MYSQLUSER`
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_DATABASE`
   - `RAILWAY_TCP_PROXY_DOMAIN`
   - `RAILWAY_TCP_PROXY_PORT`
4. Go back to your **Node.js service** → **"Variables"** tab
5. Click **"New Variable"**
6. Add each variable one by one with the values you copied

## Method 3: Using Railway CLI (Advanced)

If you have Railway CLI installed:

```bash
railway link
railway service
# Select your backend service
railway variables
# Add the MySQL variables manually
```

## Visual Guide

**Navigation Path:**
```
Railway Dashboard
  └── Your Project
      └── Node.js Backend Service
          └── Settings Tab
              └── Service Dependencies Section
                  └── Add Dependency → Select MySQL Service
```

## What Happens After Linking

1. ✅ Railway automatically shares MySQL environment variables
2. ✅ Your backend can now access MySQL using those variables
3. ✅ Backend service automatically redeploys
4. ✅ MySQL connection error should be resolved

## Troubleshooting

### "Service Dependencies" section not visible?
- Make sure you're in the **Settings** tab of your backend service
- Scroll down - it might be below other settings
- Try refreshing the page

### Variables still not showing?
- Make sure both services are in the **same Railway project**
- Try unlinking and re-linking
- Check that MySQL service is running (green status)

### Still getting connection errors?
- Verify MySQL service is running
- Check that you've imported your SQL file into Railway MySQL
- Look at backend deploy logs for specific error messages

## Quick Checklist

- [ ] MySQL service exists in Railway project
- [ ] MySQL service is running (green status)
- [ ] Backend service exists in same Railway project
- [ ] MySQL is linked to backend (via Service Dependencies)
- [ ] Environment variables are visible in backend Variables tab
- [ ] SQL file imported into Railway MySQL
- [ ] Backend service redeployed

Once all checked, your MySQL connection should work! 🚀

