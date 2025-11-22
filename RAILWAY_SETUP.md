# Railway MySQL Setup Guide

## Step 1: Add MySQL Service in Railway

1. Go to your Railway project dashboard
2. Click **"New"** → **"Database"** → **"Add MySQL"**
3. Railway will automatically create a MySQL database
4. Railway will automatically set these environment variables:
   - `MYSQLUSER`
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_DATABASE`
   - `RAILWAY_TCP_PROXY_DOMAIN`
   - `RAILWAY_TCP_PROXY_PORT`

## Step 2: Import Your Database

1. In Railway, click on your **MySQL service**
2. Go to **"Connect"** tab
3. You'll see connection details
4. Use a MySQL client or Railway's built-in MySQL console to import your SQL file

**Option A: Using Railway MySQL Console**
1. Click on MySQL service → **"Data"** tab
2. Use the SQL editor to paste and run your `cattle_monitoring.sql` file

**Option B: Using MySQL Client**
1. Get connection details from Railway MySQL service → **"Connect"** tab
2. Use command line:
   ```bash
   mysql -h $RAILWAY_TCP_PROXY_DOMAIN -P $RAILWAY_TCP_PROXY_PORT -u $MYSQLUSER -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < cattle_monitoring.sql
   ```

## Step 3: Verify Environment Variables

In your **Node.js service** on Railway:

1. Go to **"Variables"** tab
2. Make sure these are set (Railway auto-sets them when MySQL is linked):
   - `MYSQLUSER` ✅
   - `MYSQL_ROOT_PASSWORD` ✅
   - `MYSQL_DATABASE` ✅
   - `RAILWAY_TCP_PROXY_DOMAIN` ✅
   - `RAILWAY_TCP_PROXY_PORT` ✅

**Note:** Railway automatically shares these variables between linked services!

## Step 4: Link MySQL to Your Backend Service

1. In your **Node.js service** → **"Settings"**
2. Under **"Service Dependencies"**, add your MySQL service
3. This ensures the MySQL variables are available to your backend

## Step 5: Redeploy

After setting up MySQL and linking it:
1. Your backend service will automatically redeploy
2. Check the logs - you should see: `MySQL connected successfully`

## Connection String Format

Railway provides:
```
mysql://${{MYSQLUSER}}:${{MYSQL_ROOT_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}/${{MYSQL_DATABASE}}
```

The code now automatically uses these Railway variables when available!

## Troubleshooting

### "MySQL connection error"
- Check MySQL service is running (green status)
- Verify environment variables are set in Node.js service
- Make sure MySQL service is linked to your backend service
- Check that database `cattle_monitoring` exists (or matches `MYSQL_DATABASE`)

### "Access denied"
- Verify `MYSQLUSER` and `MYSQL_ROOT_PASSWORD` are correct
- Check MySQL service is accessible

### Database not found
- Import your SQL file to create tables
- Verify `MYSQL_DATABASE` matches your database name

## Quick Import SQL File

If you have `cattle_monitoring.sql`:

1. Railway MySQL service → **"Data"** tab
2. Click **"Query"** or use SQL editor
3. Copy-paste entire SQL file content
4. Click **"Run"**

Your database should now be set up! 🎉

