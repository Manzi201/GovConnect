import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setDashboard(response.data.dashboard);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!dashboard) return null;

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Complaints</h3>
          <p className="metric-value">{dashboard.totalComplaints}</p>
        </div>
        <div className="metric-card">
          <h3>Resolved</h3>
          <p className="metric-value" style={{ color: '#4caf50' }}>
            {dashboard.resolvedComplaints}
          </p>
        </div>
        <div className="metric-card">
          <h3>Pending</h3>
          <p className="metric-value" style={{ color: '#ff9800' }}>
            {dashboard.pendingComplaints}
          </p>
        </div>
        <div className="metric-card">
          <h3>Resolution Rate</h3>
          <p className="metric-value">{dashboard.resolutionRate}</p>
        </div>
      </div>

      <div className="chart-section">
        <h3>Complaints by Category</h3>
        <div className="category-list">
          {dashboard.categoryBreakdown?.map((cat, idx) => (
            <div key={idx} className="category-item">
              <span>{cat._id}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(cat.count / dashboard.totalComplaints) * 100}%`
                  }}
                />
              </div>
              <span className="count">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-box">
        <p>📊 Dashboard shows real-time statistics for public service performance monitoring.</p>
      </div>
    </div>
  );
}
