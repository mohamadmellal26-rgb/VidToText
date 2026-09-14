import React from 'react';
import './footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Upper Section: Brand & Navigation Links */}
        <div className="footer-top">
          
          {/* Brand Info */}
          <div className="footer-brand">
            <a href="/" className="brand-logo">
              <div className="logo-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
                  />
                </svg>
              </div>
              <span className="brand-name">
                VidTo<span className="brand-highlight">Text</span>
              </span>
            </a>
            <p className="brand-description">
              Convert your video and audio content into accurate text effortlessly using advanced AI models.
            </p>
          </div>

          {/* Footer Navigation Columns */}
          <div className="footer-links-grid">
            
            {/* Column 1: Product */}
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-list">
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="#pricing" className="footer-link">Pricing</a></li>
                <li><a href="#api" className="footer-link">API Access</a></li>
                <li><a href="#integrations" className="footer-link">Integrations</a></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-list">
                <li><a href="#docs" className="footer-link">Documentation</a></li>
                <li><a href="#guides" className="footer-link">Guides</a></li>
                <li><a href="#blog" className="footer-link">Blog</a></li>
                <li><a href="#support" className="footer-link">Support Center</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-list">
                <li><a href="#about" className="footer-link">About Us</a></li>
                <li><a href="#careers" className="footer-link">Careers</a></li>
                <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
                <li><a href="#terms" className="footer-link">Terms of Service</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Lower Section: Copyright & Bottom Links */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} VidToText. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy" className="bottom-link">Privacy</a>
            <a href="#terms" className="bottom-link">Terms</a>
            <a href="#cookies" className="bottom-link">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;