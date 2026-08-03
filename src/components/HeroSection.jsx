import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import Magnetic from './Magnetic';
import profileImg from '../assets/profile.png';

export default function HeroSection({ mousePosition }) {
  const heroRef = useRef(null);
  const bgTypographyRef = useRef(null);
  const portraitRef = useRef(null);
  const cardsRef = useRef([]);
  
    const { normalizedX = 0, normalizedY = 0, x = 0, y = 0 } = mousePosition || {};
  
  // Subtle 3D tilt effect on card hover based on cursor position
  const handleCardMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cardX = e.clientX - rect.left - rect.width / 2;
    const cardY = e.clientY - rect.top - rect.height / 2;

    const tiltX = (cardY / (rect.height / 2)) * -3;
    const tiltY = (cardX / (rect.width / 2)) * 3;

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleCardMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const stats = [
    { number: '600+', label: 'DSA Problems Solved', sub: 'LeetCode & GFG' },
    { number: '6+', label: 'Projects Built', sub: 'Production Ready' },
    { number: 'MERN', label: 'React • Node • MongoDB', sub: 'Core Tech Stack' },
    { number: 'Active', label: 'Open to Work', sub: 'Full Stack Roles' },
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden pt-24 pb-4 px-4 sm:px-8 bg-[#F6F2EC] spotlight-glow select-none"
    >
      {/* Soft background ambient light */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial from-[#6F5A43]/5 via-transparent to-transparent blur-3xl opacity-70" />

      {/* Main hero container */}
      <div className="relative w-full max-w-7xl flex-1 flex flex-col justify-center items-center my-auto">

        {/* Big background typography that responds slightly to cursor movement */}
        <div
          ref={bgTypographyRef}
          style={{
            transform: `translate3d(${normalizedX * -15}px, ${normalizedY * -10}px, 0)`,
          }}
          className="absolute inset-0 flex flex-col justify-start items-center pointer-events-none z-0 transition-transform duration-700 ease-out leading-none"
        >
          <h1
            id="hero-bg-text-1"
            className="font-display text-[17vw] sm:text-[16vw] md:text-[15vw] lg:text-[14.5vw] font-bold tracking-wider text-[#E5DDD0]/70 uppercase select-none text-center leading-[0.89] whitespace-nowrap"
          >
            FULL STACK
          </h1>
          <h1
            id="hero-bg-text-2"
            className="font-display text-[17vw] sm:text-[16vw] md:text-[15vw] lg:text-[14.5vw] font-bold tracking-wider text-[#E5DDD0]/70 uppercase select-none text-center leading-[0.82] whitespace-nowrap"
          >
            DEVELOPER
          </h1>
        </div>

        {/* Centered profile image with parallax tilt */}
        <div
          ref={portraitRef}
          style={{
            transform: `translate3d(${normalizedX * 18}px, ${normalizedY * 12}px, 0)`,
          }}
          className="relative z-10 flex justify-center items-end h-[55vh] sm:h-[62vh] md:h-[68vh] lg:h-[60vh] w-full max-w-xl transition-transform duration-500 ease-out"
        >
          {/* Warm ambient glow tracking behind portrait */}
          <div
            className="absolute bottom-6 w-72 h-72 rounded-full bg-[#6F5A43]/15 blur-3xl transition-opacity duration-500 pointer-events-none"
            style={{
              transform: `translate(${normalizedX * 30}px, ${normalizedY * 20}px)`,
            }}
          />

          <img
            src={profileImg}
            alt="Shubham - Full Stack Developer"
            id="hero-portrait"
            className="relative h-full object-contain filter drop-shadow-[0_25px_35px_rgba(23,23,23,0.18)] transition-all duration-300 pointer-events-auto"
            data-cursor="card"
          />
        </div>

        {/* Hero text and interactive elements */}
        <div className="relative z-20 -mt-10 sm:-mt-6 md:-mt-8 w-full max-w-4xl flex flex-col items-center text-center px-4">

          {/* Role tags */}
          <div id="hero-badge" className="flex items-center gap-3 mb-3">
            <span className="px-3.5 py-1 rounded-full bg-[#171717] text-[#F6F2EC] text-[10px] sm:text-xs font-semibold tracking-widest uppercase shadow-sm">
              FULL STACK MERN DEVELOPER
            </span>
            <span className="px-3 py-1 rounded-full border border-[#6F5A43]/40 bg-[#ECE5DA]/70 backdrop-blur-xs text-[#6F5A43] text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              FRESHER
            </span>
          </div>

          {/* Intro copy */}
          <p
            id="hero-intro"
            className="max-w-2xl text-base sm:text-lg md:text-xl font-normal text-[#171717]/85 leading-relaxed font-sans mb-7"
          >
            Crafting high-performance web applications with clean architecture, modern aesthetic polish, and interactive visual elegance.
          </p>

          {/* Key metrics cards with 3D tilt */}
          <div
            id="hero-stats"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full mb-8"
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onMouseLeave={() => handleCardMouseLeave(idx)}
                data-cursor="card"
                className="hero-stat-card group relative p-4 sm:p-5 rounded-2xl bg-[#ECE5DA]/80 backdrop-blur-sm border border-[#D9D0C3] shadow-card-soft hover:shadow-card-hover transition-all duration-200 text-left flex flex-col justify-between"
              >
                <div className="text-2xl sm:text-3xl font-bold font-editorial text-[#171717] tracking-tight group-hover:text-[#6F5A43] transition-colors duration-200">
                  {stat.number}
                </div>
                <div className="mt-2">
                  <div className="text-xs sm:text-sm font-semibold text-[#171717]">
                    {stat.label}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#171717]/60 font-medium">
                    {stat.sub}
                  </div>
                </div>
                {/* Hover glow highlight */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-radial from-[#6F5A43]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Primary & secondary CTAs */}
          <div id="hero-ctas" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Magnetic strength={0.4}>
              <a
                href="#projects"
                data-cursor="button"
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#171717] text-[#F6F2EC] text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-md hover:bg-[#6F5A43] hover:shadow-btn transition-all duration-300"
              >
                <span>View My Work</span>
                <HiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>

            <Magnetic strength={0.4}>
              <a
                href="#contact"
                data-cursor="button"
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#171717]/30 bg-transparent text-[#171717] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:border-[#171717] hover:bg-[#ECE5DA] transition-all duration-300"
              >
                <span>Get In Touch</span>
                <HiArrowUpRight className="text-base transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </div>

        </div>

      </div>

      {/* Scroll hint indicator */}
      <div
        id="hero-scroll-indicator"
        className="relative z-20 flex flex-col items-center gap-2 mt-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-300"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#171717]/60">
          Scroll to Explore
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-[#171717]/40 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[#6F5A43] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
