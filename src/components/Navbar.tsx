import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { navigationItems } from '../data/navigation';

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
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-sm py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold tracking-tighter">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="text-white">alip</span><span className="text-accent-red">lfrh</span>
            </motion.span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => scrollToSection(item.path)}
                  className="text-sm font-medium px-4 transition-colors duration-200 hover:text-accent-red text-gray-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 focus:outline-none"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-black/95 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => scrollToSection(item.path)}
                className="text-lg font-medium py-2 transition-colors duration-200 hover:text-accent-red text-gray-300"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;