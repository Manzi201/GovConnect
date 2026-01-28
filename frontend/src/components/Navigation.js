import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export default function Navigation({ isAuthenticated, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar glass ${scrolled || !isHome ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🇷🇼</span>
          <span className="logo-text">GovConnect</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>

          <Link to="/submit-complaint" className={`nav-link ${location.pathname === '/submit-complaint' ? 'active' : ''}`}>
            Submit Issue
          </Link>

          <Link to="/officials" className={`nav-link ${location.pathname === '/officials' ? 'active' : ''}`}>
            Officials
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/complaints" className={`nav-link ${location.pathname === '/complaints' ? 'active' : ''}`}>
                Track
              </Link>
              <Link to="/dashboard" className="nav-link dashboard-link">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link">
                  Admin
                </Link>
              )}
              <div className="user-profile-nav">
                <Link to="/profile" className="profile-trigger">
                  <div className="avatar">{user?.name?.charAt(0)}</div>
                  <span className="user-name">{user?.name}</span>
                </Link>
                <button className="btn-logout" onClick={onLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link secondary">Login</Link>
              <Link to="/register" className="btn-premium btn-primary btn-sm">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
