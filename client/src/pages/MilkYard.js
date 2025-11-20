import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDroplet, FiPlus, FiFilter, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MilkYard.css';

const MilkYard = () => {
  const [milkRecords, setMilkRecords] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    tagId: '',
    quantity: '',
    quality: 'good',
    temperature: '37'
  });

  useEffect(() => {
    fetchMilkRecords();
    fetchDailySummary();
    const interval = setInterval(() => {
      fetchMilkRecords();
      fetchDailySummary();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMilkRecords = async () => {
    try {
      const response = await axios.get('/api/milk');
      setMilkRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching milk records:', error);
      setLoading(false);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const response = await axios.get('/api/milk/summary/daily');
      setDailySummary(response.data);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/milk', formData);
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

  return (
    <div className="milk-yard">
      <div className="page-header">
        <div>
          <h1>Milk Yard</h1>
          <p className="subtitle">Track and manage milk production</p>
        </div>
        <div className="header-actions">
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
                  value={formData.tagId}
                  onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                  required
                />
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
                </tr>
              </thead>
              <tbody>
                {milkRecords.length > 0 ? (
                  milkRecords.slice(0, 20).map((record) => (
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No records found</td>
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

