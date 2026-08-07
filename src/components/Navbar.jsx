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
    // Keep active section state synced with browser pathname without hashes
    const handlePathChange = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/journey') setActiveSection('journey');
      else if (path === '/projects') setActiveSection('projects');
      else if (path === '/toolbox') setActiveSection('toolbox');
      else if (path === '/contact') setActiveSection('contact');
      else setActiveSection('hero');
    };

    handlePathChange();
    window.addEventListener('pathnamechange', handlePathChange);
    window.addEventListener('popstate', handlePathChange);

    // Add backdrop blur and show/hide the navbar based on scroll direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pathnamechange', handlePathChange);
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  const navigateTo = (e, path, sectionId) => {
    e.preventDefault();
    window.isNavigating = true;
    if (window.navScrollTimer) clearTimeout(window.navScrollTimer);

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new Event('pathnamechange'));
    }

    if (sectionId === 'hero' || path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        const topOffset = targetEl.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    }

    window.navScrollTimer = setTimeout(() => {
      window.isNavigating = false;
    }, 1100);
  };

  const navLinks = [
    { name: 'Journey', path: '/journey', id: 'journey' },
    { name: 'Projects', path: '/projects', id: 'projects' },
    { name: 'Toolbox', path: '/toolbox', id: 'toolbox' },
    { name: 'Contact', path: '/contact', id: 'contact' },
  ];

  return (
    <header
      ref={navRef}
      id="navbar"
      className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-5 pb-2 transition-all duration-300 pointer-events-none opacity-0 -translate-y-24"
    >
      <nav
        className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-6 py-3.5 rounded-full transition-all duration-500 border ${
          isScrolled
            ? 'bg-[#ECE5DA]/85 backdrop-blur-md border-[#D9D0C3] shadow-[0_8px_30px_rgb(23,23,23,0.06)]'
            : 'bg-transparent border-transparent'
        }`}
      >
        {/* Brand logo */}
        <Magnetic strength={0.10}>
          <a
            href="/"
            onClick={(e) => navigateTo(e, '/', 'hero')}
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
            const isActive = activeSection === link.id;
            return (
              <li key={link.name}>
                <a
                  href={link.path}
                  data-cursor="link"
                  onClick={(e) => navigateTo(e, link.path, link.id)}
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
        <Magnetic strength={0.15}>
          <a
            href="/contact"
            onClick={(e) => navigateTo(e, '/contact', 'contact')}
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
