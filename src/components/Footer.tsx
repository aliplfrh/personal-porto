import React from 'react';
import { Github, Linkedin, Youtube, Instagram, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <h2 className="footer-heading">Something in mind?</h2>
        <p className="footer-sub">Open to film, editing, and design collaborations.</p>

        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="footer-email">
          View resume
        </a>

        <div className="footer-social">
          <a href="https://github.com/aliplfrh" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/aliplfrh" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <Linkedin size={20} />
          </a>
          <a href="https://youtube.com/@aliplfrh" target="_blank" rel="noopener noreferrer" aria-label="YouTube channel">
            <Youtube size={20} />
          </a>
          <a href="https://instagram.com/aliplfrh" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">
            <Instagram size={20} />
          </a>
          <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" aria-label="Resume">
            <FileText size={20} />
          </a>
        </div>

        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} Alief Lutfa'ul Ridho</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
