import React from 'react';
import { Link } from 'react-router-dom';
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
              <span className="icon">→</span>
            </Link>
            <Link to="/register" className="btn-premium btn-outline">
              Join Our Community
            </Link>
          </div>
        </div>

        {/* Pulse of Updates (Dynamic-looking ticker) */}
        <div className="pulse-updates glass">
          <div className="pulse-title">LATEST RESOLUTIONS</div>
          <div className="pulse-ticker">
            <span className="ticker-item">✅ Infrastructure: Potholes fixed in Kigali - 2h ago</span>
            <span className="ticker-item">✅ Healthcare: New supplies delivered to Kayonza - 5h ago</span>
            <span className="ticker-item">✅ Education: Textbooks distributed in Musanze - 1d ago</span>
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
                  <div className="mock-avatar">🏢</div>
                  <h4>Ministry of Infrastructure</h4>
                </div>
                <div className="mock-body">
                  <div className="mock-line"></div>
                  <div className="mock-line short"></div>
                </div>
                <div className="mock-footer">
                  <div className="btn-mock">Chat</div>
                  <div className="btn-mock">Report</div>
                </div>
              </div>
            </div>
          </div>

          <div className="values-grid">
            <div className="value-card glass">
              <div className="value-icon">🤝</div>
              <h3>Ubumwe</h3>
              <p>Strengthening the bond between our government and citizens through constant communication.</p>
            </div>
            <div className="value-card glass">
              <div className="value-icon">🦁</div>
              <h3>Ubutwari</h3>
              <p>Courageously addressing issues to build a stronger and more accountable nation.</p>
            </div>
            <div className="value-card glass">
              <div className="value-icon">💬</div>
              <h3>Ibiganiro</h3>
              <p>Direct but controlled communication channel between citizens and government officials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Statistics */}
      <section className="stats-modern glass-dark">
        <div className="container stats-flex">
          <div className="stat-block">
            <div className="stat-value">98%</div>
            <div className="stat-label">Response Accuracy</div>
          </div>
          <div className="stat-block">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Support Availability</div>
          </div>
          <div className="stat-block">
            <div className="stat-value">100%</div>
            <div className="stat-label">Community Driven</div>
          </div>
        </div>
      </section>

      {/* Easy Submission CTA */}
      <section className="cta-simple">
        <div className="cta-box glass">
          <h2>Have an issue? We're listening.</h2>
          <p>No account needed for first-time submissions. We value your feedback.</p>
          <Link to="/submit-complaint" className="btn-premium btn-primary">Start Submission</Link>
        </div>
      </section>
    </div>
  );
}
