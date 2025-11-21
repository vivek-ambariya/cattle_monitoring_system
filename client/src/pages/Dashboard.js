import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { 
  FiUsers, 
  FiActivity, 
  FiAlertCircle, 
  FiDroplet,
  FiTrendingUp,
  FiClock
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      setStats(response.data);
      setRecentActivity(response.data.recentCattle || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const overview = stats?.overview || {};

  const chartData = [
    { name: 'Mon', milk: 450, health: 95 },
    { name: 'Tue', milk: 520, health: 98 },
    { name: 'Wed', milk: 480, health: 97 },
    { name: 'Thu', milk: 550, health: 96 },
    { name: 'Fri', milk: 600, health: 99 },
    { name: 'Sat', milk: 580, health: 98 },
    { name: 'Sun', milk: 620, health: 100 },
  ];

  const healthData = [
    { name: 'Healthy', value: overview.healthyCattle || 0, color: '#10b981' },
    { name: 'Sick', value: overview.sickCattle || 0, color: '#f59e0b' },
    { name: 'Critical', value: overview.criticalCattle || 0, color: '#ef4444' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p className="subtitle">Real-time cattle monitoring and analytics</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<FiUsers />}
          title="Total Cattle"
          value={overview.totalCattle || 0}
          color="#3b82f6"
          trend="+2 this month"
        />
        <StatCard
          icon={<FiActivity />}
          title="Healthy"
          value={overview.healthyCattle || 0}
          color="#10b981"
          trend={`${Math.round(((overview.healthyCattle || 0) / (overview.totalCattle || 1)) * 100)}% of total`}
        />
        <StatCard
          icon={<FiAlertCircle />}
          title="Critical"
          value={overview.criticalCattle || 0}
          color="#ef4444"
          trend="Needs attention"
        />
        <StatCard
          icon={<FiDroplet />}
          title="Today's Milk"
          value={`${overview.todayMilkProduction || 0}L`}
          color="#8b5cf6"
          trend={<FiTrendingUp />}
        />
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Milk Production Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="milk" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Health Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="activity-section">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((cattle, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <FiClock />
                  </div>
                  <div className="activity-content">
                    <p><strong>{cattle.name || cattle.tagId}</strong> - {cattle.activity || 'Active'}</p>
                    <span className="activity-time">
                      {new Date(cattle.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent activity</p>
            )}
          </div>
        </div>

        <div className="alerts-card">
          <h3>Health Alerts</h3>
          <div className="alerts-list">
            {stats?.healthAlerts && stats.healthAlerts.length > 0 ? (
              stats.healthAlerts.map((alert, index) => (
                <div key={index} className="alert-item critical">
                  <FiAlertCircle />
                  <div>
                    <p><strong>{alert.name || alert.tagId}</strong></p>
                    <p>Status: {alert.healthStatus}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, trend }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
      {icon}
    </div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p>{title}</p>
      <span className="stat-trend">{trend}</span>
    </div>
  </div>
);

export default Dashboard;

