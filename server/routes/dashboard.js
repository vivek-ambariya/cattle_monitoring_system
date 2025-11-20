const express = require('express');
const router = express.Router();
const Cattle = require('../models/Cattle');
const MilkRecord = require('../models/MilkRecord');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const allCattle = await Cattle.findAll();
    const totalCattle = allCattle.length;
    const healthyCattle = await Cattle.count({ healthStatus: 'healthy' });
    const sickCattle = await Cattle.count({ healthStatus: 'sick' });
    const criticalCattle = await Cattle.count({ healthStatus: 'critical' });
    
    // Today's milk production
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMilkRecords = await MilkRecord.findByDate(today);
    const todayMilkProduction = todayMilkRecords.reduce((sum, record) => sum + parseFloat(record.quantity), 0);
    
    // Recent activity - get last 5 updated cattle
    const allCattleSorted = allCattle.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const recentCattle = allCattleSorted.slice(0, 5).map(c => ({
      _id: c.id,
      tagId: c.tagId,
      name: c.name,
      breed: c.breed,
      age: c.age,
      weight: parseFloat(c.weight),
      healthStatus: c.healthStatus,
      location: c.location,
      temperature: parseFloat(c.temperature),
      heartRate: c.heartRate,
      activity: c.activity,
      updatedAt: c.updatedAt
    }));
    
    // Recent milk records
    const allMilkRecords = await MilkRecord.findAll();
    const recentMilkRecords = allMilkRecords.slice(0, 5).map(r => ({
      _id: r.id,
      cattleId: r.cattleId,
      tagId: r.tagId,
      quantity: parseFloat(r.quantity),
      quality: r.quality,
      timestamp: r.timestamp
    }));
    
    // Health alerts
    const allCattleForAlerts = await Cattle.findWithConditions({
      healthStatus: 'critical',
      aiHealthRisk: { $gt: 0.7 }
    }, 5);
    
    const healthAlerts = allCattleForAlerts.map(c => ({
      _id: c.id,
      tagId: c.tagId,
      name: c.name,
      healthStatus: c.healthStatus,
      temperature: parseFloat(c.temperature),
      heartRate: c.heartRate,
      aiPredictions: {
        healthRisk: parseFloat(c.aiHealthRisk),
        behaviorPattern: c.aiBehaviorPattern
      }
    }));
    
    res.json({
      overview: {
        totalCattle,
        healthyCattle,
        sickCattle,
        criticalCattle,
        todayMilkProduction
      },
      recentCattle,
      recentMilkRecords,
      healthAlerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

