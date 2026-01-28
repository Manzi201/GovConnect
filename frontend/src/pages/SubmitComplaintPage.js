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
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const categories = [
    'social-welfare', 'education', 'healthcare', 'infrastructure',
    'water-sanitation', 'electricity', 'roads', 'agriculture',
    'security', 'other'
  ];

  const districts = ['Kigali', 'Kayonza', 'Huye', 'Gisagara', 'Nyaruguru', 'Rusizi', 'Nyamasheke', 'Karongi', 'Rutsiro', 'Rubavu', 'Nyabihu', 'Ngororero', 'Musanze', 'Burera', 'Gicumbi', 'Rulindo', 'Gakenke', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Bugesera', 'Kirehe', 'Ngoma'];

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
      const response = await complaintsAPI.submitComplaint(formData);
      // If user is guest, maybe redirect to a success page or home
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/complaints');
      } else {
        alert('Thank you for your submission. Your contribution to our nation\'s growth is valued.');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-page cultural-bg">
      <div className="form-overlay glass">
        <div className="form-header">
          <div className="cultural-indicator">🇷🇼</div>
          <h1>Ijwi ry'Umuturage</h1>
          <p>Your voice matters. Submit your concern and contribute to Rwanda's progress.</p>

          <div className="stepper">
            <div className={`step-node ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="connector"></div>
            <div className={`step-node ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
        </div>

        {error && <div className="error-badge">{error}</div>}

        <form onSubmit={handleSubmit} className="modern-form">
          {step === 1 ? (
            <div className="form-step fade-in">
              <div className="field-group">
                <label>Identify the Category</label>
                <div className="category-grid">
                  {categories.map(cat => (
                    <div
                      key={cat}
                      className={`cat-pill ${formData.category === cat ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, category: cat })}
                    >
                      {cat.replace('-', ' ')}
                    </div>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <label>What is the issue?</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Broken water pipe in Nyarugenge"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label>Tell us more</label>
                <textarea
                  name="description"
                  rows="5"
                  placeholder="Provide details about the situation..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="button" className="btn-premium btn-primary" onClick={() => setStep(2)}>
                Next: Location Details →
              </button>
            </div>
          ) : (
            <div className="form-step fade-in">
              <div className="form-grid">
                <div className="field-group">
                  <label>District</label>
                  <select name="location.district" value={formData.location.district} onChange={handleChange} required>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Sector</label>
                  <input type="text" name="location.sector" placeholder="Sector" value={formData.location.sector} onChange={handleChange} />
                </div>
              </div>

              <div className="checkbox-stack">
                <label className="checkbox-item">
                  <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} />
                  <span className="check-text">
                    <strong>Urgent</strong> - Requires immediate attention
                  </span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} />
                  <span className="check-text">
                    <strong>Anonymous</strong> - Keep my identity hidden
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-premium btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-premium btn-accent">
                  {loading ? 'Submitting...' : 'Submit to GovConnect'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
