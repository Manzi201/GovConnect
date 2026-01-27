import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to GovConnect</h1>
          <p>Empowering Citizens Through Transparent Public Service Delivery</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Submit Complaints</h3>
            <p>Submit detailed complaints about public services with photos and descriptions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Status</h3>
            <p>Monitor your complaints in real-time with status updates and notifications</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Priority Handling</h3>
            <p>Urgent complaints are automatically escalated for rapid response</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Analytics Dashboard</h3>
            <p>Officials access performance metrics and complaint trends</p>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About GovConnect</h2>
        <p>
          GovConnect is an integrated digital platform designed to enhance public service 
          delivery, transparency, and accountability in Rwanda. It enables citizens to submit 
          complaints and track their resolution while providing authorities with real-time 
          analytics and performance monitoring.
        </p>
      </section>

      <section className="stats">
        <div className="stat-item">
          <h3>5000+</h3>
          <p>Complaints Resolved</p>
        </div>
        <div className="stat-item">
          <h3>30+</h3>
          <p>Districts Covered</p>
        </div>
        <div className="stat-item">
          <h3>4.5★</h3>
          <p>User Satisfaction</p>
        </div>
      </section>
    </div>
  );
}
