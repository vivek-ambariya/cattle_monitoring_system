# MySQL/XAMPP Setup Guide

## Step 1: Start XAMPP MySQL

1. Open XAMPP Control Panel
2. Start the **MySQL** service
3. Verify it's running (should show "Running" status)

## Step 2: Create Database

### Option A: Using phpMyAdmin (Recommended)

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click on "SQL" tab
3. Copy and paste the contents of `server/database/schema.sql`
4. Click "Go" to execute
5. Verify the database `cattle_monitoring` and tables are created

### Option B: Using MySQL Command Line

1. Open Terminal/Command Prompt
2. Navigate to MySQL (if in PATH):
   ```bash
   mysql -u root -p
   ```
3. Run the SQL file:
   ```sql
   source /path/to/server/database/schema.sql
   ```
   Or copy-paste the SQL commands directly

## Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cattle_monitoring
NODE_ENV=development
```

**Important Notes:**
- If your MySQL has a password, add it to `DB_PASSWORD`
- Default XAMPP MySQL user is `root` with no password
- Database name should match: `cattle_monitoring`

## Step 4: Verify Connection

1. Install dependencies (if not done):
   ```bash
   npm install
   ```

2. Test the connection by starting the server:
   ```bash
   npm run server
   ```

   You should see: `MySQL connected successfully`

## Step 5: Seed Sample Data (Optional)

```bash
npm run seed
```

This will populate the database with sample cattle and milk records.

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check if MySQL password is set in XAMPP
- Update `DB_PASSWORD` in `.env` file
- Or reset MySQL password in XAMPP

### "Unknown database 'cattle_monitoring'"
- Make sure you ran the SQL schema file
- Check database name in `.env` matches the created database
- Verify database exists in phpMyAdmin

### "Can't connect to MySQL server"
- Ensure MySQL is running in XAMPP Control Panel
- Check if MySQL port (3306) is not blocked
- Verify `DB_HOST` is correct in `.env`

### Connection works but tables are missing
- Run the SQL schema file again: `server/database/schema.sql`
- Check phpMyAdmin to verify tables exist

## Database Structure

The database includes two main tables:

1. **cattle** - Stores cattle information
   - id, tagId, name, breed, age, weight
   - healthStatus, location, temperature, heartRate
   - activity, milkProduction, AI predictions
   - timestamps

2. **milk_records** - Stores milk production records
   - id, cattleId (foreign key), tagId
   - quantity, quality, temperature
   - timestamp, location

## Default XAMPP MySQL Settings

- **Host:** localhost
- **Port:** 3306
- **User:** root
- **Password:** (empty by default)
- **phpMyAdmin:** http://localhost/phpmyadmin

