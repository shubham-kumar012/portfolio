import React, { useEffect, useRef } from 'react';

export default function PaperGrain() {
  const grainRef = useRef(null);

  useEffect(() => {
    let step = 0;
    // Throttle paper grain jitter animation (~6 FPS) instead of raw requestAnimationFrame (60-144 FPS)
    // This preserves the subtle live paper texture movement while saving 95%+ GPU blend-mode compositor overhead
    const intervalId = setInterval(() => {
      step = (step + 1) % 4;
      if (grainRef.current) {
        const xShift = (step % 2) * 0.5;
        const yShift = Math.floor(step / 2) * 0.5;
        grainRef.current.style.transform = `translate3d(${xShift}px, ${yShift}px, 0)`;
      }
    }, 150);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden opacity-[0.038] mix-blend-multiply select-none">
      <div
        ref={grainRef}
        className="absolute -top-[10px] -left-[10px] h-[calc(100vh+20px)] w-[calc(100vw+20px)] paper-grain-overlay will-change-transform"
      />
    </div>
  );
}
