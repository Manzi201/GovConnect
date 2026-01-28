import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { authAPI } from '../services/api';
import './AuthPages.css';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      onLogin(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-v2 cultural-bg">
      <div className="auth-card-v2 glass fade-in-up">
        <div className="auth-header">
          <div className="auth-logo-bg">
            <FlagIcon color="primary" fontSize="large" />
          </div>
          <h2>Muraho!</h2>
          <p>Login to your GovConnect portal</p>
        </div>

        {error && <div className="error-badge">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form-v2">
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
            <label>Password</label>
            <div className="input-with-icon">
              <LockIcon className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-premium btn-primary full-width">
            {loading ? 'Authenticating...' : <><LoginIcon sx={{ mr: 1 }} /> Access Portal</>}
          </button>
        </form>

        <div className="auth-footer-v2">
          <p>Don't have an account yet?</p>
          <Link to="/register" className="auth-link-v2">Join the Community</Link>
        </div>
      </div>
    </div>
  );
}
