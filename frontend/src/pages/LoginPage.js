import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { supabase } from '../services/supabase';
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
      // 1. Login with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (data.user && data.session) {
        // 2. Fetch user profile from public 'Users' table
        const { data: profile, error: profileError } = await supabase
          .from('Users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.warn('Could not fetch user profile:', profileError);
          // Fallback to auth user metadata if profile missing
          const fallbackUser = {
            ...data.user,
            name: data.user.user_metadata.name || data.user.email, // Fallback name
            role: 'citizen' // Default role
          };
          onLogin(fallbackUser, data.session.access_token);
        } else {
          onLogin(profile, data.session.access_token);
        }

        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
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
