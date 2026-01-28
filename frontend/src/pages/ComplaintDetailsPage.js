import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import './ComplaintDetailsPage.css';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });

  const fetchComplaint = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getComplaintById(id);
      setComplaint(response.data.complaint);
      setError('');
    } catch (err) {
      setError('Failed to load complaint');
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!complaint) return <div className="no-data">Complaint not found</div>;

  return (
    <div className="complaint-details-container">
      <div className="details-card">
        <h2>{complaint.title}</h2>

        <div className="complaint-status">
          <span className={`status-badge status-${complaint.status}`}>
            {complaint.status}
          </span>
          <span className={`priority-badge priority-${complaint.priority}`}>
            {complaint.priority}
          </span>
        </div>

        <div className="details-section">
          <h3>Description</h3>
          <p>{complaint.description}</p>
        </div>

        <div className="details-row">
          <div className="details-section">
            <h3>Category</h3>
            <p>{complaint.category}</p>
          </div>
          <div className="details-section">
            <h3>Submitted Date</h3>
            <p>{new Date(complaint.submittedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="details-row">
          <div className="details-section">
            <h3>Location</h3>
            <p>
              {complaint.location.district}
              {complaint.location.sector && `, ${complaint.location.sector}`}
              {complaint.location.cell && `, ${complaint.location.cell}`}
            </p>
          </div>
          <div className="details-section">
            <h3>Views</h3>
            <p>{complaint.views}</p>
          </div>
        </div>

        {complaint.resolution && (
          <div className="details-section">
            <h3>Resolution</h3>
            <p>{complaint.resolution.description}</p>
            <p className="resolution-date">
              Resolved on: {new Date(complaint.resolution.resolvedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {complaint.status === 'resolved' && !complaint.feedback && (
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <h3>Share Your Feedback</h3>
            <div className="form-group">
              <label>Rating</label>
              <div className="rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= feedback.rating ? 'active' : ''}`}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                placeholder="Share your feedback..."
                rows="4"
              />
            </div>
            <button type="submit" className="btn-primary">Submit Feedback</button>
          </form>
        )}

        {complaint.feedback && (
          <div className="feedback-display">
            <h3>Your Feedback</h3>
            <p className="rating">
              {'★'.repeat(complaint.feedback.rating)}{'☆'.repeat(5 - complaint.feedback.rating)}
            </p>
            <p>{complaint.feedback.comment}</p>
          </div>
        )}
      </div>
    </div>
  );
}
