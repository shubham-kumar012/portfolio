import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    elementX: 0,
    elementY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Normalize mouse coordinates to a -1 to +1 range
      const normalizedX = (clientX / windowWidth) * 2 - 1;
      const normalizedY = (clientY / windowHeight) * 2 - 1;

      setMousePosition({
        x: clientX,
        y: clientY,
        normalizedX,
        normalizedY,
      });

      // Set CSS variables so the spotlight follows cursor movement
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}
