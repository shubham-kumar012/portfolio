import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  {
    id: '01',
    title: 'It Started With Curiosity',
    description:
      'My interest in technology began with a simple curiosity about how websites and applications actually work.',
    align: 'left',
    nodePosition: { cx: 220, cy: 230 },
  },
  {
    id: '02',
    title: 'Learned Java & DSA',
    description:
      'I built a strong programming foundation with Java while solving 600+ DSA problems to improve logical thinking.',
    align: 'right',
    nodePosition: { cx: 780, cy: 560 },
  },
  {
    id: '03',
    title: 'Built Frontend Experiences',
    description:
      'I discovered React and started creating clean, responsive, and animated user interfaces.',
    align: 'left',
    nodePosition: { cx: 220, cy: 930 },
  },
  {
    id: '04',
    title: 'Started Building Full Stack Products',
    description:
      'I moved beyond frontend and started building complete applications using Node.js, Express, MongoDB, PostgreSQL and modern deployment platforms.',
    align: 'right',
    nodePosition: { cx: 780, cy: 1300 },
  },
  {
    id: '05',
    title: 'Still Learning Every Day',
    description:
      "Every project teaches me something new. I'm constantly improving my design thinking, backend architecture and user experience.",
    align: 'left',
    nodePosition: { cx: 300, cy: 1650 },
  },
];

// Smooth bezier curve connecting each milestone down the timeline
const SVG_PATH_D = `
  M 500 50
  C 420 110, 220 130, 220 230
  C 220 370, 780 390, 780 560
  C 780 740, 220 760, 220 930
  C 220 1110, 780 1130, 780 1300
  C 780 1470, 300 1490, 300 1650
  C 300 1780, 500 1820, 500 1920
`;

export default function JourneySection() {
  const containerRef = useRef(null);
  const pathContainerRef = useRef(null);
  const maskPathRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [cardTilts, setCardTilts] = useState({});

  useEffect(() => {
    const maskPath = maskPathRef.current;
    if (!maskPath || !pathContainerRef.current) return;

    const pathLength = maskPath.getTotalLength();

    // Hide the path stroke initially so we can draw it on scroll
    gsap.set(maskPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const ctx = gsap.context(() => {
      // 1. Animate the path stroke as the user scrolls
      gsap.to(maskPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: pathContainerRef.current,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.4, // Keeps line drawing smooth and responsive
          onUpdate: (self) => {
            const p = self.progress;
            let active = -1;
            if (p >= 0.77) active = 4;
            else if (p >= 0.60) active = 3;
            else if (p >= 0.41) active = 2;
            else if (p >= 0.23) active = 1;
            else if (p >= 0.08) active = 0;

            setActiveIndex(active);
          },
        },
      });

      // 2. Smoothly float and fade in each milestone card on scroll
      MILESTONES.forEach((_, idx) => {
        const cardEl = containerRef.current?.querySelector(`#journey-card-${idx}`);
        if (cardEl) {
          gsap.fromTo(
            cardEl,
            { y: 55, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardEl,
                start: 'top 85%',
                end: 'top 45%',
                scrub: 0.5, // Synchronized smooth scroll progression without sudden jumps
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Calculate 3D tilt based on cursor movement
  const handleMouseMove = (e, idx) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 8;
    const rotateY = (x / rect.width) * 8;

    setCardTilts((prev) => ({
      ...prev,
      [idx]: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
    }));
  };

  const handleMouseLeave = (idx) => {
    setCardTilts((prev) => ({
      ...prev,
      [idx]: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    }));
  };

  return (
    <section
      ref={containerRef}
      id="journey"
      className="relative w-full pt-10 md:pt-16 pb-28 md:pb-36 bg-[#F6F2EC] text-[#171717] overflow-hidden selection:bg-[#6F5A43] selection:text-[#F6F2EC]"
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 mb-16 md:mb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D9D0C3] bg-[#ECE5DA]/50 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest text-[#6F5A43] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6F5A43] animate-pulse" />
          <span>02 #Story</span>
        </div>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-[#171717] max-w-3xl mx-auto leading-none">
          THE JOURNEY SO FAR
        </h2>
        <p className="mt-4 text-[#171717]/70 font-editorial text-sm sm:text-base max-w-lg mx-auto tracking-wide">
          An evolving trajectory shaped by continuous curiosity, technical discipline, and visual craftsmanship.
        </p>
      </div>

      {/* Timeline path and cards wrapper */}
      <div ref={pathContainerRef} className="relative max-w-6xl mx-auto px-6 min-h-[1950px]">
        {/* SVG curved timeline path */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden md:block"
          viewBox="0 0 1000 1950"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            {/* Soft glow filter for active nodes */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Mask to progressively reveal the line on scroll */}
            <mask id="journey-mask">
              <path
                ref={maskPathRef}
                d={SVG_PATH_D}
                stroke="#FFFFFF"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
            </mask>
          </defs>

          {/* Faint guide line */}
          <path
            d={SVG_PATH_D}
            stroke="#D9D0C3"
            strokeWidth="2"
            strokeDasharray="4 10"
            strokeLinecap="round"
            fill="none"
          />

          {/* Active colored line filled on scroll */}
          <path
            d={SVG_PATH_D}
            stroke="#6F5A43"
            strokeWidth="2.5"
            strokeDasharray="4 10"
            strokeLinecap="round"
            fill="none"
            mask="url(#journey-mask)"
          />

          {/* Interactive milestone points on path */}
          {MILESTONES.map((m, idx) => {
            const isActive = idx <= activeIndex;

            return (
              <g key={`node-${m.id}`}>
                {/* Soft glow aura */}
                <circle
                  cx={m.nodePosition.cx}
                  cy={m.nodePosition.cy}
                  r={isActive ? 14 : 8}
                  fill={isActive ? 'rgba(111, 90, 67, 0.2)' : 'transparent'}
                  className="transition-all duration-500 ease-out"
                />

                {/* Node circle */}
                <circle
                  cx={m.nodePosition.cx}
                  cy={m.nodePosition.cy}
                  r={isActive ? 8 : 5}
                  fill={isActive ? '#6F5A43' : '#F6F2EC'}
                  stroke="#6F5A43"
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className="transition-all duration-500 ease-out cursor-pointer"
                  filter={isActive ? 'url(#node-glow)' : undefined}
                />
              </g>
            );
          })}
        </svg>

        {/* Milestone cards layer */}
        <div className="relative z-10 space-y-28 md:space-y-0">
          {MILESTONES.map((milestone, idx) => {
            const isActive = idx === activeIndex;
            const isLeft = milestone.align === 'left';

            // Vertical positioning offset matching SVG node coordinates
            const topPositions = ['top-[160px]', 'top-[490px]', 'top-[860px]', 'top-[1230px]', 'top-[1580px]'];

            return (
              <div
                key={milestone.id}
                id={`journey-card-${idx}`}
                className={`w-full md:absolute ${topPositions[idx]} flex ${
                  isLeft ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Milestone card */}
                <div
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseLeave={() => handleMouseLeave(idx)}
                  style={{
                    transform: cardTilts[idx] || 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className={`relative group w-full md:w-[440px] p-8 md:p-9 rounded-2xl border transition-colors duration-500 ${
                    isActive
                      ? 'bg-[#ECE5DA] border-[#6F5A43]/50 shadow-card-hover'
                      : 'bg-[#ECE5DA]/80 border-[#D9D0C3] shadow-card-soft hover:border-[#6F5A43]/30 hover:bg-[#ECE5DA]'
                  }`}
                >
                  {/* Card header with milestone ID */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-editorial text-xs font-bold tracking-widest text-[#6F5A43] uppercase">
                      Milestone // {milestone.id}
                    </span>
                    <span
                      className={`inline-block w-2 h-2 rounded-full transition-all duration-500 ${
                        isActive
                          ? 'bg-[#6F5A43] shadow-[0_0_8px_rgba(111,90,67,0.8)] scale-125'
                          : 'bg-[#D9D0C3]'
                      }`}
                    />
                  </div>

                  {/* Milestone title */}
                  <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-[#171717] tracking-tight leading-snug mb-3 group-hover:text-[#6F5A43] transition-colors duration-300">
                    {milestone.title}
                  </h3>

                  {/* Milestone description */}
                  <p className="text-sm md:text-base text-[#171717]/80 leading-relaxed font-sans font-normal">
                    {milestone.description}
                  </p>

                  {/* Subtle accent glow on hover */}
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#6F5A43]/0 via-[#6F5A43]/5 to-[#6F5A43]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
