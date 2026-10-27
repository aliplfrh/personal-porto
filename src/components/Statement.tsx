import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const lines = [
  "Alief Lutfa'ul Ridho is a visual artist based in Indonesia,",
  'shaping cinematic edits and visual identities that carry feeling from first frame to last.',
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045 },
  },
};

const word = {
  hidden: { color: 'rgba(255, 255, 255, 0.28)' },
  visible: {
    color: '#ffffff',
    transition: { duration: 0.7, ease: EASE },
  },
};

const Statement: React.FC = () => {
  return (
    <div className="statement">
      <div className="container">
        <motion.p
          className="statement-text"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          {lines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {line.split(' ').map((w, i) => (
                <motion.span
                  key={`${lineIndex}-${i}`}
                  className="statement-word"
                  variants={word}
                  style={{ display: 'inline-block' }}
                >
                  {w}
                  {i < line.split(' ').length - 1 ? '\u00A0' : ''}
                </motion.span>
              ))}
              {lineIndex < lines.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </motion.p>
      </div>
    </div>
  );
};

export default Statement;
