import React, { useState } from 'react';
import './header.css';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        
        {/* Brand Logo - Navigates to / */}
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

        {/* Desktop Navigation Menu */}
        <nav className="desktop-nav">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="#pricing" className="nav-link">
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="desktop-actions">
          <button className="btn-secondary">
            Log In
          </button>
          <button className="btn-primary">
            Get Started Free
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-toggle"
          aria-label="Toggle Menu"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <a href="#features" className="mobile-nav-link">
              Features
            </a>
            <a href="#how-it-works" className="mobile-nav-link">
              How It Works
            </a>
            <a href="#pricing" className="mobile-nav-link">
              Pricing
            </a>
            <hr className="divider" />
            <button className="btn-secondary mobile-btn">
              Log In
            </button>
            <button className="btn-primary mobile-btn">
              Get Started Free
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;