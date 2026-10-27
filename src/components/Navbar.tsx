import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'portfolio', label: 'Portfolio' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
      <div className="nav">
        <a
          href="#home"
          className="logo"
          onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
        >
          aliplfrh
        </a>

        <ul className="nav-links">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? 'current' : ''}
                aria-current={activeSection === id ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); scrollToSection(`#${id}`); }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="mobile-menu-btn"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <motion.span
            className="hamburger-line"
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -4 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <motion.span
            className="hamburger-line"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.2, ease: EASE }}
          />
          <motion.span
            className="hamburger-line"
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 4 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
          >
            <ul className="mobile-nav-links">
              {sections.map(({ id, label }) => (
                <motion.li key={id} variants={linkVariants}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => { e.preventDefault(); scrollToSection(`#${id}`); }}
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
