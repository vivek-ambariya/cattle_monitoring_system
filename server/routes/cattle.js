const express = require('express');
const router = express.Router();
const Cattle = require('../models/Cattle');

// Get all cattle
router.get('/', async (req, res) => {
  try {
    const cattle = await Cattle.findAll();
    // Transform to match expected format
    const transformed = cattle.map(c => ({
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
      lastMilked: c.lastMilked,
      milkProduction: parseFloat(c.milkProduction),
      aiPredictions: {
        healthRisk: parseFloat(c.aiHealthRisk),
        behaviorPattern: c.aiBehaviorPattern
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single cattle by ID
router.get('/:id', async (req, res) => {
  try {
    const cattle = await Cattle.findById(req.params.id);
    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }
    // Transform to match expected format
    res.json({
      _id: cattle.id,
      tagId: cattle.tagId,
      name: cattle.name,
      breed: cattle.breed,
      age: cattle.age,
      weight: parseFloat(cattle.weight),
      healthStatus: cattle.healthStatus,
      location: cattle.location,
      temperature: parseFloat(cattle.temperature),
      heartRate: cattle.heartRate,
      activity: cattle.activity,
      lastMilked: cattle.lastMilked,
      milkProduction: parseFloat(cattle.milkProduction),
      aiPredictions: {
        healthRisk: parseFloat(cattle.aiHealthRisk),
        behaviorPattern: cattle.aiBehaviorPattern
      },
      createdAt: cattle.createdAt,
      updatedAt: cattle.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new cattle
router.post('/', async (req, res) => {
  try {
    const data = {
      ...req.body,
      aiHealthRisk: req.body.aiPredictions?.healthRisk || 0,
      aiBehaviorPattern: req.body.aiPredictions?.behaviorPattern || 'normal'
    };
    const cattle = await Cattle.create(data);
    res.status(201).json({
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

// Update cattle
router.put('/:id', async (req, res) => {
  try {
    const cattle = await Cattle.update(req.params.id, req.body);
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

// Delete cattle
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Cattle.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Cattle not found' });
    }
    res.json({ message: 'Cattle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

