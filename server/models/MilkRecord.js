const pool = require('../config/database');

class MilkRecord {
  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT mr.*, c.name, c.breed 
       FROM milk_records mr
       LEFT JOIN cattle c ON mr.cattleId = c.id
       ORDER BY mr.timestamp DESC`
    );
    return rows.map(row => ({
      ...row,
      cattleId: row.cattleId ? {
        _id: row.cattleId,
        tagId: row.tagId,
        name: row.name,
        breed: row.breed
      } : null
    }));
  }

  static async findByDateRange(startDate, endDate) {
    const [rows] = await pool.execute(
      `SELECT mr.*, c.name, c.breed 
       FROM milk_records mr
       LEFT JOIN cattle c ON mr.cattleId = c.id
       WHERE mr.timestamp >= ? AND mr.timestamp <= ?
       ORDER BY mr.timestamp DESC`,
      [startDate, endDate]
    );
    return rows.map(row => ({
      ...row,
      cattleId: row.cattleId ? {
        _id: row.cattleId,
        tagId: row.tagId,
        name: row.name,
        breed: row.breed
      } : null
    }));
  }

  static async create(data) {
    const { cattleId, tagId, quantity, quality = 'good', temperature = 37, location = 'milk-yard' } = data;

    const [result] = await pool.execute(
      `INSERT INTO milk_records (cattleId, tagId, quantity, quality, temperature, location)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cattleId, tagId, quantity, quality, temperature, location]
    );

    // Get the created record with cattle info
    const [rows] = await pool.execute(
      `SELECT mr.*, c.name, c.breed 
       FROM milk_records mr
       LEFT JOIN cattle c ON mr.cattleId = c.id
       WHERE mr.id = ?`,
      [result.insertId]
    );

    return {
      ...rows[0],
      cattleId: rows[0].cattleId ? {
        _id: rows[0].cattleId,
        tagId: rows[0].tagId,
        name: rows[0].name,
        breed: rows[0].breed
      } : null
    };
  }

  static async findByDate(date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const [rows] = await pool.execute(
      `SELECT * FROM milk_records 
       WHERE timestamp >= ? AND timestamp < ?`,
      [startDate, endDate]
    );
    return rows;
  }
}

module.exports = MilkRecord;
