const mysql = require('mysql2/promise');
require('dotenv').config();

// Railway MySQL connection - use Railway variables if available, otherwise use local .env
const dbConfig = {
  host: process.env.RAILWAY_TCP_PROXY_DOMAIN || process.env.DB_HOST || 'localhost',
  port: process.env.RAILWAY_TCP_PROXY_PORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'cattle_monitoring',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('MySQL connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err.message);
  });

module.exports = pool;

