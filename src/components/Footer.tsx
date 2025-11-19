import React from 'react';
import { Github, Linkedin, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-social">
          <a
            href="https://github.com/aliplfrh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/aliplfrh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://youtube.com/@aliplfrh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Channel"
          >
            <Youtube size={20} />
          </a>
          <a
            href="https://instagram.com/aliplfrh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;