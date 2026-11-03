import React from 'react';

const WorldMap: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1200 600"
      className="world-map-svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Continents */}
      <g className="world-map-continents" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15">
        <path d="M 200 150 L 250 120 L 280 140 L 260 180 L 220 200 Z" />
        <path d="M 280 280 L 310 260 L 320 340 L 290 360 Z" />
        <path d="M 540 160 L 580 150 L 600 180 L 560 190 Z" />
        <path d="M 580 220 L 640 200 L 660 340 L 600 360 Z" />
        <path d="M 680 140 L 800 100 L 850 180 L 820 240 L 700 260 Z" />
        <path d="M 900 400 L 940 390 L 950 440 L 920 450 Z" />
      </g>

      {/* Malang marker */}
      <g className="malang-marker">
        <circle cx="875" cy="285" r="12" className="marker-ring" />
        <circle cx="875" cy="285" r="8" className="marker-glow" />
        <circle cx="875" cy="285" r="4" className="marker-dot" />
      </g>
    </svg>
  );
};

export default WorldMap;
