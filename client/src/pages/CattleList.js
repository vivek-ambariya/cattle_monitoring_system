import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiPlus, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import './CattleList.css';

const CattleList = () => {
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    tagId: '',
    name: '',
    breed: '',
    age: '',
    weight: '',
    healthStatus: 'healthy',
    location: 'pasture'
  });

  useEffect(() => {
    fetchCattle();
  }, []);

  const fetchCattle = async () => {
    try {
      const response = await axios.get('/api/cattle');
      setCattle(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cattle:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/cattle', formData);
      setShowAddForm(false);
      setFormData({
        tagId: '',
        name: '',
        breed: '',
        age: '',
        weight: '',
        healthStatus: 'healthy',
        location: 'pasture'
      });
      fetchCattle();
    } catch (error) {
      alert('Error adding cattle: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cattle record?')) {
      try {
        await axios.delete(`/api/cattle/${id}`);
        fetchCattle();
      } catch (error) {
        alert('Error deleting cattle: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const getHealthStatusColor = (status) => {
    const colors = {
      healthy: '#10b981',
      sick: '#f59e0b',
      critical: '#ef4444',
      recovering: '#3b82f6'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="cattle-list">
      <div className="page-header">
        <div>
          <h1>Cattle Management</h1>
          <p className="subtitle">Manage your cattle inventory</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchCattle}>
            <FiRefreshCw /> Refresh
          </button>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <FiPlus /> Add Cattle
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-form-card">
          <h3>Add New Cattle</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tag ID *</label>
                <input
                  type="text"
                  value={formData.tagId}
                  onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Breed *</label>
                <select
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  required
                >
                  <option value="">Select Breed</option>
                  <option value="Holstein">Holstein</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Guernsey">Guernsey</option>
                  <option value="Brown Swiss">Brown Swiss</option>
                  <option value="Ayrshire">Ayrshire</option>
                  <option value="Angus">Angus</option>
                  <option value="Hereford">Hereford</option>
                  <option value="Charolais">Charolais</option>
                  <option value="Simmental">Simmental</option>
                  <option value="Limousin">Limousin</option>
                  <option value="Brahman">Brahman</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age (years) *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Health Status</label>
                <select
                  value={formData.healthStatus}
                  onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                >
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="critical">Critical</option>
                  <option value="recovering">Recovering</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">Add Cattle</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading cattle data...</div>
      ) : (
        <div className="cattle-grid">
          {cattle.length > 0 ? (
            cattle.map((item) => (
              <div 
                key={item._id} 
                className={`cattle-card ${item.activity === 'grazing' ? 'grazing' : ''}`}
              >
                <div className="cattle-header">
                  <div className="cattle-info">
                    <h3>{item.name}</h3>
                    <p className="tag-id">#{item.tagId}</p>
                  </div>
                  <span
                    className="health-badge"
                    style={{ backgroundColor: `${getHealthStatusColor(item.healthStatus)}20`, color: getHealthStatusColor(item.healthStatus) }}
                  >
                    {item.healthStatus}
                  </span>
                </div>
                <div className="cattle-details">
                  <div className="detail-item">
                    <span className="detail-label">Breed:</span>
                    <span className="detail-value">{item.breed}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{item.age} years</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Weight:</span>
                    <span className="detail-value">{item.weight} kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{item.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Temperature:</span>
                    <span className="detail-value">{item.temperature}°C</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Activity:</span>
                    <span className="detail-value">{item.activity || 'N/A'}</span>
                  </div>
                </div>
                <div className="cattle-actions">
                  <button className="action-btn edit" onClick={() => alert('Edit functionality coming soon')}>
                    <FiEdit /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(item._id)}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <FiUsers size={48} />
              <p>No cattle records found</p>
              <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                Add Your First Cattle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CattleList;

