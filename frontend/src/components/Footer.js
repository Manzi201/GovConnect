import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-premium">
      <div className="footer-imigongo"></div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo-v2">🇷🇼 GovConnect</div>
          <p>
            Building a brighter future for Rwanda through transparent,
            citizen-driven public service transformation.
            Rooted in our culture, driven by progress.
          </p>
          <div className="social-pill">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">𝕏</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">f</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Platfrom</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/submit-complaint">Submit Issue</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/complaints">Track Issue</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#security">Data Protection</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Office</h4>
          <p>Kigali Heights, 4th Floor</p>
          <p>Kigali, Rwanda</p>
          <p className="contact-link">info@govconnect.rw</p>
        </div>
      </div>

      <div className="footer-bottom-line">
        <div className="container flex-between">
          <span>&copy; {new Date().getFullYear()} GovConnect Rwanda. All rights reserved.</span>
          <span className="tradition-text">Built with Integrity & Tradition</span>
        </div>
      </div>
    </footer>
  );
}
