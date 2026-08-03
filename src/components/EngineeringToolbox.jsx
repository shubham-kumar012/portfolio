import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TechLogo from './TechLogos.jsx';

gsap.registerPlugin(ScrollTrigger);

// 5 Engineering Laboratory Conveyor Belts Data
const CONVEYOR_ROWS = [
  {
    id: 'frontend',
    category: 'Frontend',
    direction: 'left-to-right', // Moves Left -> Right
    speed: 38, // seconds for one full seamless loop
    technologies: [
      {
        name: 'React',
        description: 'Building interactive user interfaces with modern component architecture.',
        brandColor: '#61DAFB',
        usedIn: ['Source Thread', 'Cloudee', 'TwoGood'],
        iconType: 'react',
      },
      {
        name: 'HTML',
        description: 'Semantic structure, web accessibility, and robust DOM hierarchy.',
        brandColor: '#E34F26',
        usedIn: ['TickDone', 'Cloudee'],
        iconType: 'html',
      },
      {
        name: 'CSS',
        description: 'Custom styling, fluid layouts, keyframe motion, and design tokens.',
        brandColor: '#1572B6',
        usedIn: ['Cloudee', 'TwoGood'],
        iconType: 'css',
      },
      {
        name: 'JavaScript',
        description: 'Core programming language, asynchronous data flows, and interactive DOM.',
        brandColor: '#F7DF1E',
        usedIn: ['Source Thread', 'Cloudee', 'TwoGood'],
        iconType: 'javascript',
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework for rapid, responsive UI design.',
        brandColor: '#06B6D4',
        usedIn: ['Source Thread', 'TwoGood'],
        iconType: 'tailwind',
      },
      {
        name: 'Bootstrap',
        description: 'Responsive grid utilities and rapid component scaffolding.',
        brandColor: '#7952B3',
        usedIn: ['TickDone'],
        iconType: 'bootstrap',
      },
    ],
  },
  {
    id: 'backend',
    category: 'Backend',
    direction: 'right-to-left', // Moves Right -> Left
    speed: 42,
    technologies: [
      {
        name: 'Node.js',
        description: 'Fast, event-driven server-side JavaScript runtime environment.',
        brandColor: '#339933',
        usedIn: ['TickDone', 'Source Thread'],
        iconType: 'nodejs',
      },
      {
        name: 'Express.js',
        description: 'Minimalist web framework for routing, middleware, and API endpoints.',
        brandColor: '#171717',
        usedIn: ['TickDone'],
        iconType: 'express',
      },
      {
        name: 'REST API',
        description: 'Scalable HTTP communications and decoupled client-server endpoints.',
        brandColor: '#FF6C37',
        usedIn: ['Source Thread', 'Cloudee'],
        iconType: 'restapi',
      },
      {
        name: 'Strapi',
        description: 'Headless CMS engine for structured content delivery and schemas.',
        brandColor: '#4945FF',
        usedIn: ['Source Thread'],
        iconType: 'strapi',
      },
    ],
  },
  {
    id: 'database',
    category: 'Database',
    direction: 'left-to-right', // Moves Left -> Right
    speed: 40,
    technologies: [
      {
        name: 'MongoDB',
        description: 'Flexible NoSQL document database engineered for JSON data.',
        brandColor: '#47A248',
        usedIn: ['TickDone'],
        iconType: 'mongodb',
      },
      {
        name: 'PostgreSQL',
        description: 'ACID-compliant relational database engine for robust data integrity.',
        brandColor: '#4169E1',
        usedIn: ['Source Thread'],
        iconType: 'postgresql',
      },
      {
        name: 'SQL',
        description: 'Relational data query language, indexing, and transactional logic.',
        brandColor: '#00758F',
        usedIn: ['Source Thread'],
        iconType: 'sql',
      },
      {
        name: 'Cloudinary',
        description: 'Cloud media optimization, asset transformations, and CDN delivery.',
        brandColor: '#3448C5',
        usedIn: ['Source Thread'],
        iconType: 'cloudinary',
      },
    ],
  },
  {
    id: 'deployment',
    category: 'Deployment',
    direction: 'right-to-left', // Moves Right -> Left
    speed: 44,
    technologies: [
      {
        name: 'Render',
        description: 'Unified cloud host for Node.js web services and databases.',
        brandColor: '#46E3B7',
        usedIn: ['TickDone'],
        iconType: 'render',
      },
      {
        name: 'Vercel',
        description: 'Edge network deployment platform optimized for instant builds.',
        brandColor: '#171717',
        usedIn: ['Source Thread', 'TwoGood'],
        iconType: 'vercel',
      },
      {
        name: 'Netlify',
        description: 'Automated CI/CD hosting pipeline for modern web applications.',
        brandColor: '#00C7B7',
        usedIn: ['Cloudee'],
        iconType: 'netlify',
      },
    ],
  },
  {
    id: 'development',
    category: 'Development',
    direction: 'left-to-right', // Moves Left -> Right
    speed: 45,
    technologies: [
      {
        name: 'Java',
        description: 'Strongly-typed object-oriented language for foundational logic.',
        brandColor: '#ED8B00',
        usedIn: ['Core Logic'],
        iconType: 'java',
      },
      {
        name: 'DSA',
        description: 'Data Structures & Algorithms: 600+ solved problems for optimal complexity.',
        brandColor: '#E07040',
        usedIn: ['Source Thread', 'TickDone'],
        iconType: 'dsa',
      },
      {
        name: 'Postman',
        description: 'API development environment for endpoint testing and inspection.',
        brandColor: '#FF6C37',
        usedIn: ['Source Thread', 'TickDone'],
        iconType: 'postman',
      },
      {
        name: 'Figma',
        description: 'Interface design, prototyping, wireframing, and component systems.',
        brandColor: '#F24E1E',
        usedIn: ['Source Thread', 'TickDone', 'Cloudee', 'TwoGood'],
        iconType: 'figma',
      },
      {
        name: 'Git',
        description: 'Distributed version control system tracking codebase history.',
        brandColor: '#F05032',
        usedIn: ['Source Thread', 'TickDone', 'Cloudee', 'TwoGood'],
        iconType: 'git',
      },
      {
        name: 'GitHub',
        description: 'Cloud code repository hosting, PR reviews, and release workflows.',
        brandColor: '#181717',
        usedIn: ['Source Thread', 'TickDone', 'Cloudee', 'TwoGood'],
        iconType: 'github',
      },
    ],
  },
];

export default function EngineeringToolbox() {
  // Currently hovered row ID (pauses ONLY that specific row)
  const [hoveredRowId, setHoveredRowId] = useState(null);
  // Currently active expanded card name (only one expanded card at a time)
  const [activeCardName, setActiveCardName] = useState(null);
  // Viewport visibility state to pause animations off-screen for 60 FPS performance
  const [isSectionVisible, setIsSectionVisible] = useState(true);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const conveyorsContainerRef = useRef(null);
  const footerRef = useRef(null);

  // 1. GSAP ScrollTrigger Entrance Animation for Header, Conveyors & Footer
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal animation
      gsap.fromTo(
        headerRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Conveyor rows sequential slide-in
      const rowEls = conveyorsContainerRef.current?.querySelectorAll('.conveyor-row-item');
      if (rowEls && rowEls.length > 0) {
        gsap.fromTo(
          rowEls,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: conveyorsContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Editorial quote reveal
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. IntersectionObserver to pause conveyor motion off-screen for 60 FPS performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="toolbox"
      className="relative w-full pt-28 md:pt-36 pb-6 md:pb-10 bg-[#F6F2EC] text-[#171717] overflow-hidden selection:bg-[#6F5A43] selection:text-[#F6F2EC]"
    >
      {/* Huge Background Transparent Editorial Typography: TOOLBOX */}
      <div className="absolute top-12 left-0 w-full flex justify-center pointer-events-none z-0 overflow-hidden leading-none select-none opacity-[0.25]">
        <span className="font-display text-[22vw] font-bold tracking-widest text-[#E5DDD0]/60 uppercase whitespace-nowrap">
          TOOLBOX
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* SECTION HEADER */}
        <div ref={headerRef} className="text-center mb-16 md:mb-24">
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D9D0C3] bg-[#ECE5DA]/60 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest text-[#6F5A43] mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F5A43] animate-pulse" />
            <span>ENGINEERING TOOLBOX</span>
          </div>

          {/* Large Heading */}
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-[#171717] leading-none mb-3">
            The Technologies Behind Every Product
          </h2>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#171717]/75 font-sans leading-relaxed">
            Every interface, backend and animation you've seen so far was built using these technologies.
          </p>
        </div>

        {/* MULTIPLE HORIZONTAL CONVEYOR BELTS */}
        <div ref={conveyorsContainerRef} className="space-y-8 sm:space-y-10 md:space-y-12">
          {CONVEYOR_ROWS.map((row) => {
            const isRowPaused = hoveredRowId === row.id || !isSectionVisible;

            return (
              <div key={row.id} className="conveyor-row-item relative w-full">
                {/* Category Header Label (Clean, without "Assembly Line") */}
                <div className="flex items-center justify-between px-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#6F5A43]" />
                    <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-widest text-[#6F5A43]">
                      {row.category}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-[#171717]/60 uppercase tracking-wider font-semibold">
                    {row.direction === 'left-to-right' ? 'Flow →' : '← Flow'}
                  </span>
                </div>

                {/* Laboratory Track Container */}
                <div
                  className="relative w-full overflow-hidden rounded-2xl border border-[#D9D0C3] bg-[#ECE5DA]/50 py-4 sm:py-5 shadow-xs"
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => {
                    setHoveredRowId(null);
                    setActiveCardName(null);
                  }}
                >
                  {/* Left & Right Editorial Fade Gradients */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#F6F2EC] to-transparent z-20" />
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#F6F2EC] to-transparent z-20" />

                  {/* Endless Moving Flex Track (Duplicated 4x for 100% Seamless Infinite Conveyor) */}
                  <div
                    style={{ '--conveyor-speed': `${row.speed}s` }}
                    className={`flex items-center gap-4 sm:gap-6 w-max ${row.direction === 'left-to-right'
                        ? 'animate-conveyor-ltr'
                        : 'animate-conveyor-rtl'
                      } ${isRowPaused ? 'pause-conveyor' : ''}`}
                  >
                    {[...row.technologies, ...row.technologies, ...row.technologies, ...row.technologies].map(
                      (tech, idx) => {
                        const uniqueKey = `${row.id}-${tech.name}-${idx}`;
                        const isExpanded = activeCardName === uniqueKey;

                        return (
                          <ConveyorTechCard
                            key={uniqueKey}
                            tech={tech}
                            uniqueKey={uniqueKey}
                            isExpanded={isExpanded}
                            onExpand={() => setActiveCardName(uniqueKey)}
                            onCollapse={() => {
                              if (activeCardName === uniqueKey) setActiveCardName(null);
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM TRANSITION - EDITORIAL STATEMENT */}
        <div
          ref={footerRef}
          className="mt-24 md:mt-32 text-center border-t border-[#D9D0C3]/60 pt-12 md:pt-16"
        >
          <p className="font-editorial text-2xl sm:text-3xl md:text-4xl text-[#171717] font-bold tracking-tight leading-snug">
            Technology changes.
          </p>
          <p className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#6F5A43] italic font-normal mt-1">
            Curiosity doesn't.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Interactive Conveyor Technology Card Component
 * Enhanced Readability: Warm white card background, crisp high-contrast typography.
 */
function ConveyorTechCard({ tech, uniqueKey, isExpanded, onExpand, onCollapse }) {
  const [isHovered, setIsHovered] = useState(false);
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });

  // Handle 3D Mouse Parallax Tilt (max ~4 degrees)
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / (rect.height / 2)) * 4;
    const rotateY = (x / (rect.width / 2)) * 4;
    const shadowX = (x / (rect.width / 2)) * 6;
    const shadowY = (y / (rect.height / 2)) * 6;

    setCardTilt({ rotateX, rotateY, shadowX, shadowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onExpand();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTilt({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
    onCollapse();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      data-cursor="card"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${cardTilt.rotateX.toFixed(2)}deg) rotateY(${cardTilt.rotateY.toFixed(2)}deg) translate3d(0, -6px, 0) scale(1.04)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)',
        borderColor: isHovered ? `${tech.brandColor}80` : undefined,
        boxShadow: isHovered
          ? `${cardTilt.shadowX.toFixed(1)}px ${cardTilt.shadowY.toFixed(1) + 12}px 28px -4px ${tech.brandColor}25, 0 8px 20px -2px rgba(23,23,23,0.12)`
          : undefined,
      }}
      className={`relative shrink-0 w-[245px] sm:w-[275px] p-4 sm:p-5 rounded-2xl border transition-all duration-300 select-none cursor-pointer overflow-hidden ${isHovered
          ? 'bg-[#FFFFFF] border-[#6F5A43]/60 z-30 shadow-2xl'
          : 'bg-[#FAFAFA] border-[#D9D0C3] hover:bg-[#FFFFFF]'
        }`}
    >
      {/* Ambient Brand Color Background Glow */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 transition-opacity duration-300 -z-10 blur-md"
        style={{
          backgroundColor: tech.brandColor,
          opacity: isHovered ? 0.14 : 0,
        }}
      />

      {/* Header Row: Logo & Technology Name */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Logo with Monochrome -> Official Brand Color Transition */}
          <div
            style={{
              color: isHovered ? tech.brandColor : undefined,
              backgroundColor: isHovered ? `${tech.brandColor}18` : 'rgba(23,23,23,0.06)',
            }}
            className={`flex items-center justify-center w-10 h-10 rounded-xl p-2 transition-all duration-300 ${isHovered ? 'scale-110 shadow-xs rotate-3' : 'text-[#171717] opacity-85'
              }`}
          >
            <TechLogo iconType={tech.iconType} className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-[#332A22] tracking-tight leading-tight">
              {tech.name}
            </h4>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#6F5A43]/70 font-medium">
              Tech Unit
            </span>
          </div>
        </div>

        {/* Small Brand Accent Dot */}
        <span
          style={{ backgroundColor: isHovered ? tech.brandColor : '#D9D0C3' }}
          className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
        />
      </div>

      {/* Short Description */}
      <p className="text-xs text-[#4A4036] font-sans font-normal leading-relaxed mt-2.5">
        {tech.description}
      </p>

      {/* Smoothly Expanding "Used In" Section */}
      <div
        className={`transition-all duration-400 ease-out overflow-hidden ${isHovered ? 'max-h-24 opacity-100 mt-3 pt-3 border-t border-[#D9D0C3]/60' : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'
          }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6F5A43]">
            Used In
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tech.usedIn.map((projectName) => (
            <span
              key={projectName}
              style={{
                borderColor: isHovered ? `${tech.brandColor}50` : undefined,
              }}
              className="px-2.5 py-0.5 rounded-full bg-[#ECE5DA] border border-[#6F5A43]/40 text-[#171717] text-[11px] font-semibold"
            >
              {projectName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
