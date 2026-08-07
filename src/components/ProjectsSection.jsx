import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiArrowRight, HiArrowUpRight, HiCodeBracket, HiEye, HiDocumentText, HiChevronDown } from 'react-icons/hi2';
import Magnetic from './Magnetic';

// Project Image Posters (from src/assets/projects/)
import sourcethreadPoster from '../assets/projects/sourceThread_work.webp';
import tickdonePoster from '../assets/projects/tickdone_work.webp';
import cloudeePoster from '../assets/projects/cloudee_work.webp';
import twogoodPoster from '../assets/projects/twogood_work.webp';

gsap.registerPlugin(ScrollTrigger);

// Curated Featured Projects
const FEATURED_PROJECTS = [
  {
    id: '01',
    title: 'Source Thread',
    tagline: 'Content Engine & Creator Platform',
    description:
      'A modern blog platform built for creators with a beautiful reading experience, secure content management and responsive UI.',
    tech: ['React', 'Tailwind CSS', 'Strapi', 'PostgreSQL'],
    video: '/videos/sourcethread_work.mp4',
    poster: sourcethreadPoster,
    bgTint: 'rgba(224, 112, 64, 0.04)', // subtle warm orange tint
    liveUrl: 'https://source-thread.netlify.app/',
    githubUrl: 'https://github.com/shubham-kumar012/source-thread.git',
    caseStudyUrl: '#',
  },
  {
    id: '02',
    title: 'TickDone',
    tagline: 'Distraction-Free Productivity System',
    description:
      'A clean and distraction-free task management application focused on speed, productivity and simple user experience.',
    tech: ['Node.js', 'Express', 'MongoDB', 'EJS'],
    video: '/videos/tickdone_work.mp4',
    poster: tickdonePoster,
    bgTint: 'rgba(180, 150, 110, 0.04)', // subtle warm beige tint
    liveUrl: 'https://tickdone-a0it.onrender.com/',
    githubUrl: 'https://github.com/shubham-kumar012/Projects/tree/main/tickdone',
    caseStudyUrl: '#',
  },
  {
    id: '03',
    title: 'Cloudee',
    tagline: 'Real-Time Dynamic Weather Interface',
    description:
      'A beautifully designed weather application that provides real-time forecasts with clean UI and smooth user experience.',
    tech: ['React', 'Weather API', 'JavaScript', 'CSS'],
    video: '/videos/cloudee_work.mp4',
    poster: cloudeePoster,
    bgTint: 'rgba(90, 160, 220, 0.04)', // subtle sky blue tint
    liveUrl: 'https://shubham-kumar012.github.io/Projects/cloudee/',
    githubUrl: 'https://github.com/shubham-kumar012/Projects/tree/main/cloudee',
    caseStudyUrl: '#',
  },
  {
    id: '04',
    title: 'TwoGood',
    tagline: 'Award-Winning Creative Motion Replica',
    description:
      'A creative recreation of the award-winning TwoGood website built to improve frontend animation skills using GSAP.',
    tech: ['React', 'GSAP', 'Tailwind'],
    video: '/videos/twogood_work.mp4',
    poster: twogoodPoster,
    bgTint: 'rgba(230, 210, 180, 0.04)', // subtle cream tint
    liveUrl: 'https://shubham-kumar012.github.io/Projects/twogood-landing/',
    githubUrl: 'https://github.com/shubham-kumar012/Projects/tree/main/twogood-landing',
    caseStudyUrl: '#',
  },
];

// Additional Archive Projects revealed upon expansion
const ARCHIVE_PROJECTS = [
  {
    id: '05',
    title: 'FlashTap',
    category: 'Reaction Game',
    year: '2024',
    description: 'A fast-paced reaction game where players tap moving targets before time runs out.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    video: '/videos/flashtap_work.mp4',
    githubUrl: 'https://github.com/shubham-kumar012/Projects/tree/main/flashtap',
    liveUrl: 'https://flashtap.vercel.app/',
  },
  {
    id: '06',
    title: 'Monovibe',
    category: 'Animated Landing Page',
    year: '2024',
    description: 'A modern, minimal animated landing page with fluid GSAP entrance effects and dynamic motion-reactive cursor interactions.',
    tech: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    video: '/videos/monovite_work.mp4',
    githubUrl: 'https://github.com/shubham-kumar012/Projects/tree/main/monovibe-landing',
    liveUrl: 'https://shubham-kumar012.github.io/Projects/monovibe-landing/',
  },
  {
    id: '07',
    title: 'AetherTime',
    category: 'Stopwatch Web App',
    year: '2024',
    description: 'A simple and responsive stopwatch tracking minutes, seconds, and milliseconds in real-time with clean DOM timing functions.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    video: '/videos/aetherTime_work.mp4',
    githubUrl: 'https://github.com/shubham-kumar012/Projects/tree/main/aether-time',
    liveUrl: 'https://shubham-kumar012.github.io/Projects/aether-time/',
  },
  {
    id: '08',
    title: 'Vyom Garud',
    category: 'Autonomous UAV Systems',
    year: '2024',
    description: 'A modern animated UAV technology website showcasing autonomous capabilities, modular drone systems, and product highlights.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lenis'],
    video: '/videos/vyomgarud_work.mp4',
    githubUrl: 'https://github.com/shubham-kumar012/vyom-garud.git',
    liveUrl: 'https://vyom-garud-git-main-shubhams-projects-84579036.vercel.app/?_vercel_share=IqCd1HwgcuMeZH4pQwDJt604ttwf4s85',
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const videoRefs = useRef([]);
  const bgTextRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeBgTint, setActiveBgTint] = useState('transparent');
  const [isArchiveExpanded, setIsArchiveExpanded] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const archiveVideoRefs = useRef([]);
  const archiveCardRefs = useRef([]);

  // Fast performance refs for 3D tilt tracking with zero main-thread layout thrashing
  const cardRectsRef = useRef({});
  const cardQuickToRefs = useRef({});
  const videoQuickToRefs = useRef({});

  // 1. ScrollTrigger setup for Focus Mode & 70% viewport active state
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background subtle text parallax
      if (bgTextRef.current) {
        gsap.to(bgTextRef.current, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      // Show progress indicator ONLY when user is within Projects Section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 20%',
        onEnter: () => setIsSectionVisible(true),
        onEnterBack: () => setIsSectionVisible(true),
        onLeave: () => setIsSectionVisible(false),
        onLeaveBack: () => setIsSectionVisible(false),
      });

      // Set up card entry animations & Focus Mode activation
      FEATURED_PROJECTS.forEach((project, idx) => {
        const cardEl = cardRefs.current[idx];
        if (!cardEl) return;

        // Card entrance reveal animation
        gsap.fromTo(
          cardEl,
          { y: 70, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardEl,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Focus Mode Trigger: Card is active when ~70% enters viewport (start: 'top 38%')
        ScrollTrigger.create({
          trigger: cardEl,
          start: 'top 38%',
          end: 'bottom 35%',
          onEnter: () => handleActivateProject(idx),
          onEnterBack: () => handleActivateProject(idx),
          onLeave: () => handleDeactivateProject(idx),
          onLeaveBack: () => handleDeactivateProject(idx),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Play/Pause videos strictly & update background tint
  const handleActivateProject = (index) => {
    setActiveIndex(index);
    setActiveBgTint(FEATURED_PROJECTS[index].bgTint);

    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === index && !document.hidden) {
        videoEl.muted = true;
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Safe catch for browser autoplay restrictions
          });
        }
      } else {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  };

  const handleDeactivateProject = (index) => {
    // Only clear active state if deactivating the currently active project
    setActiveIndex((prev) => (prev === index ? -1 : prev));
    setActiveBgTint('transparent');

    const videoEl = videoRefs.current[index];
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  };



  // Refresh ScrollTrigger whenever archive section expands or collapses
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [isArchiveExpanded]);

  // Global tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRefs.current.forEach((v) => v && v.pause());
        archiveVideoRefs.current.forEach((v) => v && v.pause());
      } else {
        if (activeIndex >= 0 && videoRefs.current[activeIndex] && isSectionVisible) {
          videoRefs.current[activeIndex].play().catch(() => { });
        }
        // Resume videos for visible archive cards
        if (isArchiveExpanded) {
          archiveCardRefs.current.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const rect = cardEl.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            const videoEl = archiveVideoRefs.current[idx];
            if (inView && videoEl) {
              videoEl.muted = true;
              videoEl.play().catch(() => { });
            }
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeIndex, isArchiveExpanded, isSectionVisible]);

  // Pause all featured videos when leaving the section
  useEffect(() => {
    if (!isSectionVisible) {
      videoRefs.current.forEach((v) => v && v.pause());
    }
  }, [isSectionVisible]);

  // IntersectionObserver for expanded archive cards: play continuously when in view, pause when out of view
  useEffect(() => {
    if (!isArchiveExpanded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = archiveCardRefs.current.indexOf(entry.target);
          if (index !== -1) {
            const videoEl = archiveVideoRefs.current[index];
            if (!videoEl) return;

            if (entry.isIntersecting && !document.hidden) {
              videoEl.muted = true;
              const playPromise = videoEl.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => { });
              }
            } else {
              videoEl.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe active archive cards
    archiveCardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isArchiveExpanded]);

  // 3. Smooth & Deep 3D Card Tilt & Video Parallax (Cached Rects + GSAP Overwrite Auto)
  const handleMouseEnter = (e, index) => {
    const card = e.currentTarget;
    cardRectsRef.current[index] = card.getBoundingClientRect();
  };

  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index] || e.currentTarget;
    const rect = cardRectsRef.current[index] || card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Refined & subtle 3D tilt calculation
    const rotateX = (-y / (rect.height / 2)) * 2.2;
    const rotateY = (x / (rect.width / 2)) * 2.2;
    const shiftX = (x / (rect.width / 2)) * 2.5;
    const shiftY = (y / (rect.height / 2)) * 2.5;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      scale: 1.012,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    const videoEl = videoRefs.current[index];
    if (videoEl) {
      gsap.to(videoEl, {
        x: shiftX,
        y: shiftY,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = (index) => {
    delete cardRectsRef.current[index];
    const card = cardRefs.current[index];
    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    const videoEl = videoRefs.current[index];
    if (videoEl) {
      gsap.to(videoEl, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  // Scroll smoothly to a specific project from progress indicator
  const scrollToProject = (idx) => {
    const cardEl = cardRefs.current[idx];
    if (cardEl) {
      const offsetTop = cardEl.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full pt-16 md:pt-24 pb-28 md:pb-40 bg-[#F6F2EC] text-[#171717] transition-colors duration-1000 ease-out overflow-hidden selection:bg-[#6F5A43] selection:text-[#F6F2EC]"
      style={{ backgroundColor: activeBgTint !== 'transparent' ? activeBgTint : undefined }}
    >
      {/* Background Subtle Color Glow Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000 ease-out"
        style={{
          background: activeBgTint !== 'transparent' ? activeBgTint : 'transparent',
        }}
      />

      {/* Huge Background Transparent Editorial Typography */}
      <div
        ref={bgTextRef}
        className="absolute top-10 left-0 w-full flex justify-center pointer-events-none z-0 overflow-hidden leading-none select-none opacity-[0.35] transition-all duration-700"
      >
        <span className="font-display text-[19vw] font-bold tracking-widest text-[#E5DDD0]/60 uppercase whitespace-nowrap">
          {isArchiveExpanded ? 'ARCHIVE' : 'FEATURED'}
        </span>
      </div>

      {/* FIXED VERTICAL PROGRESS INDICATOR (Visible only inside Projects Section) */}
      <div
        className={`hidden md:flex fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 p-2.5 rounded-full bg-[#ECE5DA]/50 backdrop-blur-md border border-[#D9D0C3]/60 shadow-xs transition-all duration-500 ${isSectionVisible
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 -translate-x-6 pointer-events-none'
          }`}
      >
        {FEATURED_PROJECTS.map((proj, idx) => {
          const isActive = idx === activeIndex;
          return (
            <React.Fragment key={proj.id}>
              <button
                onClick={() => scrollToProject(idx)}
                title={`Go to ${proj.title}`}
                data-cursor="button"
                className="group relative flex items-center justify-center p-1 focus:outline-none"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${isActive
                    ? 'w-3 h-3 bg-[#6F5A43] shadow-[0_0_10px_rgba(111,90,67,0.7)] scale-110'
                    : 'w-2 h-2 bg-[#D9D0C3] group-hover:bg-[#6F5A43]/70 group-hover:scale-125'
                    }`}
                />
              </button>
              {idx < FEATURED_PROJECTS.length - 1 && (
                <div
                  className={`w-[1px] h-5 transition-colors duration-500 ${isActive ? 'bg-[#6F5A43]' : 'bg-[#D9D0C3]/60'
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* SECTION HEADER */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mb-20 md:mb-28 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D9D0C3] bg-[#ECE5DA]/60 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest text-[#6F5A43] mb-4 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6F5A43] animate-pulse" />
          <span>03 #Works</span>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-[#171717] leading-none mb-3">
          FEATURED WORK
        </h2>

        <p className="font-editorial text-lg sm:text-2xl text-[#6F5A43] font-medium tracking-wide mb-4">
          Where Ideas Became Products
        </p>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#171717]/75 font-sans leading-relaxed">
          Every project started with a problem and became a complete product through design, development and continuous iteration.
        </p>
      </div>

      {/* VERTICALLY STACKED EXHIBITION CARDS CONTAINER */}
      <div ref={cardsContainerRef} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24 md:space-y-28">
        {FEATURED_PROJECTS.map((project, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={project.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="w-full flex justify-center"
            >
              {/* EDITORIAL EXHIBITION CARD */}
              <div
                onMouseEnter={(e) => handleMouseEnter(e, idx)}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                style={{
                  transition: 'box-shadow 0.5s ease, background-color 0.5s ease, border-color 0.5s ease',
                  willChange: 'transform',
                }}
                className={`group relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 border transition-all duration-500 overflow-hidden ${isActive
                  ? 'bg-[#ECE5DA] border-[#6F5A43]/50 shadow-card-hover'
                  : 'bg-[#ECE5DA]/70 border-[#D9D0C3] shadow-card-soft hover:border-[#6F5A43]/30 hover:bg-[#ECE5DA]'
                  }`}
              >
                {/* VIDEO EXHIBITION FRAME (Sleek Widescreen Ratio & Height Cap) */}
                <div
                  className="relative w-full aspect-[21/10] sm:aspect-[16/9] max-h-[340px] sm:max-h-[380px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#171717] mb-5 sm:mb-6 border border-[#171717]/10 shadow-md group/video cursor-pointer will-change-transform"
                >
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={project.video}
                    poster={project.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/video:scale-[1.03] will-change-transform"
                  />

                  {/* Subtle video ambient overlay gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171717]/30 via-transparent to-transparent opacity-60 group-hover/video:opacity-30 transition-opacity duration-500" />

                  {/* Active Playing Badge Pill */}
                  <div
                    className={`absolute top-3.5 right-3.5 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717]/80 backdrop-blur-md text-[#F6F2EC] text-[10px] font-semibold tracking-widest uppercase transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6F5A43] animate-ping" />
                    <span>PLAYING DEMO</span>
                  </div>
                </div>

                {/* PROJECT DETAILS CONTENT */}
                <div className="flex flex-col gap-4 sm:gap-5 text-left">
                  {/* Header: Project Index & Subtitle Tagline */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-editorial text-xs font-bold tracking-widest text-[#6F5A43] uppercase">
                        {project.id}. PROJECT
                      </span>
                      <span className="h-3 w-[1px] bg-[#6F5A43]/30" />
                      <span className="text-xs font-semibold text-[#171717]/60 tracking-wide font-sans">
                        {project.tagline}
                      </span>
                    </div>

                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-500 ${isActive
                        ? 'bg-[#6F5A43] shadow-[0_0_10px_rgba(111,90,67,0.8)] scale-125'
                        : 'bg-[#D9D0C3]'
                        }`}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      className={`font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight transition-colors duration-300 ${isActive ? 'text-[#171717]' : 'text-[#171717]/85 group-hover:text-[#171717]'
                        }`}
                    >
                      {project.title}
                    </h3>

                    <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-[#171717]/80 leading-relaxed font-sans font-normal max-w-2xl">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {project.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-full bg-[#F6F2EC] border border-[#D9D0C3] text-[#171717]/80 text-[11px] sm:text-xs font-medium font-sans tracking-wide transition-all duration-300 hover:bg-[#6F5A43] hover:text-[#F6F2EC] hover:border-[#6F5A43] hover:-translate-y-0.5 shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* ACTION BUTTONS (Always Visible & Interactive) */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 pointer-events-auto">
                    {/* Primary: Live Demo */}
                    <Magnetic strength={0.15}>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="button"
                        className="group/btn inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#171717] text-[#F6F2EC] text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#6F5A43] transition-all duration-300"
                      >
                        <HiEye className="text-sm" />
                        <span>Live Demo</span>
                        <HiArrowUpRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </a>
                    </Magnetic>

                    {/* Secondary: GitHub */}
                    <Magnetic strength={0.15}>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="button"
                        className="group/btn inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#171717]/30 bg-transparent text-[#171717] text-xs font-semibold uppercase tracking-wider hover:border-[#171717] hover:bg-[#F6F2EC] transition-all duration-300"
                      >
                        <HiCodeBracket className="text-sm" />
                        <span>GitHub</span>
                        <HiArrowUpRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </a>
                    </Magnetic>
                  </div>
                </div>

                {/* Subtle Hover Accent Glow */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#6F5A43]/0 via-[#6F5A43]/5 to-[#6F5A43]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>

      {/* PREMIUM TRANSITION SECTION (EXPLORE PROJECT ARCHIVE) */}
      <div className="relative mt-28 md:mt-40 max-w-5xl mx-auto px-6 text-center z-10">
        <div className="py-14 sm:py-20 border-t border-[#D9D0C3]/70 flex flex-col items-center">
          <span className="font-editorial text-xs font-semibold uppercase tracking-widest text-[#6F5A43] mb-3">
            {isArchiveExpanded ? 'Full Catalog Unlocked' : 'Only the Highlights'}
          </span>

          <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-[#171717] max-w-3xl leading-none mb-4">
            {isArchiveExpanded ? 'COMPLETE PROJECT ARCHIVE' : 'WANT TO SEE MORE EXPERIMENTS?'}
          </h3>

          <p className="max-w-xl text-sm sm:text-base text-[#171717]/75 font-sans leading-relaxed mb-8">
            {isArchiveExpanded
              ? 'Browsing the full archive of web applications, AI tools, and experimental prototypes.'
              : "You've just explored my featured work. There are more experiments, UI explorations and full-stack projects waiting to be discovered."}
          </p>

          {/* LARGE INTERACTIVE CTA BUTTON */}
          <Magnetic strength={0.15}>
            <button
              onClick={() => setIsArchiveExpanded(!isArchiveExpanded)}
              data-cursor="button"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#171717] text-[#F6F2EC] text-xs sm:text-sm font-semibold uppercase tracking-widest shadow-lg hover:bg-[#6F5A43] hover:shadow-btn transition-all duration-300 cursor-pointer"
            >
              <span>{isArchiveExpanded ? 'Collapse Archive' : 'Explore Project Archive'}</span>
              <HiArrowRight
                className={`text-base transition-transform duration-300 ${isArchiveExpanded ? 'rotate-90' : 'group-hover:translate-x-1.5'
                  }`}
              />
            </button>
          </Magnetic>
        </div>

        {/* EXPANDABLE ARCHIVE LIST (Unfolds seamlessly without page refresh) */}
        {isArchiveExpanded && (
          <div className="mt-10 text-left space-y-6 animate-fadeIn transition-all duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {ARCHIVE_PROJECTS.map((archItem, archIdx) => (
                <div
                  key={archItem.id}
                  ref={(el) => (archiveCardRefs.current[archIdx] = el)}
                  className="group relative p-5 sm:p-6 rounded-2xl bg-[#ECE5DA] border border-[#D9D0C3] hover:border-[#6F5A43]/50 transition-all duration-500 hover:shadow-card-hover flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  {/* Top: Widescreen Landscape Video Preview */}
                  {archItem.video && (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#171717] mb-5 border border-[#171717]/10 shadow-md">
                      <video
                        ref={(el) => (archiveVideoRefs.current[archIdx] = el)}
                        src={archItem.video}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171717]/20 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500" />
                    </div>
                  )}

                  {/* Bottom: Details, Tech Tags & Action Links */}
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-editorial text-xs font-bold text-[#6F5A43] uppercase tracking-wider">
                          {archItem.id}. {archItem.category}
                        </span>
                        <span className="text-xs font-semibold text-[#171717]/50 font-sans">
                          {archItem.year}
                        </span>
                      </div>

                      <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#171717] group-hover:text-[#6F5A43] transition-colors duration-300 mb-2">
                        {archItem.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-[#171717]/80 font-sans leading-relaxed mb-4">
                        {archItem.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {archItem.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full bg-[#F6F2EC] border border-[#D9D0C3] text-[#171717]/80 text-[11px] font-medium font-sans tracking-wide"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-3 border-t border-[#D9D0C3]/60">
                        <Magnetic strength={0.1}>
                          <a
                            href={archItem.githubUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="button"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#6F5A43] transition-colors"
                          >
                            <HiCodeBracket className="text-sm" />
                            <span>Code</span>
                            <HiArrowUpRight className="text-xs" />
                          </a>
                        </Magnetic>

                        <Magnetic strength={0.1}>
                          <a
                            href={archItem.liveUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="button"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#6F5A43] transition-colors"
                          >
                            <HiEye className="text-sm" />
                            <span>Preview</span>
                            <HiArrowUpRight className="text-xs" />
                          </a>
                        </Magnetic>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
