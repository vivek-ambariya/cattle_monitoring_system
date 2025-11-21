import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { FiDroplet, FiPlus, FiRefreshCw, FiDownload, FiEdit } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MilkYard.css';

const MilkYard = () => {
  const [milkRecords, setMilkRecords] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cattleOptions, setCattleOptions] = useState([]);
  const [formData, setFormData] = useState({
    tagId: '',
    quantity: '',
    quality: 'good',
    temperature: '37'
  });
  const [editFormData, setEditFormData] = useState({
    quantity: '',
    quality: 'good',
    temperature: '37'
  });

  useEffect(() => {
    fetchMilkRecords();
    fetchDailySummary();
    fetchCattleOptions();
    const interval = setInterval(() => {
      fetchMilkRecords();
      fetchDailySummary();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMilkRecords = async () => {
    try {
      const response = await api.get('/api/milk');
      setMilkRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching milk records:', error);
      setLoading(false);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const response = await api.get('/api/milk/summary/daily');
      setDailySummary(response.data);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  const fetchCattleOptions = async () => {
    try {
      const response = await api.get('/api/cattle');
      setCattleOptions(response.data);
    } catch (error) {
      console.error('Error fetching cattle for suggestions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/milk', {
        ...formData,
        quantity: Number(formData.quantity),
        temperature: Number(formData.temperature)
      });
      setShowAddForm(false);
      setFormData({ tagId: '', quantity: '', quality: 'good', temperature: '37' });
      fetchMilkRecords();
      fetchDailySummary();
    } catch (error) {
      alert('Error adding milk record: ' + (error.response?.data?.error || error.message));
    }
  };

  const chartData = milkRecords.slice(0, 7).reverse().map(record => ({
    name: new Date(record.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    quantity: record.quantity,
    quality: record.quality === 'excellent' ? 4 : record.quality === 'good' ? 3 : record.quality === 'fair' ? 2 : 1
  }));

  const exportToCSV = () => {
    const headers = ['Time', 'Tag ID', 'Cattle Name', 'Quantity (L)', 'Quality', 'Temperature (°C)'];
    const csvData = milkRecords.map(record => [
      new Date(record.timestamp).toLocaleString(),
      record.tagId,
      record.cattleId?.name || 'N/A',
      record.quantity,
      record.quality,
      record.temperature
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `milk_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = milkRecords.filter((record) => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      record.tagId?.toLowerCase().includes(query) ||
      record.cattleId?.name?.toLowerCase().includes(query)
    );
  });

  const handleOpenEdit = (record) => {
    setEditRecord(record);
    setEditFormData({
      quantity: record.quantity,
      quality: record.quality,
      temperature: record.temperature
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRecord) return;
    try {
      await api.put(`/api/milk/${editRecord._id}`, {
        quantity: Number(editFormData.quantity),
        quality: editFormData.quality,
        temperature: Number(editFormData.temperature)
      });
      setEditRecord(null);
      fetchMilkRecords();
      fetchDailySummary();
    } catch (error) {
      alert('Error updating milk record: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="milk-yard">
      <div className="page-header">
        <div>
          <h1>Milk Yard</h1>
          <p className="subtitle">Track and manage milk production</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search by tag or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-secondary" onClick={fetchMilkRecords}>
            <FiRefreshCw /> Refresh
          </button>
          <button className="btn-secondary" onClick={exportToCSV}>
            <FiDownload /> Export
          </button>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <FiPlus /> Add Record
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-form-card">
          <h3>Add Milk Record</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tag ID</label>
                <input
                  type="text"
                  list="tag-options"
                  value={formData.tagId}
                  onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                  required
                />
                <datalist id="tag-options">
                  {cattleOptions.map((cattle) => (
                    <option key={cattle._id} value={cattle.tagId}>
                      {cattle.name}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label>Quantity (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quality</label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">Add Record</button>
            </div>
          </form>
        </div>
      )}

      {dailySummary && (
        <div className="summary-cards">
          <div className="summary-card">
            <FiDroplet className="summary-icon" />
            <div>
              <h3>{dailySummary.totalQuantity.toFixed(1)}L</h3>
              <p>Today's Production</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div>
              <h3>{dailySummary.recordCount}</h3>
              <p>Total Records</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⭐</div>
            <div>
              <h3>{dailySummary.averageQuality}</h3>
              <p>Average Quality</p>
            </div>
          </div>
        </div>
      )}

      <div className="chart-section">
        <div className="chart-card">
          <h3>Recent Milk Production</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="records-table-card">
        <h3>Recent Records</h3>
        {editRecord && (
          <div className="add-form-card">
            <h3>Edit Record (#{editRecord.tagId})</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity (Liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editFormData.quantity}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quality</label>
                  <select
                    value={editFormData.quality}
                    onChange={(e) => setEditFormData({ ...editFormData, quality: e.target.value })}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editFormData.temperature}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, temperature: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditRecord(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        )}
        {loading ? (
          <div className="loading">Loading records...</div>
        ) : (
          <div className="table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Tag ID</th>
                  <th>Cattle Name</th>
                  <th>Quantity (L)</th>
                  <th>Quality</th>
                  <th>Temperature</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.slice(0, 20).map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.timestamp).toLocaleString()}</td>
                      <td>{record.tagId}</td>
                      <td>{record.cattleId?.name || 'N/A'}</td>
                      <td>{record.quantity}</td>
                      <td>
                        <span className={`quality-badge quality-${record.quality}`}>
                          {record.quality}
                        </span>
                      </td>
                      <td>{record.temperature}°C</td>
                      <td>
                        <button className="action-btn edit" onClick={() => handleOpenEdit(record)}>
                          <FiEdit /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilkYard;

