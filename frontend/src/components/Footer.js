import React from 'react';
import { Link } from 'react-router-dom';
import {
  X as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-premium">
      <div className="footer-imigongo"></div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <GavelIcon sx={{ mr: 1 }} /> GovConnect
          </Link>
          <p>
            Building a brighter future for Rwanda through transparent,
            citizen-driven public service transformation.
            Rooted in our culture, driven by progress.
          </p>
          <div className="social-pill">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterIcon fontSize="small" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FacebookIcon fontSize="small" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><InstagramIcon fontSize="small" /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/submit-complaint">Submit Issue</Link></li>
            <li><Link to="/officials">Officials Directory</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
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
          <h4>Headquarters</h4>
          <p>Kigali Heights, 4th Floor</p>
          <p>Kigali, Rwanda</p>
          <p className="contact-link">contact@govconnect.rw</p>
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
