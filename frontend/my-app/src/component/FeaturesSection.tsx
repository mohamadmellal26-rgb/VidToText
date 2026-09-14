import React from 'react';
import { LuMusic, LuSlidersHorizontal, LuLock, LuStar, LuPlay, LuBot } from 'react-icons/lu';
import './FeaturesSection.css';

interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeaturesSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      id: 'audio-only',
      icon: (
        <span className="feature-icon">
          <LuMusic />
        </span>
      ),
      title: 'Accurate Speech Extraction',
      description: 'Upload your video files to extract clean audio and generate highly accurate readable text transcripts within seconds.',
    },
    {
      id: 'bitrate-channels',
      icon: (
        <span className="feature-icon">
          <LuSlidersHorizontal />
        </span>
      ),
      title: 'Custom Engine Settings',
      description: 'Advanced processing supporting multiple languages, punctuation restoration, and automatic speaker identification.',
    },
    {
      id: 'no-install',
      icon: (
        <span className="feature-icon">
          <LuLock />
        </span>
      ),
      title: 'No Installation Needed',
      description: 'All conversions run directly on cloud servers via encrypted channels. No software downloads or registration required.',
    },
  ];

  return (
    <section className="features-container" dir="ltr">
      {/* 1. Social Proof / Trust Banner */}
      <div className="trust-banner">
        <div className="rating-box">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star-icon">
                <LuStar />
              </span>
            ))}
          </div>
          <span className="rating-text">
            <strong>5.0/5</strong> Rate this tool
          </span>
        </div>

        <div className="trusted-by">
          <span className="trusted-label">Trusted by:</span>
          <div className="brand-logos">
            <span className="brand-text font-serif">Stanford</span>
            <span className="brand-text">HP</span>
            <span className="brand-text">UNESCO</span>
            <span className="brand-text font-bold">amazon</span>
          </div>
        </div>
      </div>

      <div className="features-content">
        <h2 className="features-main-title">
          <span className="title-robot-icon">
            <LuBot />
          </span>{' '}
          Why Convert Video to Text With Us?
        </h2>

        {/* 2. Demo Video Section */}
        <div className="video-demo-section">
          <div className="video-header">
            <span className="video-badge-icon">
              <LuPlay />
            </span>
            <span>See How It Works</span>
          </div>
          <div className="video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dg_TWk8Zfjk"
              title="Speech to Text Technology Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* 3. Main Features Grid */}
        <div className="features-grid">
          {features.map((item) => (
            <div key={item.id} className="feature-card">
              <div className="icon-wrapper">{item.icon}</div>
              <h3 className="feature-card-title">{item.title}</h3>
              <p className="feature-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;