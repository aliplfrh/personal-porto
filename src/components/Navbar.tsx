import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  const onWorks = location.pathname.startsWith('/portofolio');

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 50);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!onHome) return;

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

    ['home', 'about'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onHome]);

  const goToSection = (id: string) => {
    setIsOpen(false);
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const isCurrent = (id: string) => (id === 'works' ? onWorks : onHome && activeSection === id);

  // Mobile menu: lock the page behind it, close on Escape, keep focus inside.
  useEffect(() => {
    if (!isOpen) return;

    const menu = menuRef.current;
    const toggle = toggleRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    document.body.classList.add('nav-open');
    menu?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !menu) return;

      const focusable = Array.from(menu.querySelectorAll<HTMLElement>('a[href], button'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('nav-open');
      // Return focus to the control that opened the menu.
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
      else toggle?.focus();
    };
  }, [isOpen]);

  // Leaving the menu open across a route change strands the overlay over the new page.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav">
        <a
          href="#about"
          className={`nav-link ${isCurrent('about') ? 'current' : ''}`}
          aria-current={isCurrent('about') ? 'location' : undefined}
          onClick={(e) => { e.preventDefault(); goToSection('about'); }}
        >
          About
        </a>

        <Link
          to="/"
          className="logo"
          onClick={(e) => {
            if (onHome) {
              e.preventDefault();
              goToSection('home');
            }
          }}
        >
          aliplfrh
        </Link>

        <Link
          to="/portofolio"
          className={`nav-link ${isCurrent('works') ? 'current' : ''}`}
          aria-current={isCurrent('works') ? 'location' : undefined}
          onClick={() => setIsOpen(false)}
        >
          Works
        </Link>

        <button
          ref={toggleRef}
          onClick={() => setIsOpen((v) => !v)}
          className="mobile-menu-btn"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
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
            ref={menuRef}
            id="mobile-menu"
            className="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
          >
            <ul className="mobile-nav-links">
              <motion.li variants={linkVariants}>
                <a href="#home" onClick={(e) => { e.preventDefault(); goToSection('home'); }}>Home</a>
              </motion.li>
              <motion.li variants={linkVariants}>
                <a href="#about" onClick={(e) => { e.preventDefault(); goToSection('about'); }}>About</a>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Link to="/portofolio" onClick={() => setIsOpen(false)}>Works</Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
