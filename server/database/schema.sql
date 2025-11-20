-- Create database (run this in MySQL/phpMyAdmin first)
CREATE DATABASE IF NOT EXISTS cattle_monitoring;
USE cattle_monitoring;

-- Cattle table
CREATE TABLE IF NOT EXISTS cattle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tagId VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  healthStatus ENUM('healthy', 'sick', 'critical', 'recovering') DEFAULT 'healthy',
  location VARCHAR(100) DEFAULT 'pasture',
  temperature DECIMAL(5, 2) DEFAULT 38.5,
  heartRate INT DEFAULT 60,
  activity ENUM('grazing', 'resting', 'moving', 'feeding') DEFAULT 'grazing',
  lastMilked DATETIME DEFAULT CURRENT_TIMESTAMP,
  milkProduction DECIMAL(10, 2) DEFAULT 0,
  aiHealthRisk DECIMAL(3, 2) DEFAULT 0,
  aiBehaviorPattern VARCHAR(50) DEFAULT 'normal',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tagId (tagId),
  INDEX idx_healthStatus (healthStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Milk records table
CREATE TABLE IF NOT EXISTS milk_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cattleId INT NOT NULL,
  tagId VARCHAR(50) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  quality ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'good',
  temperature DECIMAL(5, 2) DEFAULT 37,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  location VARCHAR(100) DEFAULT 'milk-yard',
  FOREIGN KEY (cattleId) REFERENCES cattle(id) ON DELETE CASCADE,
  INDEX idx_cattleId (cattleId),
  INDEX idx_timestamp (timestamp),
  INDEX idx_tagId (tagId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

