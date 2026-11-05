import { useEffect, useState } from 'react';

const formatTime = () => {
  const now = new Date();
  return `${now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false,
  })} WIB`;
};

/**
 * Isolated so the once-per-second tick re-renders only this node.
 * The map widget's SVG has hundreds of paths and must not remount each second.
 */
const Clock = () => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    // Align the first tick to the top of the next minute, then tick every minute.
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      setTime(formatTime());
      interval = setInterval(() => setTime(formatTime()), 60000);
    }, 60000 - (Date.now() % 60000));

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="map-overlay">
      <span className="map-overlay-time">{time}</span>
    </div>
  );
};

export default Clock;
