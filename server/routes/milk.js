const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const Cattle = require('../models/Cattle');

// Get all milk records
router.get('/', async (req, res) => {
  try {
    const records = await MilkRecord.findAll();
    res.json(records.map(r => ({
      _id: r.id,
      cattleId: r.cattleId,
      tagId: r.tagId,
      quantity: parseFloat(r.quantity),
      quality: r.quality,
      temperature: parseFloat(r.temperature),
      timestamp: r.timestamp,
      location: r.location
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get milk records by date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    const records = await MilkRecord.findByDateRange(new Date(startDate), new Date(endDate));
    res.json(records.map(r => ({
      _id: r.id,
      cattleId: r.cattleId,
      tagId: r.tagId,
      quantity: parseFloat(r.quantity),
      quality: r.quality,
      temperature: parseFloat(r.temperature),
      timestamp: r.timestamp,
      location: r.location
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new milk record
router.post('/', async (req, res) => {
  try {
    const { tagId, quantity, quality, temperature } = req.body;
    
    // Find cattle by tagId
    const cattle = await Cattle.findByTagId(tagId);
    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }
    
    const milkRecord = await MilkRecord.create({
      cattleId: cattle.id,
      tagId,
      quantity,
      quality: quality || 'good',
      temperature: temperature || 37
    });
    
    // Update cattle's last milked time and production
    await Cattle.update(cattle.id, {
      lastMilked: new Date(),
      milkProduction: parseFloat(cattle.milkProduction || 0) + parseFloat(quantity)
    });
    
    res.status(201).json({
      _id: milkRecord.id,
      cattleId: milkRecord.cattleId,
      tagId: milkRecord.tagId,
      quantity: parseFloat(milkRecord.quantity),
      quality: milkRecord.quality,
      temperature: parseFloat(milkRecord.temperature),
      timestamp: milkRecord.timestamp,
      location: milkRecord.location
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update milk record
router.put('/:id', async (req, res) => {
  try {
    const { quantity, quality, temperature } = req.body;
    const updates = {};

    if (quantity !== undefined) updates.quantity = quantity;
    if (quality) updates.quality = quality;
    if (temperature !== undefined) updates.temperature = temperature;

    const updatedRecord = await MilkRecord.update(req.params.id, updates);
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Milk record not found' });
    }

    res.json({
      _id: updatedRecord.id,
      cattleId: updatedRecord.cattleId,
      tagId: updatedRecord.tagId,
      quantity: parseFloat(updatedRecord.quantity),
      quality: updatedRecord.quality,
      temperature: parseFloat(updatedRecord.temperature),
      timestamp: updatedRecord.timestamp,
      location: updatedRecord.location
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get daily milk production summary
router.get('/summary/daily', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const records = await MilkRecord.findByDate(today);
    
    const totalQuantity = records.reduce((sum, record) => sum + parseFloat(record.quantity), 0);
    const averageQuality = records.length > 0 
      ? records.reduce((sum, record) => {
          const qualityMap = { excellent: 4, good: 3, fair: 2, poor: 1 };
          return sum + (qualityMap[record.quality] || 0);
        }, 0) / records.length 
      : 0;
    
    res.json({
      date: today.toISOString().split('T')[0],
      totalQuantity,
      recordCount: records.length,
      averageQuality: averageQuality > 3 ? 'excellent' : averageQuality > 2 ? 'good' : averageQuality > 1 ? 'fair' : 'poor'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

