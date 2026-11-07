import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const lines = [
  'Im a visual artist based in Indonesia,',
  'shaping cinematic edits and visual identities that carry feeling from first frame to last.',
];

// TODO: move into admin content if the portrait should be editable without code.
const PORTRAIT_URL = 'https://i.imgur.com/K35klRx.jpeg';

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

/**
 * Portrait framed by masked hairlines — adapted from the testimonials-2
 * registry layout to this codebase's plain-CSS monochrome system (no
 * Tailwind, no Radix). The photo dissolves into the background with a
 * radial mask while the hairlines fade at their tips.
 */
const Portrait: React.FC = () => (
  <div className="statement-portrait">
    <i className="statement-line statement-line-v statement-line-left" aria-hidden="true" />
    <i className="statement-line statement-line-v statement-line-right" aria-hidden="true" />
    <i className="statement-line statement-line-h statement-line-top" aria-hidden="true" />
    <i className="statement-line statement-line-h statement-line-bottom" aria-hidden="true" />
    <span className="statement-avatar">
      <span className="statement-avatar-fallback" aria-hidden="true">AR</span>
      <img
        src={PORTRAIT_URL}
        alt="Portrait of Alief Lutfa'ul Ridho"
        loading="lazy"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
    </span>
  </div>
);

const Attribution: React.FC = () => (
  <div className="statement-cite">
    <span className="statement-name">Alief Lutfa'ul Ridho</span>
    <span className="statement-role">Visual Artist — Indonesia</span>
  </div>
);

const Statement: React.FC = () => {
  const reduceMotion = useReducedMotion();

  // Without motion the words must render at full opacity — never left dimmed.
  if (reduceMotion) {
    return (
      <div className="statement">
        <div className="container">
          <figure className="statement-card">
            <Portrait />
            <figcaption className="statement-body">
              <p className="statement-text">
                {lines.map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < lines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </p>
              <Attribution />
            </figcaption>
          </figure>
        </div>
      </div>
    );
  }

  return (
    <div className="statement">
      <div className="container">
        <figure className="statement-card">
          <Portrait />
          <figcaption className="statement-body">
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
            <Attribution />
          </figcaption>
        </figure>
      </div>
    </div>
  );
};

export default Statement;
