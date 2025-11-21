# 🐄 AI Cattle Monitoring Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)

**A comprehensive cattle monitoring system with real-time health tracking, milk production management, and AI-powered analytics for efficient dairy farm management.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Export Functionality](#-export-functionality)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

The AI Cattle Monitoring Dashboard is a full-stack web application designed to help dairy farmers efficiently manage their cattle operations. It provides real-time monitoring of cattle health, milk production tracking, and intelligent analytics to optimize farm productivity.

### Key Highlights

- 📊 **Real-time Dashboard** - Comprehensive overview of cattle status and farm metrics
- 🥛 **Milk Production Tracking** - Detailed records with quality analysis
- ❤️ **Health Monitoring** - AI-powered health risk assessment and alerts
- 🐄 **Cattle Management** - Complete inventory management system
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🔄 **Collapsible Sidebar** - Optimized UI that doesn't block content
- 📥 **Data Export** - Export milk and health data to CSV format

---

## ✨ Features

### Dashboard Overview
- Real-time statistics and analytics
- Visual charts for milk production trends
- Health status distribution
- Recent activity feed
- Health alerts and notifications

### Milk Yard Management
- Track daily milk production
- Record milk quality (Excellent, Good, Fair, Poor)
- Monitor milk temperature
- Daily production summaries
- Export milk records to CSV

### Cattle Management
- Add, view, update, and delete cattle records
- Track cattle information (Tag ID, Name, Breed, Age, Weight)
- Monitor location and activity status
- Visual indicators for grazing cattle (green background)
- Breed selection dropdown with 12+ common breeds

### Health Monitoring
- Real-time health status tracking
- AI-powered health risk assessment
- Temperature and heart rate monitoring
- Health alerts for critical cases
- Export health data to CSV
- Vital signs trend visualization

### User Interface
- Modern, clean design
- Collapsible sidebar navigation
- Responsive layout for all devices
- Intuitive user experience
- Color-coded status indicators

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database (XAMPP)
- **mysql2** - MySQL driver

### Development Tools
- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple scripts
- **dotenv** - Environment variables

---

## 📸 Screenshots

### Dashboard View
The main dashboard provides a comprehensive overview of your cattle farm with real-time statistics, charts, and activity feeds.

### Milk Yard
Track and manage milk production with detailed records, quality ratings, and production trends.

### Cattle Management
Manage your cattle inventory with an intuitive interface featuring breed selection and health status indicators.

### Health Monitoring
Monitor cattle health with AI-powered risk assessment, alerts, and vital signs tracking.

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **XAMPP** (for MySQL) - [Download](https://www.apachefriends.org/)
- **Git** (for cloning) - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vivek-ambariya/cattle_monitoring_system.git
cd cattle_monitoring_system
```

### 2. Install Dependencies

Install both backend and frontend dependencies:

```bash
npm run install-all
```

Or install separately:

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### 3. Set Up MySQL Database

1. **Start XAMPP MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL service

2. **Create Database:**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Go to SQL tab
   - Copy and paste the contents of `server/database/schema.sql`
   - Click "Go" to execute

   Or run the SQL file directly:
   ```sql
   -- The schema file will create:
   -- Database: cattle_monitoring
   -- Tables: cattle, milk_records
   ```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cattle_monitoring
NODE_ENV=development
```

### Frontend Environment Variables

When running the React app separately or deploying to Vercel, create a `.env` file inside the `client/` folder (or add the variable in Vercel → Project Settings → Environment Variables):

```env
REACT_APP_API_URL=https://your-backend-domain.com
```

> For local development you can set `REACT_APP_API_URL=http://localhost:5001`. Vercel should point to your hosted backend URL.

**Note:** If your MySQL has a password, update `DB_PASSWORD` in the `.env` file.

### 5. (Optional) Seed Sample Data

Populate the database with sample cattle and milk records:

```bash
npm run seed
```

This will create:
- 12 sample cattle records
- 336 milk records (14 days × 2 milkings per day)

---

## ⚙️ Configuration

### Database Configuration

Edit `server/config/database.js` or update `.env` file:

```javascript
DB_HOST=localhost      // MySQL host
DB_USER=root           // MySQL username
DB_PASSWORD=           // MySQL password (if set)
DB_NAME=cattle_monitoring  // Database name
```

### Port Configuration

Default ports:
- **Backend:** 5001
- **Frontend:** 3000

To change ports, update:
- Backend: `PORT` in `.env` file
- Frontend: Update proxy in `client/package.json`

---

## 🎮 Usage

### Development Mode

Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5001
- Frontend React app on http://localhost:3000

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Application Features

1. **Dashboard** - View overview statistics and charts
2. **Milk Yard** - Add and track milk production records
3. **Cattle** - Manage cattle inventory
4. **Health Monitoring** - Monitor cattle health status

---

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Cattle Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cattle` | Get all cattle |
| GET | `/api/cattle/:id` | Get single cattle by ID |
| POST | `/api/cattle` | Create new cattle |
| PUT | `/api/cattle/:id` | Update cattle |
| DELETE | `/api/cattle/:id` | Delete cattle |

**Example Request:**
```javascript
// Create new cattle
POST /api/cattle
{
  "tagId": "CT013",
  "name": "Bella",
  "breed": "Holstein",
  "age": 4,
  "weight": 650,
  "healthStatus": "healthy",
  "location": "pasture"
}
```

### Milk Records Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/milk` | Get all milk records |
| GET | `/api/milk/summary/daily` | Get daily milk summary |
| POST | `/api/milk` | Create new milk record |

**Example Request:**
```javascript
// Create milk record
POST /api/milk
{
  "tagId": "CT001",
  "quantity": 25.5,
  "quality": "excellent",
  "temperature": 37.2
}
```

### Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health/summary` | Get health status summary |
| GET | `/api/health/alerts` | Get health alerts |
| PUT | `/api/health/:id` | Update health status |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

---

## 📁 Project Structure

```
cattle_monitoring_system/
├── client/                 # React frontend
│   ├── public/            # Public assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Sidebar.js
│   │   │   └── Sidebar.css
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── MilkYard.js
│   │   │   ├── CattleList.js
│   │   │   └── HealthMonitoring.js
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   │   └── database.js    # MySQL connection
│   ├── database/          # Database files
│   │   └── schema.sql     # Database schema
│   ├── models/             # Data models
│   │   ├── Cattle.js
│   │   └── MilkRecord.js
│   ├── routes/             # API routes
│   │   ├── cattle.js
│   │   ├── milk.js
│   │   ├── health.js
│   │   └── dashboard.js
│   ├── seed.js            # Seed script
│   └── index.js           # Server entry point
├── .env                   # Environment variables (not in repo)
├── .gitignore
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### Cattle Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| tagId | VARCHAR(50) | Unique tag identifier |
| name | VARCHAR(100) | Cattle name |
| breed | VARCHAR(100) | Breed type |
| age | INT | Age in years |
| weight | DECIMAL(10,2) | Weight in kg |
| healthStatus | ENUM | healthy, sick, critical, recovering |
| location | VARCHAR(100) | Current location |
| temperature | DECIMAL(5,2) | Body temperature |
| heartRate | INT | Heart rate (bpm) |
| activity | ENUM | grazing, resting, moving, feeding |
| milkProduction | DECIMAL(10,2) | Daily milk production |
| aiHealthRisk | DECIMAL(3,2) | AI health risk score |
| aiBehaviorPattern | VARCHAR(50) | AI behavior pattern |
| createdAt | DATETIME | Creation timestamp |
| updatedAt | DATETIME | Last update timestamp |

### Milk Records Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| cattleId | INT | Foreign key to cattle |
| tagId | VARCHAR(50) | Cattle tag ID |
| quantity | DECIMAL(10,2) | Milk quantity in liters |
| quality | ENUM | excellent, good, fair, poor |
| temperature | DECIMAL(5,2) | Milk temperature |
| timestamp | DATETIME | Record timestamp |
| location | VARCHAR(100) | Milking location |

---

## 📥 Export Functionality

### Export Milk Records

1. Navigate to **Milk Yard** page
2. Click **"Export"** button
3. CSV file will be downloaded with:
   - Time, Tag ID, Cattle Name, Quantity, Quality, Temperature

### Export Health Data

1. Navigate to **Health Monitoring** page
2. Click **"Export"** button
3. CSV file will be downloaded with:
   - Tag ID, Name, Breed, Health Status, Temperature, Heart Rate, Activity, Location, AI Health Risk, AI Behavior Pattern

---

## 🐛 Troubleshooting

### MySQL Connection Issues

**Problem:** "MySQL connection error"

**Solutions:**
- Ensure XAMPP MySQL is running
- Verify database `cattle_monitoring` exists
- Check credentials in `.env` file
- Verify MySQL port (default: 3306)

### Port Already in Use

**Problem:** "EADDRINUSE: address already in use"

**Solutions:**
- Change `PORT` in `.env` file to another port (e.g., 5002)
- Update proxy in `client/package.json` to match
- Kill process using the port: `lsof -ti:5001 | xargs kill -9`

### Frontend Not Connecting to Backend

**Problem:** API calls failing

**Solutions:**
- Ensure backend is running on correct port
- Check `proxy` setting in `client/package.json`
- Verify CORS is enabled in backend
- Check browser console for errors

### Database Tables Missing

**Problem:** "Table doesn't exist"

**Solutions:**
- Run `server/database/schema.sql` in phpMyAdmin
- Verify database name matches `.env` configuration
- Check table names are correct

### npm Install Errors

**Problem:** Dependency installation fails

**Solutions:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (requires v18+)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Ensure all tests pass

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Vivek Ambariya**

- GitHub: [@vivek-ambariya](https://github.com/vivek-ambariya)
- Repository: [cattle_monitoring_system](https://github.com/vivek-ambariya/cattle_monitoring_system)

---

## 🙏 Acknowledgments

- React community for excellent documentation
- Express.js for the robust backend framework
- MySQL for reliable data storage
- All open-source contributors whose packages made this project possible

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](https://github.com/vivek-ambariya/cattle_monitoring_system/issues)
3. Create a new issue with detailed information

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

Made with ❤️ for dairy farmers

</div>
