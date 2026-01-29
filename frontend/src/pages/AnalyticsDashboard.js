import React, { useState, useEffect, useCallback } from 'react';
import { analyticsAPI, complaintsAPI } from '../services/api';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Assignment as IssueIcon,
  CheckCircle as ResolvedIcon,
  PendingActions as PendingIcon,
  ErrorOutline as UrgentIcon
} from '@mui/icons-material';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard({ user, isSuperAdmin = false }) {
  const [dashboard, setDashboard] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
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
  }, [user.id, user.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

        {error && <div className="error-badge">{error}</div>}

        {/* Stats Grid for Officials/Admins */}
        {(user.role !== 'citizen' || isSuperAdmin) && dashboard && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <IssueIcon color="primary" />
                <span className="label">Total Received</span>
              </div>
              <span className="value">{dashboard.totalComplaints}</span>
              <div className="spark-line green"></div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <ResolvedIcon color="success" />
                <span className="label">Resolved</span>
              </div>
              <span className="value">{dashboard.resolvedComplaints}</span>
              <div className="spark-line yellow"></div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <PendingIcon color="info" />
                <span className="label">Pending</span>
              </div>
              <span className="value">{dashboard.pendingComplaints}</span>
              <div className="spark-line blue"></div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <UrgentIcon color="error" />
                <span className="label">Urgent</span>
              </div>
              <span className="value">{dashboard.urgentComplaints}</span>
              <div className="spark-line red"></div>
            </div>
          </div>
        )}

        {/* Citizen Specific Summary */}
        {user.role === 'citizen' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <IssueIcon color="primary" />
                <span className="label">My Total Submissions</span>
              </div>
              <span className="value">{user.complaintsCount || 0}</span>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <ResolvedIcon color="success" />
                <span className="label">Resolved</span>
              </div>
              <span className="value">{user.resolvedComplaintsCount || 0}</span>
            </div>
          </div>
        )}

        <div className="dashboard-main">
          <section className="recent-activity">
            <div className="section-title">
              <h3>{user.role === 'citizen' ? 'My Recent Issues' : 'Recent Submissions'}</h3>
              <button onClick={() => fetchData()} className="btn-refresh">
                <RefreshIcon fontSize="small" /> Refresh
              </button>
            </div>

            <div className="activity-list">
              {complaints && complaints.length > 0 ? (
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
                <div className="action-icon-bg">
                  <AddIcon color="primary" />
                </div>
                New Issue
              </button>
              <button className="action-btn" onClick={() => (window.location.href = '/profile')}>
                <div className="action-icon-bg">
                  <PersonIcon color="primary" />
                </div>
                Profile
              </button>
              {isSuperAdmin && (
                <button className="action-btn highlight">
                  <div className="action-icon-bg">
                    <SettingsIcon color="action" />
                  </div>
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
