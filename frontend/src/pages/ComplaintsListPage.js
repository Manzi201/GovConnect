import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Event as DateIcon,
  Category as CategoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
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

  const fetchComplaints = useCallback(async () => {
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

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'submitted': 'status-submitted',
      'in-progress': 'status-progress',
      'resolved': 'status-resolved',
      'closed': 'status-closed',
      'rejected': 'status-rejected'
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <div className="complaints-list-page cultural-bg">
      <div className="container container-narrow">
        <header className="page-header fade-in-up">
          <h1>Track Issues</h1>
          <p>Monitor the progress of citizen reports and government responses.</p>
        </header>

        <section className="filters-glass-bar glass fade-in-up">
          <div className="filter-header">
            <FilterIcon fontSize="small" />
            <span>Filter Results</span>
          </div>
          <div className="filters-grid">
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
        </section>

        {error && <div className="error-badge">{error}</div>}

        {loading ? (
          <div className="loading-state glass">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="empty-state glass fade-in">
            <InfoIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <p>No complaints found matching your criteria.</p>
          </div>
        ) : (
          <div className="complaints-grid">
            {complaints.map(complaint => (
              <Link
                key={complaint.id || complaint._id}
                to={`/complaint/${complaint.id || complaint._id}`}
                className="complaint-item-card glass fade-in"
              >
                <div className="card-top">
                  <span className={`badge-status-v2 ${getStatusBadgeClass(complaint.status)}`}>
                    {complaint.status}
                  </span>
                  {complaint.priority === 'urgent' && <span className="urgent-tag">Urgent</span>}
                </div>

                <h3>{complaint.title}</h3>
                <p>{complaint.description.length > 120 ? complaint.description.substring(0, 120) + '...' : complaint.description}</p>

                <div className="card-footer">
                  <div className="meta-bits">
                    <span><CategoryIcon sx={{ fontSize: 14 }} /> {complaint.category}</span>
                    <span><DateIcon sx={{ fontSize: 14 }} /> {new Date(complaint.createdAt || complaint.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="btn-view-more">
                    View Details <SearchIcon sx={{ fontSize: 16 }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
