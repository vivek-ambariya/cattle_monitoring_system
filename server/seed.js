const pool = require('./config/database');

const sampleCattle = [
  {
    tagId: 'CT001',
    name: 'Bella',
    breed: 'Holstein',
    age: 4,
    weight: 650,
    healthStatus: 'healthy',
    location: 'pasture',
    temperature: 38.5,
    heartRate: 60,
    activity: 'grazing',
    milkProduction: 25.5,
    aiHealthRisk: 0.1,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT002',
    name: 'Daisy',
    breed: 'Jersey',
    age: 3,
    weight: 450,
    healthStatus: 'healthy',
    location: 'barn',
    temperature: 38.6,
    heartRate: 62,
    activity: 'resting',
    milkProduction: 18.2,
    aiHealthRisk: 0.15,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT003',
    name: 'Molly',
    breed: 'Holstein',
    age: 5,
    weight: 700,
    healthStatus: 'sick',
    location: 'barn',
    temperature: 39.2,
    heartRate: 75,
    activity: 'resting',
    milkProduction: 12.5,
    aiHealthRisk: 0.6,
    aiBehaviorPattern: 'abnormal'
  },
  {
    tagId: 'CT004',
    name: 'Luna',
    breed: 'Angus',
    age: 2,
    weight: 380,
    healthStatus: 'healthy',
    location: 'pasture',
    temperature: 38.4,
    heartRate: 58,
    activity: 'grazing',
    milkProduction: 15.8,
    aiHealthRisk: 0.2,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT005',
    name: 'Ruby',
    breed: 'Holstein',
    age: 6,
    weight: 720,
    healthStatus: 'critical',
    location: 'barn',
    temperature: 40.1,
    heartRate: 85,
    activity: 'resting',
    milkProduction: 8.5,
    aiHealthRisk: 0.85,
    aiBehaviorPattern: 'critical'
  },
  {
    tagId: 'CT006',
    name: 'Maggie',
    breed: 'Jersey',
    age: 4,
    weight: 480,
    healthStatus: 'healthy',
    location: 'pasture',
    temperature: 38.3,
    heartRate: 59,
    activity: 'grazing',
    milkProduction: 20.3,
    aiHealthRisk: 0.12,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT007',
    name: 'Rosie',
    breed: 'Guernsey',
    age: 3,
    weight: 520,
    healthStatus: 'healthy',
    location: 'pasture',
    temperature: 38.5,
    heartRate: 61,
    activity: 'grazing',
    milkProduction: 22.1,
    aiHealthRisk: 0.08,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT008',
    name: 'Betty',
    breed: 'Holstein',
    age: 5,
    weight: 680,
    healthStatus: 'healthy',
    location: 'barn',
    temperature: 38.7,
    heartRate: 63,
    activity: 'feeding',
    milkProduction: 28.5,
    aiHealthRisk: 0.15,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT009',
    name: 'Grace',
    breed: 'Brown Swiss',
    age: 4,
    weight: 600,
    healthStatus: 'recovering',
    location: 'barn',
    temperature: 38.8,
    heartRate: 68,
    activity: 'resting',
    milkProduction: 19.5,
    aiHealthRisk: 0.35,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT010',
    name: 'Emma',
    breed: 'Jersey',
    age: 2,
    weight: 420,
    healthStatus: 'healthy',
    location: 'pasture',
    temperature: 38.4,
    heartRate: 58,
    activity: 'grazing',
    milkProduction: 16.8,
    aiHealthRisk: 0.18,
    aiBehaviorPattern: 'normal'
  },
  {
    tagId: 'CT011',
    name: 'Sophie',
    breed: 'Holstein',
    age: 7,
    weight: 750,
    healthStatus: 'sick',
    location: 'barn',
    temperature: 39.5,
    heartRate: 78,
    activity: 'resting',
    milkProduction: 10.2,
    aiHealthRisk: 0.65,
    aiBehaviorPattern: 'abnormal'
  },
  {
    tagId: 'CT012',
    name: 'Lily',
    breed: 'Ayrshire',
    age: 3,
    weight: 550,
    healthStatus: 'healthy',
    location: 'pasture',
    temperature: 38.5,
    heartRate: 60,
    activity: 'moving',
    milkProduction: 21.4,
    aiHealthRisk: 0.1,
    aiBehaviorPattern: 'normal'
  }
];

async function seed() {
  try {
    console.log('Starting database seed...');

    // Clear existing data
    await pool.execute('DELETE FROM milk_records');
    await pool.execute('DELETE FROM cattle');
    console.log('Cleared existing data');

    // Insert sample cattle
    for (const cattle of sampleCattle) {
      await pool.execute(
        `INSERT INTO cattle (tagId, name, breed, age, weight, healthStatus, location, 
         temperature, heartRate, activity, milkProduction, aiHealthRisk, aiBehaviorPattern)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cattle.tagId, cattle.name, cattle.breed, cattle.age, cattle.weight,
          cattle.healthStatus, cattle.location, cattle.temperature, cattle.heartRate,
          cattle.activity, cattle.milkProduction, cattle.aiHealthRisk, cattle.aiBehaviorPattern
        ]
      );
    }
    console.log(`Inserted ${sampleCattle.length} cattle records`);

    // Get inserted cattle IDs
    const [cattleRows] = await pool.execute('SELECT id, tagId FROM cattle');
    
    // Create sample milk records for the last 14 days (twice daily milking)
    const today = new Date();
    let milkRecordCount = 0;
    
    for (const cattle of cattleRows) {
      // Find the cattle data to get base production
      const cattleData = sampleCattle.find(c => c.tagId === cattle.tagId);
      const baseQuantity = cattleData ? cattleData.milkProduction : 15;
      
      // Create records for the last 14 days, twice daily (morning and evening)
      for (let j = 0; j < 14; j++) {
        const recordDate = new Date(today);
        recordDate.setDate(recordDate.getDate() - j);
        
        // Morning milking (6-8 AM)
        const morningDate = new Date(recordDate);
        morningDate.setHours(6 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);
        const morningQuantity = baseQuantity * 0.55 + (Math.random() * 3 - 1.5); // Slightly less in morning
        const morningQuality = ['excellent', 'good', 'good', 'good', 'fair'][Math.floor(Math.random() * 5)];
        
        await pool.execute(
          `INSERT INTO milk_records (cattleId, tagId, quantity, quality, temperature, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cattle.id,
            cattle.tagId,
            Math.max(0, Math.round(morningQuantity * 10) / 10),
            morningQuality,
            36.8 + (Math.random() * 0.4),
            morningDate
          ]
        );
        milkRecordCount++;
        
        // Evening milking (5-7 PM)
        const eveningDate = new Date(recordDate);
        eveningDate.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);
        const eveningQuantity = baseQuantity * 0.45 + (Math.random() * 3 - 1.5); // Slightly less in evening
        const eveningQuality = ['excellent', 'good', 'good', 'good', 'fair'][Math.floor(Math.random() * 5)];
        
        await pool.execute(
          `INSERT INTO milk_records (cattleId, tagId, quantity, quality, temperature, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cattle.id,
            cattle.tagId,
            Math.max(0, Math.round(eveningQuantity * 10) / 10),
            eveningQuality,
            37.2 + (Math.random() * 0.4),
            eveningDate
          ]
        );
        milkRecordCount++;
      }
    }

    console.log(`Inserted ${milkRecordCount} milk records`);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
