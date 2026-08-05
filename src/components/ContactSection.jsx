import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HiArrowRight,
  HiArrowUpRight,
  HiEnvelope,
  HiDocumentArrowDown,
  HiCheck,
} from 'react-icons/hi2';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

const LETTER_PARAGRAPHS = [
  { id: 'p1', type: 'salutation', text: 'Dear Visitor,' },
  {
    id: 'p2',
    type: 'body',
    text: 'Thank you for taking the time to explore my work.',
  },
  {
    id: 'p3',
    type: 'body',
    text: 'Every project here represents a challenge I enjoyed solving and something valuable I learned.',
  },
  {
    id: 'p4',
    type: 'body',
    text: "If you're looking for someone who enjoys building thoughtful, performant, and user-focused digital experiences,",
  },
  { id: 'p5', type: 'emphasis', text: "I'd love to connect." },
  { id: 'p6', type: 'signoff', text: '— Shubham Kumar' },
];

export default function ContactSection() {
  const [isOpened, setIsOpened] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeRipple, setActiveRipple] = useState(null);

  // Kinetic handwriting live-writing state
  const [typedCounts, setTypedCounts] = useState({
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    p5: 0,
    p6: 0,
  });
  const [activePIndex, setActivePIndex] = useState(null);
  const [isTypingFinished, setIsTypingFinished] = useState(false);

  const sectionRef = useRef(null);
  const headingContainerRef = useRef(null);
  const letterRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const drawerRef = useRef(null);
  const capsulesRef = useRef([]);
  const hasStartedTyping = useRef(false);

  // Kinetic live writing sequence (preserves full letter layout, reveals character-by-character)
  const startRealtimeWriting = () => {
    if (hasStartedTyping.current) return;
    hasStartedTyping.current = true;

    let currentP = 0;
    let currentChar = 0;

    const typeNextChar = () => {
      if (currentP >= LETTER_PARAGRAPHS.length) {
        setIsTypingFinished(true);
        setActivePIndex(null);
        return;
      }

      const para = LETTER_PARAGRAPHS[currentP];
      const fullText = para.text;

      if (currentChar <= fullText.length) {
        setTypedCounts((prev) => ({
          ...prev,
          [para.id]: currentChar,
        }));
        setActivePIndex(currentP);

        const lastChar = fullText[currentChar - 1];
        let delay = 14; // smooth kinetic typing cadence (ms)

        if (lastChar === ',') {
          delay = 140; // subtle speech pause for comma
        } else if (lastChar === '.') {
          delay = 240; // subtle speech pause for period
        }

        currentChar++;

        if (currentChar > fullText.length) {
          setTypedCounts((prev) => ({
            ...prev,
            [para.id]: fullText.length,
          }));
          currentP++;
          currentChar = 0;
          setTimeout(typeNextChar, 240); // brief pause between paragraphs
        } else {
          setTimeout(typeNextChar, delay);
        }
      }
    };

    typeNextChar();
  };

  // Initialize GSAP entrance animations on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Line-by-line reveal of the large section heading
      const headingLines = headingContainerRef.current?.querySelectorAll(
        '.contact-heading-line'
      );
      if (headingLines && headingLines.length > 0) {
        gsap.fromTo(
          headingLines,
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.18,
            scrollTrigger: {
              trigger: headingContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Paper letter entrance reveal & real-time kinetic writing trigger
      if (letterRef.current) {
        gsap.fromTo(
          letterRef.current,
          { y: 70, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: letterRef.current,
              start: 'top 82%',
              onEnter: () => startRealtimeWriting(),
              onEnterBack: () => startRealtimeWriting(),
            },
          }
        );
      }

      // 3. Primary button entrance
      if (buttonContainerRef.current) {
        gsap.fromTo(
          buttonContainerRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: buttonContainerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle capsule individual subtle 3D tilt on mousemove
  const handleCapsuleMouseMove = (e, index) => {
    const card = capsulesRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cardX = e.clientX - rect.left - rect.width / 2;
    const cardY = e.clientY - rect.top - rect.height / 2;

    const tiltX = (cardY / (rect.height / 2)) * -2.5;
    const tiltY = (cardX / (rect.width / 2)) * 2.5;

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 800,
      scale: 1.015,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handleCapsuleMouseLeave = (index) => {
    const card = capsulesRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  // Main cinematic transformation when "Let's Connect" is clicked
  const handleConnectClick = () => {
    if (isOpened) return;

    // Immediately complete writing if button clicked during animation
    setIsTypingFinished(true);

    const tl = gsap.timeline({
      onStart: () => setIsOpened(true),
    });

    // Fade out button container
    tl.to(buttonContainerRef.current, {
      opacity: 0,
      y: -10,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (buttonContainerRef.current) {
          buttonContainerRef.current.style.display = 'none';
        }
      },
    })
      // Lift letter gently upward & apply subtle elevation fold
      .to(
        letterRef.current,
        {
          y: -16,
          scale: 0.99,
          rotateX: 2,
          duration: 0.9,
          ease: 'power3.inOut',
        },
        '-=0.3'
      )
      // Unfold / slide drawer upward smoothly from under the letter
      .fromTo(
        drawerRef.current,
        { height: 0, opacity: 0, y: 40 },
        {
          height: 'auto',
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.inOut',
        },
        '-=0.7'
      )
      // Stagger contact capsules upward one after another
      .fromTo(
        capsulesRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.4'
      );
  };

  // Click handler for capsules with ripple animation and delayed action
  const handleCapsuleClick = (e, actionType, url, index) => {
    const card = capsulesRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    setActiveRipple({ index, x: rippleX, y: rippleY });

    gsap
      .timeline()
      .to(card, { scale: 0.98, duration: 0.1, ease: 'power2.out' })
      .to(card, { scale: 1.02, duration: 0.15, ease: 'power2.out' })
      .to(card, { scale: 1, duration: 0.2, ease: 'power2.out' });

    setTimeout(() => {
      setActiveRipple(null);
      if (actionType === 'email') {
        window.location.href = 'mailto:shubhampal7083@gmail.com';
        navigator.clipboard?.writeText('shubhampal7083@gmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 3000);
      } else if (actionType === 'download' || actionType === 'link') {
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      } else if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }, 220);
  };

  const capsules = [
    {
      id: 'email',
      title: 'EMAIL',
      description: "Let's start a conversation",
      subtext: 'Primary contact method',
      actionType: 'email',
      url: null,
      type: 'email',
    },
    {
      id: 'linkedin',
      title: 'LINKEDIN',
      description: "Let's connect professionally",
      subtext: 'Networking & experience',
      actionType: 'link',
      url: 'https://linkedin.com/in/shubham-kumar-111041267',
      type: 'linkedin',
    },
    {
      id: 'github',
      title: 'GITHUB',
      description: 'Explore my repositories',
      subtext: 'Open source & code history',
      actionType: 'link',
      url: 'https://github.com/shubham-kumar012',
      type: 'github',
    },
    {
      id: 'resume',
      title: 'RESUME',
      description: 'View & Download Resume',
      subtext: 'Google Drive PDF • Official Document',
      actionType: 'link',
      url: 'https://drive.google.com/file/d/1E8m6CmKw8aPj4MYJ5tqAHvyYxE6taYvj/view?usp=drive_link',
      type: 'resume',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative min-h-screen w-full pt-28 sm:pt-36 lg:pt-44 pb-8 sm:pb-12 px-4 sm:px-8 flex flex-col items-center justify-center text-center transition-colors duration-1000 ease-in-out ${isOpened ? 'bg-[#EFEAE2]' : 'bg-[#F6F2EC]'
        }`}
    >
      {/* Paper grain background texture overlay */}
      <div className="absolute inset-0 paper-grain-overlay pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* SECTION INTRODUCTION */}
        <div ref={headingContainerRef} className="mb-14 sm:mb-20 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#6F5A43] font-semibold mb-5 inline-block">
            FINAL CHAPTER
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-[#171717] leading-[1.08] text-center">
            <div className="overflow-hidden py-1">
              <span className="contact-heading-line inline-block">
                Let's Build Something
              </span>
            </div>
            <div className="overflow-hidden py-1">
              <span className="contact-heading-line inline-block text-[#6F5A43] font-normal italic">
                Worth Remembering.
              </span>
            </div>
          </h2>
        </div>

        {/* LETTER INVITATION CARD (Full Stationery Paper without Folded Corner) */}
        <div
          ref={letterRef}
          data-cursor="card"
          className="w-full max-w-2xl mx-auto rounded-[2rem] bg-[#FAF4EB] border border-[#6F5A43]/18 p-8 sm:p-12 md:p-14 text-left shadow-[0_28px_65px_-15px_rgba(42,33,26,0.14),0_4px_18px_rgba(42,33,26,0.05)] relative overflow-hidden transition-shadow duration-500 mb-10 group"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Faint Ruled Paper Lines Overlay */}
          <div className="absolute inset-0 paper-ruled-bg opacity-75 pointer-events-none" />

          {/* Paper Letter Left Margin Accent Line */}
          <div className="absolute top-0 bottom-0 left-6 sm:left-10 w-[1.5px] bg-[#6F5A43]/18 pointer-events-none" />

          {/* Subtle paper watermark indicator in top right */}
          <div className="absolute top-6 right-8 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#6F5A43]/50 pointer-events-none select-none flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6F5A43]/50" />
            <span>INVITATION</span>
          </div>

          {/* Letter Body Content in Kinetic "Edu TAS Beginner" Handwriting */}
          <div className="relative z-10 space-y-6 pl-5 sm:pl-8 font-handwriting text-ink">
            {LETTER_PARAGRAPHS.map((para, index) => {
              const isPastParagraph = activePIndex !== null && index < activePIndex;
              const count =
                isTypingFinished || isPastParagraph
                  ? para.text.length
                  : typedCounts[para.id] || 0;
              const visibleText = para.text.slice(0, count);
              const hiddenText = para.text.slice(count);
              const isActive = activePIndex === index && !isTypingFinished;

              if (para.type === 'salutation') {
                return (
                  <p
                    key={para.id}
                    className="text-2xl sm:text-3xl text-[#1E1A17] font-semibold tracking-wide"
                  >
                    <span>{visibleText}</span>
                    {isActive && (
                      <span className="inline-block w-[2.5px] h-[0.95em] bg-[#1E1A17] align-baseline ml-0.5 animate-pulse" />
                    )}
                    <span className="opacity-0 select-none pointer-events-none">
                      {hiddenText}
                    </span>
                  </p>
                );
              }

              if (para.type === 'emphasis') {
                return (
                  <p
                    key={para.id}
                    className="text-xl sm:text-2xl md:text-[1.65rem] text-[#1E1A17] font-medium pt-1"
                  >
                    <span>{visibleText}</span>
                    {isActive && (
                      <span className="inline-block w-[2.5px] h-[0.95em] bg-[#1E1A17] align-baseline ml-0.5 animate-pulse" />
                    )}
                    <span className="opacity-0 select-none pointer-events-none">
                      {hiddenText}
                    </span>
                  </p>
                );
              }

              if (para.type === 'signoff') {
                return (
                  <div
                    key={para.id}
                    className="pt-6 border-t border-[#6F5A43]/20 flex items-center justify-between"
                  >
                    <span className="text-2xl sm:text-3xl font-semibold text-[#1E1A17] tracking-wider">
                      <span>{visibleText}</span>
                      {isActive && (
                        <span className="inline-block w-[2.5px] h-[0.95em] bg-[#1E1A17] align-baseline ml-0.5 animate-pulse" />
                      )}
                      <span className="opacity-0 select-none pointer-events-none">
                        {hiddenText}
                      </span>
                    </span>

                    <span className="text-xs font-mono text-[#6F5A43]/70 tracking-widest uppercase font-semibold">
                      Developer & Creator
                    </span>
                  </div>
                );
              }

              return (
                <p
                  key={para.id}
                  className="text-lg sm:text-xl md:text-2xl leading-[2.1rem] sm:leading-[2.3rem] text-[#241F1C] font-normal"
                >
                  <span>{visibleText}</span>
                  {isActive && (
                    <span className="inline-block w-[2.5px] h-[0.95em] bg-[#1E1A17] align-baseline ml-0.5 animate-pulse" />
                  )}
                  <span className="opacity-0 select-none pointer-events-none">
                    {hiddenText}
                  </span>
                </p>
              );
            })}
          </div>
        </div>

        {/* PRIMARY BUTTON: "Let's Connect →" */}
        <div ref={buttonContainerRef} className="mb-4">
          <Magnetic strength={0.15}>
            <button
              onClick={handleConnectClick}
              data-cursor="button"
              className="group relative inline-flex items-center gap-3.5 px-9 py-4 sm:px-11 sm:py-4.5 rounded-full bg-[#171717] text-[#F6F2EC] text-sm sm:text-base font-medium tracking-wide shadow-md transition-all duration-300 hover:bg-[#2C241E] hover:shadow-xl active:scale-95"
            >
              <span>Let's Connect</span>
              <HiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </Magnetic>
        </div>

        {/* CONTACT DRAWER (Unfolds on button click) */}
        <div
          ref={drawerRef}
          className="w-full max-w-2xl mx-auto overflow-hidden opacity-0 h-0"
        >
          <div className="pt-6 pb-4 flex flex-col items-center">
            {/* Drawer instruction message */}
            <p className="text-xl sm:text-2xl font-serif text-[#171717] font-medium mb-6 text-center">
              Choose the way you'd like to start the conversation.
            </p>

            {/* Soft Pulsing Status Badge */}
            <div className="max-w-full inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-full bg-[#FAF4EB] border border-[#6F5A43]/18 mb-8 text-xs sm:text-sm font-medium text-[#171717]/85 shadow-xs text-center leading-relaxed">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-center">
                Currently Available for{' '}
                <strong className="font-semibold text-[#171717]">
                  Software Engineer
                </strong>{' '}
                <span className="text-[#6F5A43]/40 mx-0.5">•</span>{' '}
                <strong className="font-semibold text-[#171717]">
                  Frontend Developer
                </strong>{' '}
                <span className="text-[#6F5A43]/40 mx-0.5">•</span>{' '}
                <strong className="font-semibold text-[#171717]">
                  Full Stack Developer
                </strong>
              </span>
            </div>

            {/* FOUR LARGE PREMIUM CONTACT CAPSULES */}
            <div className="w-full flex flex-col gap-4">
              {capsules.map((capsule, index) => {
                return (
                  <div
                    key={capsule.id}
                    ref={(el) => (capsulesRef.current[index] = el)}
                    onMouseMove={(e) => handleCapsuleMouseMove(e, index)}
                    onMouseLeave={() => handleCapsuleMouseLeave(index)}
                    onClick={(e) =>
                      handleCapsuleClick(
                        e,
                        capsule.actionType,
                        capsule.url,
                        index
                      )
                    }
                    data-cursor="button"
                    className={`group relative w-full rounded-2xl sm:rounded-3xl border border-[#171717]/08 p-5 sm:p-6 sm:px-8 flex items-center justify-between cursor-pointer overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md ${capsule.type === 'github'
                      ? 'bg-[#FAF8F5] hover:bg-[#EFEAE2]'
                      : 'bg-[#FAF8F5]'
                      }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* LINKEDIN: Thin blue accent line underneath */}
                    {capsule.type === 'linkedin' && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0A66C2] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    )}

                    {/* EMAIL: Border brightening on hover */}
                    {capsule.type === 'email' && (
                      <span className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-transparent group-hover:border-[#171717]/25 transition-colors duration-300 pointer-events-none" />
                    )}

                    {/* Click Ripple Effect */}
                    {activeRipple?.index === index && (
                      <span
                        className="absolute rounded-full bg-[#171717]/10 animate-ping pointer-events-none -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${activeRipple.x}px`,
                          top: `${activeRipple.y}px`,
                          width: '180px',
                          height: '180px',
                        }}
                      />
                    )}

                    {/* Left content: Title & Descriptions */}
                    <div className="flex items-center gap-4 sm:gap-6 text-left z-10">
                      {/* Icon container */}
                      <div
                        className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl transition-transform duration-300 ${capsule.type === 'resume'
                          ? 'bg-[#171717]/05 text-[#171717] group-hover:-translate-y-1'
                          : capsule.type === 'email'
                            ? 'bg-[#171717]/05 text-[#171717] group-hover:scale-105'
                            : 'bg-[#171717]/05 text-[#171717]'
                          }`}
                      >
                        {capsule.type === 'email' && (
                          <HiEnvelope className="text-xl sm:text-2xl transition-transform duration-300 group-hover:rotate-6" />
                        )}
                        {capsule.type === 'linkedin' && (
                          <FaLinkedin className="text-xl sm:text-2xl text-[#0A66C2] transition-transform duration-300 group-hover:scale-110" />
                        )}
                        {capsule.type === 'github' && (
                          <FaGithub className="text-xl sm:text-2xl text-[#171717] transition-transform duration-300 group-hover:scale-110" />
                        )}
                        {capsule.type === 'resume' && (
                          <HiDocumentArrowDown className="text-xl sm:text-2xl text-[#171717] transition-transform duration-300 group-hover:animate-bounce" />
                        )}
                      </div>

                      {/* Text details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs uppercase tracking-widest text-[#6F5A43] font-semibold">
                            {capsule.title}
                          </span>
                          {capsule.type === 'email' && copiedEmail && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                              <HiCheck className="text-xs" /> Copied!
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#171717] tracking-tight">
                          {capsule.description}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#171717]/60 font-normal">
                          {capsule.subtext}
                        </p>
                      </div>
                    </div>

                    {/* Right Action Arrow Icon */}
                    <div className="z-10 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#171717]/04 group-hover:bg-[#171717] text-[#171717] group-hover:text-[#F6F2EC] transition-all duration-300">
                      {capsule.type === 'github' ? (
                        <HiArrowUpRight className="text-lg sm:text-xl transition-transform duration-300 group-hover:rotate-45" />
                      ) : capsule.type === 'resume' ? (
                        <HiDocumentArrowDown className="text-lg sm:text-xl transition-transform duration-300 group-hover:translate-y-0.5" />
                      ) : (
                        <HiArrowUpRight className="text-lg sm:text-xl transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-14 sm:mt-18 mb-2 text-center z-10">
          <p className="font-mono text-xs sm:text-sm text-[#171717]/50 tracking-wider leading-relaxed">
            Designed & Developed with
          </p>
          <p className="font-mono text-xs sm:text-sm font-medium text-[#171717]/70 tracking-widest mt-1">
            React • GSAP • Curiosity
          </p>
          <p className="font-serif italic text-xs text-[#171717]/40 mt-3">
            — Shubham Kumar © 2026
          </p>
        </div>
      </div>
    </section>
  );
}
