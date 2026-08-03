import React, { useEffect, useRef } from 'react';

export default function PaperGrain() {
  const grainRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let step = 0;

    const animateGrain = () => {
      step = (step + 1) % 4;
      if (grainRef.current) {
        // Add a subtle jitter so the paper texture feels alive
        const xShift = (step % 2) * 0.5;
        const yShift = Math.floor(step / 2) * 0.5;
        grainRef.current.style.transform = `translate(${xShift}px, ${yShift}px)`;
      }
      animationFrameId = requestAnimationFrame(animateGrain);
    };

    animationFrameId = requestAnimationFrame(animateGrain);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99] overflow-hidden opacity-[0.038] mix-blend-multiply select-none">
      <div
        ref={grainRef}
        className="absolute -top-[10px] -left-[10px] h-[calc(100vh+20px)] w-[calc(100vw+20px)] paper-grain-overlay"
      />
    </div>
  );
}
