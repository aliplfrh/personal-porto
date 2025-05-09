import React from 'react';
import { Github, Linkedin, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <div className="bg-dark-surface py-6 border-t border-dark-border">
      <div className="container mx-auto flex justify-center space-x-6">
        <a
          href="https://github.com/aliplfrh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-accent-red transition-colors duration-300"
          aria-label="GitHub Profile"
        >
          <Github size={24} />
        </a>
        <a
          href="https://linkedin.com/in/aliplfrh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-accent-red transition-colors duration-300"
          aria-label="LinkedIn Profile"
        >
          <Linkedin size={24} />
        </a>
        <a
          href="https://youtube.com/@aliplfrh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-accent-red transition-colors duration-300"
          aria-label="YouTube Channel"
        >
          <Youtube size={24} />
        </a>
        <a
          href="https://instagram.com/aliplfrh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-accent-red transition-colors duration-300"
          aria-label="Instagram Profile"
        >
          <Instagram size={24} />
        </a>
      </div>
    </div>
  );
};

export default Footer;