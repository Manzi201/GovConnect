import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AppRegistration as RegisterIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { authAPI } from '../services/api';
import './AuthPages.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: 'Kigali'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...data } = formData;
      await authAPI.register(data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-v2 cultural-bg">
      <div className="auth-card-v2 glass fade-in-up" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-logo-bg">
            <FlagIcon color="primary" fontSize="large" />
          </div>
          <h2>Urakaza Neza</h2>
          <p>Join the GovConnect community to improve public services</p>
        </div>

        {error && <div className="error-badge">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form-v2">
          <div className="form-grid-2">
            <div className="input-group-v2">
              <label>Full Name</label>
              <div className="input-with-icon">
                <PersonIcon className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Jean Pierre"
                />
              </div>
            </div>

            <div className="input-group-v2">
              <label>Email Address</label>
              <div className="input-with-icon">
                <EmailIcon className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="citizen@gov.rw"
                />
              </div>
            </div>

            <div className="input-group-v2">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <PhoneIcon className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+250..."
                />
              </div>
            </div>

            <div className="input-group-v2">
              <label>District</label>
              <div className="input-with-icon">
                <LocationIcon className="input-icon" />
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="select-with-icon"
                >
                  <option value="Kigali">Kigali</option>
                  <option value="Kayonza">Kayonza</option>
                  <option value="Huye">Huye</option>
                  <option value="Musanze">Musanze</option>
                  <option value="Rubavu">Rubavu</option>
                </select>
              </div>
            </div>

            <div className="input-group-v2">
              <label>Password</label>
              <div className="input-with-icon">
                <LockIcon className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <div className="input-group-v2">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <LockIcon className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Repeat password"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-premium btn-accent full-width mt-20">
            {loading ? 'Creating Account...' : <><RegisterIcon sx={{ mr: 1 }} /> Register Now</>}
          </button>
        </form>

        <div className="auth-footer-v2">
          <p>Already registered?</p>
          <Link to="/login" className="auth-link-v2">Portal Login</Link>
        </div>
      </div>
    </div>
  );
}
