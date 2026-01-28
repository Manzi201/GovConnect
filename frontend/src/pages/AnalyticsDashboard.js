import React, { useState, useEffect } from 'react';
import { analyticsAPI, complaintsAPI } from '../services/api';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard({ user, isSuperAdmin = false }) {
  const [dashboard, setDashboard] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [user, isSuperAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (user.role === 'citizen') {
        const response = await complaintsAPI.getUserComplaints(user.id);
        setComplaints(response.data.complaints);
      } else {
        const response = await analyticsAPI.getDashboard();
        setDashboard(response.data.dashboard);
        const complaintsRes = await complaintsAPI.getAllComplaints();
        setComplaints(complaintsRes.data.complaints);
      }
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state glass">Loading...</div>;

  return (
    <div className="dashboard-page cultural-bg">
      <div className="dashboard-content glass">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="welcome-msg">Muraho, {user.name}. Here is your activity overview.</p>
          </div>
          {isSuperAdmin && <div className="badge-admin">Super Admin</div>}
        </header>

        {/* Stats Grid for Officials/Admins */}
        {(user.role !== 'citizen' || isSuperAdmin) && dashboard && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="label">Total Received</span>
              <span className="value">{dashboard.totalComplaints}</span>
              <div className="spark-line green"></div>
            </div>
            <div className="stat-card">
              <span className="label">Resolved</span>
              <span className="value">{dashboard.resolvedComplaints}</span>
              <div className="spark-line yellow"></div>
            </div>
            <div className="stat-card">
              <span className="label">Pending</span>
              <span className="value">{dashboard.pendingComplaints}</span>
              <div className="spark-line blue"></div>
            </div>
            <div className="stat-card">
              <span className="label">Urgent</span>
              <span className="value">{dashboard.urgentComplaints}</span>
              <div className="spark-line red"></div>
            </div>
          </div>
        )}

        {/* Citizen Specific Summary */}
        {user.role === 'citizen' && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="label">My Total Submissions</span>
              <span className="value">{user.complaintsCount || 0}</span>
            </div>
            <div className="stat-card">
              <span className="label">Resolved</span>
              <span className="value">{user.resolvedComplaintsCount || 0}</span>
            </div>
          </div>
        )}

        <div className="dashboard-main">
          <section className="recent-activity">
            <div className="section-title">
              <h3>{user.role === 'citizen' ? 'My Recent Issues' : 'Recent Submissions'}</h3>
              <button onClick={() => fetchData()} className="btn-refresh">↻ Refresh</button>
            </div>

            <div className="activity-list">
              {complaints.length > 0 ? (
                complaints.slice(0, 5).map(c => (
                  <div key={c.id || c._id} className="activity-item">
                    <div className={`status-dot ${c.status}`}></div>
                    <div className="activity-info">
                      <strong>{c.title}</strong>
                      <span>{c.category} • {new Date(c.createdAt || c.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className={`badge-status ${c.status}`}>{c.status}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No recent activity to show.</div>
              )}
            </div>
          </section>

          <aside className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn" onClick={() => (window.location.href = '/submit-complaint')}>
                <span className="icon">📝</span>
                New Issue
              </button>
              <button className="action-btn" onClick={() => (window.location.href = '/profile')}>
                <span className="icon">👤</span>
                Profile
              </button>
              {isSuperAdmin && (
                <button className="action-btn highlight">
                  <span className="icon">⚙️</span>
                  Settings
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
