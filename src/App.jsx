import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PaperGrain from './components/PaperGrain';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import JourneySection from './components/JourneySection';
import ProjectsSection from './components/ProjectsSection';
import EngineeringToolbox from './components/EngineeringToolbox';
import ContactSection from './components/ContactSection';
import Preloader from './components/Preloader';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroTimelineRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Disable automatic browser scroll restoration on refresh so page always resets to Hero top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    ScrollTrigger.clearScrollMemory();

    // Set up smooth scrolling so page movement feels fluid
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    lenisRef.current = lenis;

    // Immediately reset scroll position to top and lock scrolling while preloader is active
    lenis.scrollTo(0, { immediate: true });
    lenis.stop();
    document.body.style.overflow = 'hidden';

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Prepare hero entrance sequence (paused initially until preloader finishes)
    const ctx = gsap.context(() => {
      // Ensure navbar and hero elements are completely hidden initially while preloader is active
      gsap.set('#navbar', { y: -100, opacity: 0 });
      gsap.set(
        ['#hero-bg-text-1', '#hero-bg-text-2', '#hero-portrait', '#hero-badge', '#hero-intro', '.hero-stat-card', '#hero-ctas', '#hero-scroll-indicator'],
        { opacity: 0 }
      );

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      });

      // Slide the navbar into view from top
      tl.fromTo(
        '#navbar',
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        // Fade up the big background typography
        .fromTo(
          ['#hero-bg-text-1', '#hero-bg-text-2'],
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
          '-=0.4'
        )
        // Pop in the hero portrait with a slight spring
        .fromTo(
          '#hero-portrait',
          { scale: 0.9, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' },
          '-=0.6'
        )
        // Reveal the badge tags
        .fromTo(
          '#hero-badge',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.4'
        )
        // Bring in intro paragraph
        .fromTo(
          '#hero-intro',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.3'
        )
        // Stagger-fade the stat cards
        .fromTo(
          '.hero-stat-card',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
          '-=0.3'
        )
        // Action buttons
        .fromTo(
          '#hero-ctas',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.3'
        )
        // Gently fade in the scroll hint
        .fromTo(
          '#hero-scroll-indicator',
          { opacity: 0, y: 15 },
          { opacity: 0.8, y: 0, duration: 0.4 },
          '-=0.2'
        );

      // Sync browser URL cleanly without hashes (#) as sections scroll into view
      const sections = [
        { id: 'hero', path: '/' },
        { id: 'journey', path: '/journey' },
        { id: 'projects', path: '/projects' },
        { id: 'toolbox', path: '/toolbox' },
        { id: 'contact', path: '/contact' },
      ];

      sections.forEach(({ id, path }) => {
        const el = document.getElementById(id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => {
            if (window.isNavigating) return;
            if (window.location.pathname !== path) {
              window.history.replaceState(null, '', path);
              window.dispatchEvent(new Event('pathnamechange'));
            }
          },
          onEnterBack: () => {
            if (window.isNavigating) return;
            if (window.location.pathname !== path) {
              window.history.replaceState(null, '', path);
              window.dispatchEvent(new Event('pathnamechange'));
            }
          },
        });
      });

      heroTimelineRef.current = tl;
    });

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const handleLoaderComplete = () => {
    document.body.style.overflow = '';
    const initialPath = window.location.pathname.toLowerCase();

    const pathMap = {
      '/journey': 'journey',
      '/projects': 'projects',
      '/toolbox': 'toolbox',
      '/contact': 'contact',
    };

    const targetId = pathMap[initialPath];
    if (targetId) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const topOffset = targetEl.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo(0, topOffset);
        if (lenisRef.current) {
          lenisRef.current.scrollTo(topOffset, { immediate: true });
        }
      }
    } else {
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }

    if (lenisRef.current) {
      lenisRef.current.start();
    }
    ScrollTrigger.refresh();

    if (heroTimelineRef.current) {
      heroTimelineRef.current.play();
    }
  };

  return (
    <div className="relative bg-[#F6F2EC] text-[#171717] min-h-screen font-sans selection:bg-[#6F5A43] selection:text-[#F6F2EC]">
      {/* Luxury Opening Scene Preloader */}
      <Preloader onComplete={handleLoaderComplete} />

      {/* Paper grain overlay texture */}
      <PaperGrain />

      {/* Floating navigation bar */}
      <Navbar />

      {/* Main page sections */}
      <main>
        <HeroSection />
        <JourneySection />
        <ProjectsSection />
        <EngineeringToolbox />
        <ContactSection />
      </main>
    </div>
  );
}
