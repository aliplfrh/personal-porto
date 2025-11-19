import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (path: string) => {
    const element = document.querySelector(path);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          <a href="#home" className="logo">
            aliplfrh
          </a>

          {/* Desktop Navigation */}
          <ul className="nav-links">
            <li>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}>
                About
              </a>
            </li>
            <li>
              <a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollToSection('#portfolio'); }}>
                Portfolio
              </a>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-btn"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu">
            <ul className="mobile-nav-links">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}>
                  About
                </a>
              </li>
              <li>
                <a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollToSection('#portfolio'); }}>
                  Portfolio
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;