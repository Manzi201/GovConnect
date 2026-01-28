import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Visibility as ViewsIcon,
  CheckCircle as ResolvedIcon,
  Category as CategoryIcon,
  Assignment as IssueIcon
} from '@mui/icons-material';
import { complaintsAPI } from '../services/api';
import './ComplaintDetailsPage.css';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

  const fetchComplaint = useCallback(async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getComplaintById(id);
      setComplaint(response.data.complaint);
      setError('');
    } catch (err) {
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaintsAPI.submitFeedback(id, feedback);
      setFeedback({ rating: 0, comment: '' });
      fetchComplaint();
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  if (loading) return <div className="loading-state glass">Retrieving record...</div>;
  if (error || !complaint) return (
    <div className="error-container glass">
      <p>{error || 'Complaint not found'}</p>
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  );

  return (
    <div className="details-page cultural-bg">
      <div className="container-narrow">
        <div className="details-card glass fade-in-up">
          <header className="details-header">
            <div className="title-area">
              <span className={`status-pill pill-${complaint.status}`}>{complaint.status}</span>
              <h1>{complaint.title}</h1>
            </div>
            {complaint.priority === 'urgent' && <span className="urgent-banner">URGENT</span>}
          </header>

          <div className="details-grid-modern">
            <div className="detail-item">
              <CategoryIcon color="primary" sx={{ fontSize: 20 }} />
              <div>
                <label>Category</label>
                <p>{complaint.category.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="detail-item">
              <DateIcon color="primary" sx={{ fontSize: 20 }} />
              <div>
                <label>Reported On</label>
                <p>{new Date(complaint.createdAt || complaint.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="detail-item">
              <LocationIcon color="primary" sx={{ fontSize: 20 }} />
              <div>
                <label>Location</label>
                <p>{complaint.location.district}{complaint.location.sector && `, ${complaint.location.sector}`}</p>
              </div>
            </div>
            <div className="detail-item">
              <ViewsIcon color="primary" sx={{ fontSize: 20 }} />
              <div>
                <label>Public Views</label>
                <p>{complaint.views || 0}</p>
              </div>
            </div>
          </div>

          <section className="description-section">
            <div className="sec-title">
              <IssueIcon fontSize="small" />
              <h3>Issue Description</h3>
            </div>
            <p className="desc-text">{complaint.description}</p>
          </section>

          {complaint.resolution && (
            <section className="resolution-section glass-accent">
              <div className="sec-title">
                <ResolvedIcon color="success" />
                <h3>Government Resolution</h3>
              </div>
              <p className="res-text">{complaint.resolution.description}</p>
              <div className="res-meta">
                Resolved on {new Date(complaint.resolution.resolvedAt).toLocaleDateString()}
              </div>
            </section>
          )}

          {complaint.status === 'resolved' && !complaint.feedback && (
            <section className="feedback-flow fade-in">
              <h3>Share Your Feedback</h3>
              <p>How would you rate the resolution provided by the official?</p>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= feedback.rating ? 'active' : ''}`}
                      onClick={() => setFeedback({ ...feedback, rating: star })}
                    >
                      {star <= feedback.rating ? <StarIcon /> : <StarBorderIcon />}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Tell us what you think about the service..."
                  value={feedback.comment}
                  onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                  required
                />
                <button type="submit" className="btn-premium btn-primary">Submit Feedback</button>
              </form>
            </section>
          )}

          {complaint.feedback && (
            <section className="feedback-display-section glass">
              <div className="sec-title">
                <h3>Your Experience</h3>
                <div className="display-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    star <= complaint.feedback.rating ? <StarIcon key={star} color="primary" /> : <StarBorderIcon key={star} />
                  ))}
                </div>
              </div>
              <p className="feedback-comment">"{complaint.feedback.comment}"</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
