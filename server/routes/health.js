const express = require('express');
const router = express.Router();
const Cattle = require('../models/Cattle');

// Get health status summary
router.get('/summary', async (req, res) => {
  try {
    const allCattle = await Cattle.findAll();
    
    const summary = {
      total: allCattle.length,
      healthy: allCattle.filter(c => c.healthStatus === 'healthy').length,
      sick: allCattle.filter(c => c.healthStatus === 'sick').length,
      critical: allCattle.filter(c => c.healthStatus === 'critical').length,
      recovering: allCattle.filter(c => c.healthStatus === 'recovering').length,
      averageTemperature: allCattle.length > 0 
        ? allCattle.reduce((sum, c) => sum + parseFloat(c.temperature), 0) / allCattle.length 
        : 0,
      averageHeartRate: allCattle.length > 0
        ? allCattle.reduce((sum, c) => sum + c.heartRate, 0) / allCattle.length
        : 0
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cattle with health alerts
router.get('/alerts', async (req, res) => {
  try {
    const allCattle = await Cattle.findAll();
    
    const alerts = allCattle.filter(c => {
      const temp = parseFloat(c.temperature);
      const heartRate = c.heartRate;
      const healthRisk = parseFloat(c.aiHealthRisk);
      
      return c.healthStatus === 'critical' ||
             c.healthStatus === 'sick' ||
             temp > 40 ||
             temp < 37 ||
             heartRate > 80 ||
             heartRate < 50 ||
             healthRisk > 0.7;
    }).sort((a, b) => parseFloat(b.aiHealthRisk) - parseFloat(a.aiHealthRisk));
    
    // Transform to match expected format
    const transformed = alerts.map(c => ({
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
      aiPredictions: {
        healthRisk: parseFloat(c.aiHealthRisk),
        behaviorPattern: c.aiBehaviorPattern
      }
    }));
    
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update health status
router.put('/:id', async (req, res) => {
  try {
    const { healthStatus, temperature, heartRate, aiPredictions } = req.body;
    
    const updateData = {};
    if (healthStatus) updateData.healthStatus = healthStatus;
    if (temperature) updateData.temperature = temperature;
    if (heartRate) updateData.heartRate = heartRate;
    if (aiPredictions) {
      updateData.aiPredictions = aiPredictions;
    }
    
    const cattle = await Cattle.update(req.params.id, updateData);
    
    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }
    
    res.json({
      _id: cattle.id,
      ...cattle,
      weight: parseFloat(cattle.weight),
      temperature: parseFloat(cattle.temperature),
      milkProduction: parseFloat(cattle.milkProduction),
      aiPredictions: {
        healthRisk: parseFloat(cattle.aiHealthRisk),
        behaviorPattern: cattle.aiBehaviorPattern
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

