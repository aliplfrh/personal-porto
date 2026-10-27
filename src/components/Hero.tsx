import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Youtube, Instagram, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentArt, setCurrentArt] = useState(0);

  const artworks = [
    'https://i.imgur.com/pxSB012.png',
    'https://i.imgur.com/bR28g7Z.png',
    'https://upload.wikimedia.org/wikipedia/commons/b/bb/Logo_Universitas_Brawijaya.svg'
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
        hour12: false
      };
      const timeString = now.toLocaleTimeString('en-US', options);
      setCurrentTime(`${timeString} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const nextArt = () => {
    setCurrentArt((prev) => (prev + 1) % artworks.length);
  };

  const prevArt = () => {
    setCurrentArt((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  return (
    <div className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="profile-widget widget">
            <div className="profile-avatar">
              <img
                src="https://i.imgur.com/K35klRx.jpeg"
                alt="Profile"
              />
            </div>
            <div className="profile-info">
              <h1 className="profile-greeting gradient-heading">Hey, I'm Alief</h1>
              <div className="profile-status">
                <span className="status-dot"></span>
                Available for work
              </div>
              <p className="profile-bio">
                I'm a Visual Artist specializing in cinematic video editing and expressive design.
                Weaving together the art of video editing and graphic design, crafting cinematic experiences that stir emotion and leave a lasting impression.
              </p>
              <div className="profile-location">
                <span>Based in</span>
                <img
                  src="https://flagcdn.com/id.svg"
                  alt="Indonesia flag"
                />
                <span>Indonesia</span>
              </div>
              <div className="social-links">
                <a
                  href="https://github.com/aliplfrh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://linkedin.com/in/aliplfrh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://youtube.com/@aliplfrh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
                <a
                  href="https://instagram.com/aliplfrh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Resume"
                >
                  <FileText size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="map-widget widget">
            <img
              src="https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/112.7521,-7.9666,8,0/800x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
              alt="Map of Indonesia"
              className="map-image"
            />
            <div className="map-overlay">
              {currentTime}
            </div>
          </div>

          <div className="tech-widget widget">
            <h3>Tech Stack</h3>
            <div className="tech-grid">
              <div className="tech-item">
                <img src="https://www.adobe.com/content/dam/cc/icons/premiere.svg" alt="Premiere Pro" className="tech-icon" />
                <span className="tech-name">Premiere</span>
              </div>
              <div className="tech-item">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg" alt="DaVinci" className="tech-icon" />
                <span className="tech-name">DaVinci</span>
              </div>
              <div className="tech-item">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Logo_AffinityDesigner.svg" alt="Affinity Designer" className="tech-icon" />
                <span className="tech-name">Designer</span>
              </div>
              <div className="tech-item">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Logo_AffinityPhoto.svg" alt="Affinity Photo" className="tech-icon" />
                <span className="tech-name">Photo</span>
              </div>
              <div className="tech-item">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" className="tech-icon" />
                <span className="tech-name">Figma</span>
              </div>
              <div className="tech-item">
                <img src="https://upload.wikimedia.org/wikipedia/en/a/a0/Capcut-logo.svg" alt="CapCut" className="tech-icon" />
                <span className="tech-name">CapCut</span>
              </div>
            </div>
          </div>

          <div className="code-widget widget">
            <div className="code-header">
              <span className="code-dot red"></span>
              <span className="code-dot yellow"></span>
              <span className="code-dot green"></span>
            </div>
            <div className="code-content">
              <div className="code-line">
                <span className="code-keyword">const</span> <span className="code-function">passion</span> = <span className="code-string">"I like to make things"</span>;
              </div>
              <div className="code-line" style={{ marginTop: '0.5rem' }}>
                <span className="code-keyword">function</span> <span className="code-function">create</span>() {'{'}
              </div>
              <div className="code-line" style={{ paddingLeft: '1.5rem' }}>
                <span className="code-keyword">return</span> <span className="code-string">"Cinematic experiences"</span>;
              </div>
              <div className="code-line">
                {'}'}
              </div>
            </div>
          </div>

          <div className="art-widget widget">
            <div className="art-image">
              <img src={artworks[currentArt]} alt="Artwork" />
            </div>
            <p className="art-label">by: aliplfrh</p>
            <div className="art-controls">
              <button className="art-btn" onClick={prevArt} aria-label="Previous artwork">
                <ChevronLeft size={18} />
              </button>
              <button className="art-btn" onClick={nextArt} aria-label="Next artwork">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="badge-widget widget">
            <div className="badge-letter">A</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
