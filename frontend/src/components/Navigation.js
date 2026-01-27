import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation({ isAuthenticated, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏛️ GovConnect
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/complaints" className="nav-link">My Complaints</Link>
              </li>
              <li className="nav-item">
                <Link to="/submit-complaint" className="nav-link primary">Submit Complaint</Link>
              </li>
              {user?.role !== 'citizen' && (
                <li className="nav-item">
                  <Link to="/analytics" className="nav-link">Analytics</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/profile" className="nav-link">{user?.name}</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link logout" onClick={onLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link primary">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
