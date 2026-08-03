import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiArrowUpRight } from 'react-icons/hi2';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Add backdrop blur and show/hide the navbar based on scroll direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Toggle blur backdrop once scrolled past top
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Slide out when scrolling down, slide back in when scrolling up
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current) {
        gsap.to(navRef.current, {
          y: -100,
          duration: 0.45,
          ease: 'power3.out',
        });
      } else {
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Journey', href: '#journey' },
    { name: 'Projects', href: '#projects' },
    { name: 'Toolbox', href: '#toolbox' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      ref={navRef}
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5 pb-2 transition-all duration-300 pointer-events-none"
    >
      <nav
        className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-6 py-3.5 rounded-full transition-all duration-500 border ${
          isScrolled
            ? 'bg-[#ECE5DA]/85 backdrop-blur-md border-[#D9D0C3] shadow-[0_8px_30px_rgb(23,23,23,0.06)]'
            : 'bg-transparent border-transparent'
        }`}
      >
        {/* Brand logo */}
        <Magnetic strength={0.25}>
          <a
            href="#"
            data-cursor="link"
            className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#171717]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-[#F6F2EC] font-display text-sm font-semibold transition-transform duration-300 group-hover:scale-105">
              SD
            </span>
            <span className="font-editorial tracking-wider text-sm font-medium uppercase text-[#171717]">
              Shubham <span className="text-[#6F5A43] font-light">Dev</span>
            </span>
          </a>
        </Magnetic>

        {/* Center navigation links */}
        <ul className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#F6F2EC]/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#D9D0C3]/40">
          {navLinks.map((link) => {
            const isActive = activeSection === link.name.toLowerCase();
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  data-cursor="link"
                  onClick={() => setActiveSection(link.name.toLowerCase())}
                  className={`relative px-4 py-1.5 text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${
                    isActive ? 'text-[#171717] font-semibold' : 'text-[#171717]/70 hover:text-[#171717]'
                  }`}
                >
                  {link.name}
                  {/* Background pill for active link */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-[#ECE5DA] -z-10 shadow-xs" />
                  )}
                  {/* Hover underline indicator */}
                  <span className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#6F5A43] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Primary CTA button */}
        <Magnetic strength={0.4}>
          <a
            href="#contact"
            data-cursor="button"
            className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 overflow-hidden rounded-full bg-[#171717] text-[#F6F2EC] text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-[#6F5A43] hover:shadow-btn active:scale-95"
          >
            <span>Get In Touch</span>
            <HiArrowUpRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Magnetic>
      </nav>
    </header>
  );
}
