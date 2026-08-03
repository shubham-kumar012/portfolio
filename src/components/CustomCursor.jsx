import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [hoverState, setHoverState] = useState('default'); // tracks element type under cursor
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate custom cursor on desktop devices with fine pointer input
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.body.classList.add('custom-cursor-active');
    setIsVisible(true);

    const dotX = gsap.quickTo(cursorDotRef.current, 'x', { duration: 0.1, ease: 'power3.out' });
    const dotY = gsap.quickTo(cursorDotRef.current, 'y', { duration: 0.1, ease: 'power3.out' });
    const ringX = gsap.quickTo(cursorRingRef.current, 'x', { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(cursorRingRef.current, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor]');
      if (!target) {
        setHoverState('default');
        return;
      }

      const cursorType = target.getAttribute('data-cursor') || (target.tagName === 'BUTTON' ? 'button' : 'link');
      setHoverState(cursorType);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none">
      {/* Outer trailing ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out ${
          hoverState === 'button'
            ? 'h-16 w-16 border-[#6F5A43] bg-[#6F5A43]/10 scale-125'
            : hoverState === 'link'
            ? 'h-12 w-12 border-[#171717]/60 bg-transparent scale-110'
            : hoverState === 'card'
            ? 'h-20 w-20 border-[#6F5A43]/30 bg-[#6F5A43]/5 scale-100'
            : 'h-9 w-9 border-[#171717]/30 bg-transparent'
        }`}
      />
      {/* Inner pointer dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#171717] transition-transform duration-200 ${
          hoverState === 'button'
            ? 'h-3 w-3 bg-[#6F5A43]'
            : hoverState === 'link'
            ? 'h-2 w-2 bg-[#171717]'
            : 'h-1.5 w-1.5'
        }`}
      />
    </div>
  );
}
