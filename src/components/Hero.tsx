import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, Github, Linkedin, Youtube, Instagram, FileText } from 'lucide-react';

const Hero: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const scrollToProjects = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 1.2,
      },
    },
    bounce: {
      y: [0, 10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Hero content */}
      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center"
        >
          {/* Profile Section */}
          <motion.div 
            variants={titleVariants}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img
                src="https://i.imgur.com/K35klRx.jpeg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xl text-white mb-2">Alief Lutfa'ul Ridho</div>
            <div className="text-gray-400 flex items-center gap-2">
              <span>Based in</span>
              <img
                src="https://flagcdn.com/id.svg"
                alt="Indonesia flag"
                className="w-5 h-auto inline-block"
              />
              <span>Indonesia</span>
            </div>
          </motion.div>

          <motion.h1 variants={titleVariants} className="text-6xl md:text-8xl font-bold mb-6">
            Visual <span className="text-accent-red">Artist</span>
          </motion.h1>
          
          <motion.p variants={subtitleVariants} className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300">
            Weave together the art of video editing and graphic design, crafting cinematic experiences that stir emotion and leave a lasting impression.
          </motion.p>

          {/* Social Links */}
          <motion.div
            variants={subtitleVariants}
            className="flex justify-center space-x-6"
          >
            <a
              href="https://github.com/aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-red transition-colors duration-300"
              aria-label="GitHub Profile"
            >
              <Github size={28} />
            </a>
            <a
              href="https://linkedin.com/in/aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-red transition-colors duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={28} />
            </a>
            <a
              href="https://youtube.com/@aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-red transition-colors duration-300"
              aria-label="YouTube Channel"
            >
              <Youtube size={28} />
            </a>
            <a
              href="https://instagram.com/aliplfrh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-red transition-colors duration-300"
              aria-label="Instagram Profile"
            >
              <Instagram size={28} />
            </a>
            <a
              href="/cv.pdf" // You can update this link to point to your actual CV
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-red transition-colors duration-300"
              aria-label="Download CV"
            >
              <FileText size={28} />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 w-full flex justify-center text-white cursor-pointer"
        initial="hidden"
        animate={inView ? ['visible', 'bounce'] : 'hidden'}
        variants={scrollIndicatorVariants}
        onClick={scrollToProjects}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 text-gray-400">Scroll Down</span>
          <ChevronDown size={24} className="text-accent-red" />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;