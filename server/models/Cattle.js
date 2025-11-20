const pool = require('../config/database');

class Cattle {
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM cattle ORDER BY createdAt DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM cattle WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByTagId(tagId) {
    const [rows] = await pool.execute(
      'SELECT * FROM cattle WHERE tagId = ?',
      [tagId]
    );
    return rows[0] || null;
  }

  static async create(data) {
    const {
      tagId, name, breed, age, weight, healthStatus = 'healthy',
      location = 'pasture', temperature = 38.5, heartRate = 60,
      activity = 'grazing', milkProduction = 0,
      aiHealthRisk = 0, aiBehaviorPattern = 'normal'
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO cattle (tagId, name, breed, age, weight, healthStatus, location, 
       temperature, heartRate, activity, milkProduction, aiHealthRisk, aiBehaviorPattern)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tagId, name, breed, age, weight, healthStatus, location, 
       temperature, heartRate, activity, milkProduction, aiHealthRisk, aiBehaviorPattern]
    );

    return await this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (key === 'aiPredictions') {
        if (data[key] && data[key].healthRisk !== undefined) {
          fields.push('aiHealthRisk = ?');
          values.push(data[key].healthRisk);
        }
        if (data[key] && data[key].behaviorPattern !== undefined) {
          fields.push('aiBehaviorPattern = ?');
          values.push(data[key].behaviorPattern);
        }
      } else if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        // Map lastMilked to proper format
        if (key === 'lastMilked' && data[key] instanceof Date) {
          fields.push('lastMilked = ?');
          values.push(data[key]);
        } else {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      }
    });

    if (fields.length === 0) return await this.findById(id);

    fields.push('updatedAt = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE cattle SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM cattle WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async count(conditions = {}) {
    let query = 'SELECT COUNT(*) as count FROM cattle';
    const values = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].count;
  }

  static async findWithConditions(conditions, limit = null) {
    let query = 'SELECT * FROM cattle';
    const values = [];
    const whereConditions = [];

    if (conditions.healthStatus) {
      whereConditions.push('healthStatus = ?');
      values.push(conditions.healthStatus);
    }

    if (conditions.temperature) {
      if (conditions.temperature.$gt) {
        whereConditions.push('temperature > ?');
        values.push(conditions.temperature.$gt);
      }
      if (conditions.temperature.$lt) {
        whereConditions.push('temperature < ?');
        values.push(conditions.temperature.$lt);
      }
    }

    if (conditions.heartRate) {
      if (conditions.heartRate.$gt) {
        whereConditions.push('heartRate > ?');
        values.push(conditions.heartRate.$gt);
      }
      if (conditions.heartRate.$lt) {
        whereConditions.push('heartRate < ?');
        values.push(conditions.heartRate.$lt);
      }
    }

    if (conditions.aiHealthRisk) {
      if (conditions.aiHealthRisk.$gt) {
        whereConditions.push('aiHealthRisk > ?');
        values.push(conditions.aiHealthRisk.$gt);
      }
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' OR ');
    }

    query += ' ORDER BY aiHealthRisk DESC';

    if (limit) {
      query += ' LIMIT ?';
      values.push(limit);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}

module.exports = Cattle;
