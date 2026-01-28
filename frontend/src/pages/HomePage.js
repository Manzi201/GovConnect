import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowForward as ArrowForwardIcon,
  People as PeopleIcon,
  VerifiedUser as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  ChatBubbleOutline as ChatIcon,
  Business as BusinessIcon,
  ReportProblem as ReportIcon,
  SupportAgent as TechIcon
} from '@mui/icons-material';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page fade-in-up">
      {/* Hero Section with Rwandan Landscape Overlay */}
      <section className="hero-v2">
        <div className="hero-overlay"></div>
        <div className="hero-content-v2">
          <div className="cultural-tag">IBUYE RY'UMUKARANI • RWANDA</div>
          <h1>Urumuri rwa <span className="highlight">GovConnect</span></h1>
          <p className="hero-subtitle">
            Leading Rwanda into a new era of transparent governance and rapid service delivery.
            Empowering the voice of every citizen.
          </p>
          <div className="hero-actions">
            <Link to="/submit-complaint" className="btn-premium btn-accent">
              Submit Issue Now
              <ArrowForwardIcon style={{ marginLeft: '10px' }} />
            </Link>
            <Link to="/register" className="btn-premium btn-outline">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      {/* Cultural Values Section */}
      <section className="values-section">
        <div className="imigongo-divider"></div>
        <div className="container">
          <div className="section-header">
            <span className="label">Access</span>
            <h2>Bridging the <span className="text-forest">Gap</span></h2>
          </div>

          <div className="discovery-promo glass fade-in-up">
            <div className="promo-text">
              <h3>Find the Right Official</h3>
              <p>Access public services without needing personal contacts. Search by institution, department, or service area and connect directly with the officers in charge.</p>
              <Link to="/officials" className="btn-premium btn-primary">Open Directory</Link>
            </div>
            <div className="promo-visual">
              <div className="card-mockup glass">
                <div className="mock-header">
                  <div className="mock-avatar">
                    <BusinessIcon color="primary" />
                  </div>
                  <h4>Ministry of Infrastructure</h4>
                </div>
                <div className="mock-body">
                  <div className="mock-line"></div>
                  <div className="mock-line short"></div>
                </div>
                <div className="mock-footer">
                  <div className="btn-mock"><ChatIcon fontSize="small" style={{ marginRight: '5px' }} /> Chat</div>
                  <div className="btn-mock"><ReportIcon fontSize="small" style={{ marginRight: '5px' }} /> Report</div>
                </div>
              </div>
            </div>
          </div>

          <div className="values-grid">
            <div className="value-card glass">
              <div className="value-icon">
                <PeopleIcon fontSize="large" color="primary" />
              </div>
              <h3>Ubumwe</h3>
              <p>Strengthening the bond between our government and citizens through constant communication.</p>
            </div>
            <div className="value-card glass">
              <div className="value-icon">
                <VerifiedIcon fontSize="large" color="primary" />
              </div>
              <h3>Ubutwari</h3>
              <p>Courageously addressing issues to build a stronger and more accountable nation.</p>
            </div>
            <div className="value-card glass">
              <div className="value-icon">
                <ChatIcon fontSize="large" color="primary" />
              </div>
              <h3>Ibiganiro</h3>
              <p>Direct but controlled communication channel between citizens and government officials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Statistics - Focus on Values */}
      <section className="stats-modern glass-dark">
        <div className="container stats-flex">
          <div className="stat-block">
            <div className="stat-value"><TrendingUpIcon fontSize="large" /></div>
            <div className="stat-label">Responsive Governance</div>
          </div>
          <div className="stat-block">
            <div className="stat-value"><TechIcon fontSize="large" /></div>
            <div className="stat-label">24/7 Digital Portal</div>
          </div>
          <div className="stat-block">
            <div className="stat-value"><VerifiedIcon fontSize="large" /></div>
            <div className="stat-label">Citizen Empowerment</div>
          </div>
        </div>
      </section>

      {/* Easy Submission CTA */}
      <section className="cta-simple">
        <div className="cta-box glass">
          <h2>Have an issue? We're listening.</h2>
          <p>Your feedback is vital to our progress. Share your concerns with us today.</p>
          <Link to="/submit-complaint" className="btn-premium btn-primary">Start Submission</Link>
        </div>
      </section>
    </div>
  );
}
