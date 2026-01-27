import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import './SubmitComplaintPage.css';

export default function SubmitComplaintPage() {
  const [formData, setFormData] = useState({
    category: 'other',
    title: '',
    description: '',
    location: { district: '', sector: '', cell: '' },
    attachments: [],
    isUrgent: false,
    isAnonymous: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'social-welfare',
    'education',
    'healthcare',
    'infrastructure',
    'water-sanitation',
    'electricity',
    'roads',
    'agriculture',
    'security',
    'other'
  ];

  const districts = ['Kigali', 'Kayonza', 'Huye', 'Gitarama', 'Musanze'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await complaintsAPI.submitComplaint(formData);
      navigate('/complaints');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-complaint-container">
      <div className="complaint-form-card">
        <h2>Submit a Complaint</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Complaint Title*</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief title of your complaint"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Detailed description of the issue..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="district">District*</label>
              <select
                id="district"
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
                required
              >
                <option value="">Select District</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sector">Sector</label>
              <input
                id="sector"
                type="text"
                name="location.sector"
                value={formData.location.sector}
                onChange={handleChange}
                placeholder="Sector name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cell">Cell</label>
            <input
              id="cell"
              type="text"
              name="location.cell"
              value={formData.location.cell}
              onChange={handleChange}
              placeholder="Cell name"
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
              />
              <span>Mark as Urgent</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
              />
              <span>Submit Anonymously</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
