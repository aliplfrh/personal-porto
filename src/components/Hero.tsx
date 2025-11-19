import React from 'react';
import { Github, Linkedin, Youtube, Instagram, FileText, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProjects = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero section">
      <div className="container">
        <div className="hero-content">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-image">
              <img
                src="https://i.imgur.com/K35klRx.jpeg"
                alt="Profile"
              />
            </div>
            <div className="profile-name">Alief Lutfa'ul Ridho</div>
            <div className="profile-location">
              <span>Based in</span>
              <img
                src="https://flagcdn.com/id.svg"
                alt="Indonesia flag"
              />
              <span>Indonesia</span>
            </div>
          </div>

          <h1 className="hero-title">
            Visual <span className="highlight">Artist</span>
          </h1>
          
          <p className="hero-subtitle">
            Weave together the art of video editing and graphic design, crafting cinematic experiences that stir emotion and leave a lasting impression.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={scrollToProjects}>
              View My Work
            </button>
            <a href="#about" className="btn btn-secondary">
              Learn More
            </a>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <a
              href="https://github.com/aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://youtube.com/@aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
            >
              <Youtube size={24} />
            </a>
            <a
              href="https://instagram.com/aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
            >
              <Instagram size={24} />
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download CV"
            >
              <FileText size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" onClick={scrollToProjects}>
        <span>Scroll Down</span>
        <div className="scroll-arrow">
          <ChevronDown size={24} />
        </div>
      </div>
    </div>
  );
};

export default Hero;