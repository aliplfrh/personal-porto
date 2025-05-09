import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    // Only use custom cursor on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
      setHidden(false);
      
      const addEventListeners = () => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
      };
      
      const removeEventListeners = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseenter', onMouseEnter);
        document.removeEventListener('mouseleave', onMouseLeave);
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      const onMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };
      
      const onMouseEnter = () => {
        setHidden(false);
      };
      
      const onMouseLeave = () => {
        setHidden(true);
      };
      
      const onMouseDown = () => {
        setClicked(true);
      };
      
      const onMouseUp = () => {
        setClicked(false);
      };
      
      // Track link hovers
      const handleLinkHoverStart = () => setLinkHovered(true);
      const handleLinkHoverEnd = () => setLinkHovered(false);
      
      const addLinkEvents = () => {
        document.querySelectorAll('a, button').forEach(el => {
          el.addEventListener('mouseenter', handleLinkHoverStart);
          el.addEventListener('mouseleave', handleLinkHoverEnd);
        });
      };
      
      const removeLinkEvents = () => {
        document.querySelectorAll('a, button').forEach(el => {
          el.removeEventListener('mouseenter', handleLinkHoverStart);
          el.removeEventListener('mouseleave', handleLinkHoverEnd);
        });
      };
      
      addEventListeners();
      addLinkEvents();
      
      // Use MutationObserver to detect DOM changes and reattach events to new links
      const observer = new MutationObserver(() => {
        removeLinkEvents();
        addLinkEvents();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => {
        removeEventListeners();
        removeLinkEvents();
        observer.disconnect();
      };
    }
  }, []);

  if (hidden) return null;

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.5 : 1})`,
          backgroundColor: linkHovered ? '#E63946' : 'white',
        }}
      />
      <div
        className="cursor-outline"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.9 : 1})`,
          borderColor: linkHovered ? 'rgba(230, 57, 70, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          width: linkHovered ? '60px' : '40px',
          height: linkHovered ? '60px' : '40px',
        }}
      />
    </>
  );
};

export default CustomCursor;