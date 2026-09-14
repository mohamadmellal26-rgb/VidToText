import React, { useState, useRef } from 'react';
import { 
  LuUpload, 
  LuLink, 
  LuImage, 
  LuCheck, 
  LuCloud,
  LuLoader,
  LuInfo
} from 'react-icons/lu';
import { SiDropbox, SiGoogledrive } from 'react-icons/si';
import './herosection.css';

// الاعتماد على متغير البيئة أو رابط Render المباشر
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://vidtotext.onrender.com";

export const HeroSection: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [convertedText, setConvertedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadAndConvert(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadAndConvert(e.target.files[0]);
    }
  };

  const uploadAndConvert = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setConvertedText('');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/convert`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setConvertedText(data.text);
      } else {
        setErrorMessage(data.detail || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Could not connect to the VidToText backend server! Make sure the service is live.");
    } finally {
      setLoading(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="hero-section" dir="ltr">
      <div className="hero-header">
        <h1 className="hero-title">
          <img 
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f916.png" 
            alt="Robot" 
            className="title-robot-img"
          />
          Convert Video to Text <span className="highlight-online">Online</span>
        </h1>
        <p className="hero-subtitle">
          This video converter allows you to transform your video files into readable text effortlessly.
        </p>
      </div>

      <div 
        className={`upload-box ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          className="file-input" 
          accept="video/*" 
          onChange={handleChange} 
        />

        <div className="upload-icon-wrapper">
          {loading ? (
            <LuLoader className="upload-icon animate-spin" />
          ) : (
            <LuUpload className="upload-icon" />
          )}
        </div>

        <button className="btn-upload" onClick={onButtonClick} disabled={loading}>
          {loading ? "Processing AI..." : "Upload File"}
        </button>

        <p className="upload-note">
          {loading ? "Transcribing video audio with Whisper AI..." : "or drop, paste, or select from cloud"}
        </p>

        <div className="secondary-actions">
          <button className="btn-link">
            <LuLink size={16} />
            Paste Link
          </button>
          <button className="btn-link">
            <LuImage size={16} />
            Try a Sample
          </button>
        </div>

        <div className="cloud-buttons">
          <button className="cloud-btn">
            <span>OneDrive</span>
            <LuCloud size={14} />
          </button>
          <button className="cloud-btn">
            <span>Dropbox</span>
            <SiDropbox size={14} />
          </button>
          <button className="cloud-btn">
            <span>Google Drive</span>
            <SiGoogledrive size={14} />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div style={{ width: '100%', marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: '#fef2f2', padding: '16px 20px', borderRadius: '12px', border: '1px solid #fecaca', color: '#991b1b' }}>
          <LuInfo size={22} style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{errorMessage}</p>
        </div>
      )}

      {convertedText && (
        <div style={{ width: '100%', marginTop: '24px', textAlign: 'left', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#1e293b' }}>Converted Result:</h3>
          <p style={{ margin: 0, color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{convertedText}</p>
        </div>
      )}

      <div className="features-bar">
        <div className="feature-item">
          <LuCheck className="check-icon" />
          <span>100% Free</span>
        </div>
        <div className="feature-item">
          <LuCheck className="check-icon" />
          <span>No Installation Needed</span>
        </div>
        <div className="feature-item">
          <LuCheck className="check-icon" />
          <span>Secure & Private</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;