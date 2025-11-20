const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cattle', require('./routes/cattle'));
app.use('/api/milk', require('./routes/milk'));
app.use('/api/health', require('./routes/health'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Cattle Monitoring API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

