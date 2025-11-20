# AI Cattle Monitoring Dashboard

A comprehensive cattle monitoring system with real-time health tracking, milk production management, and AI-powered analytics.

## Features

- 📊 **Dashboard Overview** - Real-time statistics and analytics
- 🥛 **Milk Yard** - Track and manage milk production records
- 🐄 **Cattle Management** - Complete cattle inventory management
- ❤️ **Health Monitoring** - Real-time health status and alerts
- 📱 **Responsive Design** - Works on all devices
- 🔄 **Collapsible Sidebar** - Sidebar can be toggled to not block content

## Tech Stack

### Frontend
- React 18
- React Router
- Axios for API calls
- Recharts for data visualization
- React Icons

### Backend
- Node.js
- Express.js
- MySQL (XAMPP)
- RESTful API

## Installation

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up MySQL Database:**
   - Make sure XAMPP is installed and MySQL is running
   - Open phpMyAdmin (usually at http://localhost/phpmyadmin)
   - Import or run the SQL schema file: `server/database/schema.sql`
   - Or manually create the database and tables using the SQL file

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=cattle_monitoring
   NODE_ENV=development
   ```
   
   **Note:** If your MySQL has a password, update `DB_PASSWORD` in the `.env` file.

## Running the Application

### Development Mode (Runs both frontend and backend)
```bash
npm run dev
```

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Cattle
- `GET /api/cattle` - Get all cattle
- `GET /api/cattle/:id` - Get single cattle
- `POST /api/cattle` - Create new cattle
- `PUT /api/cattle/:id` - Update cattle
- `DELETE /api/cattle/:id` - Delete cattle

### Milk Records
- `GET /api/milk` - Get all milk records
- `GET /api/milk/summary/daily` - Get daily milk summary
- `POST /api/milk` - Create new milk record

### Health
- `GET /api/health/summary` - Get health status summary
- `GET /api/health/alerts` - Get health alerts
- `PUT /api/health/:id` - Update health status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Project Structure

```
cattle/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── database/          # SQL schema files
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

## Key Features

### Collapsible Sidebar
The sidebar can be toggled to expand/collapse, preventing it from blocking the main content view. Click the toggle button (chevron icon) in the sidebar header.

### Real-time Updates
The dashboard automatically refreshes data every 30 seconds to show the latest information.

### Health Alerts
The system automatically detects and alerts on:
- Critical health status
- Abnormal temperature readings
- Abnormal heart rate
- AI-predicted health risks

## Adding Sample Data

### Option 1: Using Seed Script
```bash
npm run seed
```

### Option 2: Through the UI
1. Go to "Cattle" page and click "Add Cattle"
2. Fill in the form with cattle information
3. Go to "Milk Yard" page to add milk production records

## Troubleshooting

### MySQL Connection Issues
- Ensure XAMPP MySQL is running (check XAMPP Control Panel)
- Verify MySQL is accessible on port 3306 (default)
- Check database credentials in your `.env` file
- Make sure the database `cattle_monitoring` exists
- Run the SQL schema file if tables don't exist: `server/database/schema.sql`

### Port Already in Use
- Change the PORT in `.env` file
- Or stop the process using the port

### Frontend Not Connecting to Backend
- Ensure the backend is running on port 5000
- Check the proxy setting in `client/package.json`
- Verify CORS is enabled in the backend

## License

ISC

