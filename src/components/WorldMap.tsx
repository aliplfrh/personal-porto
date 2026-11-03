import { useEffect, useId, useState } from 'react';

type Position = [number, number];

type Geometry =
  | {
      type: 'Polygon';
      coordinates: Position[][];
    }
  | {
      type: 'MultiPolygon';
      coordinates: Position[][][];
    };

interface WorldData {
  features: Array<{
    geometry: Geometry | null;
  }>;
}

const WIDTH = 1000;
const HEIGHT = 500;

const MAP_URL =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

// Use the same projection for the boundaries and location marker.
function project([longitude, latitude]: Position): Position {
  return [
    ((longitude + 180) / 360) * WIDTH,
    ((90 - latitude) / 180) * HEIGHT,
  ];
}

function ringToPath(ring: Position[]): string {
  if (!ring.length) return '';

  return (
    ring
      .map((position, index) => {
        const [x, y] = project(position);

        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ') + ' Z'
  );
}

function geometryToPath(geometry: Geometry | null): string {
  if (!geometry) return '';

  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(ringToPath).join(' ');
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates
      .flatMap((polygon) => polygon.map(ringToPath))
      .join(' ');
  }

  return '';
}

// Malang, East Java: approximately 112.63° E, 7.98° S.
const [malangX, malangY] = project([112.63, -7.98]);

let cachedPaths: string[] | null = null;

export default function WorldMap() {
  const [paths, setPaths] = useState<string[]>(cachedPaths ?? []);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    cachedPaths ? 'ready' : 'loading'
  );

  const titleId = useId();

  useEffect(() => {
    if (cachedPaths) return;

    const controller = new AbortController();
    let active = true;

    const timeout = window.setTimeout(() => {
      controller.abort();
    }, 10000);

    async function loadMap() {
      try {
        const response = await fetch(MAP_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Map request failed');
        }

        const data = (await response.json()) as WorldData;

        if (!Array.isArray(data.features)) {
          throw new Error('Invalid map data');
        }

        const nextPaths = data.features
          .map((feature) => geometryToPath(feature.geometry))
          .filter(Boolean);

        if (!nextPaths.length) {
          throw new Error('Map boundaries are empty');
        }

        cachedPaths = nextPaths;

        if (active) {
          setPaths(nextPaths);
          setStatus('ready');
        }
      } catch {
        if (active) {
          setStatus('error');
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadMap();

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <style>{`
        .map-widget.widget {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          min-height: 320px;
          padding: 0;
          background: #151515;
        }

        .portfolio-world-map {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at 70% 55%,
              rgba(255, 255, 255, 0.035),
              transparent 65%
            );
        }

        .portfolio-world-map__svg {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          padding: 38px 12px;
        }

        .portfolio-world-map__land {
          fill: #343434;
          stroke: #707070;
          stroke-width: 0.65;
          stroke-linejoin: round;
        }

        .portfolio-world-map__halo {
          fill: rgba(255, 255, 255, 0.055);
          stroke: rgba(255, 255, 255, 0.15);
          stroke-width: 1;
        }

        .portfolio-world-map__pulse {
          fill: none;
          stroke: #ffffff;
          stroke-width: 1.3;
          transform-box: fill-box;
          transform-origin: center;
          animation: portfolio-map-pulse 2.8s ease-out infinite;
        }

        .portfolio-world-map__dot {
          fill: #ffffff;
          stroke: #151515;
          stroke-width: 1.5;
          animation: portfolio-map-blink 2.8s ease-in-out infinite;
        }

        .portfolio-world-map__message {
          position: absolute;
          top: 24px;
          left: 24px;
          max-width: 48%;
          margin: 0;
          color: #b5b5b5;
          font-family: inherit;
          font-size: 12px;
          line-height: 1.5;
        }

        .map-widget .map-location,
        .map-widget .map-overlay {
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(8, 8, 8, 0.88);
        }

        .map-widget .map-location {
          color: #d0d0d0;
        }

        .map-widget .map-overlay {
          font-variant-numeric: tabular-nums;
        }

        @keyframes portfolio-map-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          85%, 100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes portfolio-map-blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.55;
          }
        }

        @media (max-width: 768px) {
          .map-widget.widget {
            min-height: 260px;
          }

          .portfolio-world-map__svg {
            padding: 40px 8px;
          }

          .map-widget .map-location {
            left: 16px;
            bottom: 16px;
            font-size: 12px;
          }

          .map-widget .map-overlay {
            top: 16px;
            right: 16px;
            font-size: 12px;
          }

          .portfolio-world-map__message {
            top: 18px;
            left: 16px;
            max-width: 45%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .portfolio-world-map__pulse,
          .portfolio-world-map__dot {
            animation: none !important;
          }

          .portfolio-world-map__pulse {
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="portfolio-world-map">
        <svg
          className="portfolio-world-map__svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>
            World map with a location marker at Malang, East Java, Indonesia
          </title>

          <g className="portfolio-world-map__land">
            {paths.map((path, index) => (
              <path key={index} d={path} fillRule="evenodd" />
            ))}
          </g>

          <g transform={`translate(${malangX}, ${malangY})`}>
            <circle
              className="portfolio-world-map__halo"
              r="16"
            />
            <circle
              className="portfolio-world-map__pulse"
              r="6"
            />
            <circle
              className="portfolio-world-map__dot"
              r="4.5"
            />
          </g>
        </svg>

        {status !== 'ready' && (
          <p
            className="portfolio-world-map__message"
            role="status"
          >
            {status === 'loading'
              ? 'Loading world map…'
              : 'Map unavailable. Location: Malang, Indonesia.'}
          </p>
        )}
      </div>
    </>
  );
}
