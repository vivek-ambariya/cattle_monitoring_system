import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiActivity, FiAlertCircle, FiHeart, FiThermometer, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './HealthMonitoring.css';

const HealthMonitoring = () => {
  const [healthSummary, setHealthSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = async () => {
    try {
      const [summaryRes, alertsRes] = await Promise.all([
        axios.get('/api/health/summary'),
        axios.get('/api/health/alerts')
      ]);
      setHealthSummary(summaryRes.data);
      setAlerts(alertsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading health data...</div>;
  }

  const chartData = [
    { name: 'Mon', temp: 38.5, heartRate: 60 },
    { name: 'Tue', temp: 38.7, heartRate: 62 },
    { name: 'Wed', temp: 38.4, heartRate: 58 },
    { name: 'Thu', temp: 38.6, heartRate: 61 },
    { name: 'Fri', temp: 38.5, heartRate: 60 },
    { name: 'Sat', temp: 38.8, heartRate: 63 },
    { name: 'Sun', temp: 38.5, heartRate: 60 },
  ];

  const exportToCSV = async () => {
    try {
      // Fetch all cattle data for export
      const cattleResponse = await axios.get('/api/cattle');
      const allCattle = cattleResponse.data;

      const headers = ['Tag ID', 'Name', 'Breed', 'Health Status', 'Temperature (°C)', 'Heart Rate (bpm)', 'Activity', 'Location', 'AI Health Risk', 'AI Behavior Pattern'];
      const csvData = allCattle.map(cattle => [
        cattle.tagId,
        cattle.name,
        cattle.breed,
        cattle.healthStatus,
        cattle.temperature,
        cattle.heartRate,
        cattle.activity || 'N/A',
        cattle.location,
        cattle.aiPredictions?.healthRisk || 0,
        cattle.aiPredictions?.behaviorPattern || 'normal'
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `health_status_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting health data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  return (
    <div className="health-monitoring">
      <div className="page-header">
        <div>
          <h1>Health Monitoring</h1>
          <p className="subtitle">Real-time health status and alerts</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchHealthData}>
            <FiRefreshCw /> Refresh
          </button>
          <button className="btn-secondary" onClick={exportToCSV}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {healthSummary && (
        <div className="health-stats-grid">
          <div className="health-stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#10b98120', color: '#10b981' }}>
              <FiActivity />
            </div>
            <div className="stat-content">
              <h3>{healthSummary.healthy || 0}</h3>
              <p>Healthy Cattle</p>
              <span className="stat-percentage">
                {Math.round(((healthSummary.healthy || 0) / (healthSummary.total || 1)) * 100)}%
              </span>
            </div>
          </div>

          <div className="health-stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <h3>{healthSummary.sick || 0}</h3>
              <p>Sick Cattle</p>
              <span className="stat-percentage">
                {Math.round(((healthSummary.sick || 0) / (healthSummary.total || 1)) * 100)}%
              </span>
            </div>
          </div>

          <div className="health-stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#ef444420', color: '#ef4444' }}>
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <h3>{healthSummary.critical || 0}</h3>
              <p>Critical Cases</p>
              <span className="stat-percentage urgent">Urgent</span>
            </div>
          </div>

          <div className="health-stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#3b82f620', color: '#3b82f6' }}>
              <FiActivity />
            </div>
            <div className="stat-content">
              <h3>{healthSummary.recovering || 0}</h3>
              <p>Recovering</p>
              <span className="stat-percentage">
                {Math.round(((healthSummary.recovering || 0) / (healthSummary.total || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="metrics-section">
        <div className="metrics-card">
          <div className="metric-header">
            <FiThermometer />
            <h3>Average Temperature</h3>
          </div>
          <div className="metric-value">
            {healthSummary?.averageTemperature?.toFixed(1) || '0.0'}°C
          </div>
          <div className="metric-status normal">Normal Range: 37-39°C</div>
        </div>

        <div className="metrics-card">
          <div className="metric-header">
            <FiHeart />
            <h3>Average Heart Rate</h3>
          </div>
          <div className="metric-value">
            {healthSummary?.averageHeartRate?.toFixed(0) || '0'} bpm
          </div>
          <div className="metric-status normal">Normal Range: 50-80 bpm</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Vital Signs Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={2} name="Heart Rate (bpm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="alerts-section">
        <h2>Health Alerts</h2>
        {alerts.length > 0 ? (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert._id} className={`alert-card ${alert.healthStatus}`}>
                <div className="alert-icon">
                  <FiAlertCircle />
                </div>
                <div className="alert-content">
                  <div className="alert-header">
                    <h4>{alert.name || alert.tagId}</h4>
                    <span className={`alert-badge ${alert.healthStatus}`}>
                      {alert.healthStatus}
                    </span>
                  </div>
                  <div className="alert-details">
                    <div className="alert-detail-item">
                      <FiThermometer />
                      <span>Temp: {alert.temperature}°C</span>
                    </div>
                    <div className="alert-detail-item">
                      <FiHeart />
                      <span>Heart Rate: {alert.heartRate} bpm</span>
                    </div>
                    {alert.aiPredictions?.healthRisk > 0.7 && (
                      <div className="alert-detail-item ai-warning">
                        <FiAlertCircle />
                        <span>AI Risk: {Math.round(alert.aiPredictions.healthRisk * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-alerts">
            <FiActivity size={48} />
            <p>No active health alerts</p>
            <span>All cattle are healthy</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMonitoring;

