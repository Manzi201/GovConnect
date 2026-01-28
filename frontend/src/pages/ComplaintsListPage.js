import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import './ComplaintsListPage.css';

export default function ComplaintsListPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    page: 1
  });

  const fetchComplaints = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getAllComplaints(filters);
      setComplaints(response.data.complaints);
      setError('');
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'submitted': 'badge-blue',
      'in-progress': 'badge-yellow',
      'resolved': 'badge-green',
      'closed': 'badge-gray',
      'rejected': 'badge-red'
    };
    return statusMap[status] || 'badge-gray';
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'urgent': 'priority-urgent'
    };
    return priorityMap[priority] || 'priority-medium';
  };

  return (
    <div className="complaints-list-container">
      <h2>Complaints</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
        >
          <option value="">All Categories</option>
          <option value="social-welfare">Social Welfare</option>
          <option value="education">Education</option>
          <option value="healthcare">Healthcare</option>
          <option value="infrastructure">Infrastructure</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading complaints...</div>
      ) : complaints.length === 0 ? (
        <div className="no-complaints">No complaints found</div>
      ) : (
        <div className="complaints-list">
          {complaints.map(complaint => (
            <Link key={complaint._id} to={`/complaint/${complaint._id}`} className="complaint-card">
              <div className="complaint-header">
                <h3>{complaint.title}</h3>
                <span className={`badge ${getStatusBadge(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <p className="complaint-description">{complaint.description.substring(0, 100)}...</p>
              <div className="complaint-meta">
                <span className={`priority ${getPriorityBadge(complaint.priority)}`}>
                  {complaint.priority}
                </span>
                <span className="category">{complaint.category}</span>
                <span className="date">{new Date(complaint.submittedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
