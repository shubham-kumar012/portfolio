import React, { useEffect } from 'react';
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

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Set up smooth scrolling so page movement feels fluid
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Kick off the entrance sequence when the page first loads
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
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
    });

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-[#F6F2EC] text-[#171717] min-h-screen font-sans selection:bg-[#6F5A43] selection:text-[#F6F2EC]">
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
