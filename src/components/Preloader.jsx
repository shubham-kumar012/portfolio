import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import profileImg from '../assets/profile.webp';

// Straight line control points -> Curved journey S-path control points
const INITIAL_PATH = {
  p1x: 50,  p1y: 60,
  c1x: 200, c1y: 60,
  c2x: 400, c2y: 60,
  p2x: 550, p2y: 60,
};

const CURVED_PATH = {
  p1x: 50,  p1y: 60,
  c1x: 200, c1y: 10,
  c2x: 400, c2y: 110,
  p2x: 550, p2y: 60,
};

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const svgContainerRef = useRef(null);
  const basePathRef = useRef(null);
  const animPathRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // 1. Fast Cache Check: If essential assets are already cached / ready immediately, bypass loader
    const checkIsCached = () => {
      const testImg = new Image();
      testImg.src = profileImg;
      const imgReady = testImg.complete && testImg.naturalWidth !== 0;
      const fontsReady = !document.fonts || document.fonts.status === 'loaded';
      return imgReady && fontsReady;
    };

    if (checkIsCached()) {
      if (containerRef.current) containerRef.current.style.display = 'none';
      if (onComplete) onComplete();
      return;
    }

    // 2. Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Flags for syncing real asset loading with the animation timeline
    let isAssetsLoaded = false;
    let isMinAnimationDone = false;
    let isDissolving = false;

    const triggerDissolve = () => {
      if (isDissolving || !containerRef.current) return;
      isDissolving = true;

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onStart: () => {
          if (onComplete) onComplete();
        },
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        },
      });
    };

    const tryFinishLoader = () => {
      if (isAssetsLoaded && isMinAnimationDone) {
        triggerDissolve();
      }
    };

    // 3. Track real essential assets (Hero image + Fonts + non-video DOM images)
    const trackEssentialAssets = () => {
      return new Promise((resolve) => {
        let imgDone = false;
        let fontsDone = false;
        let domDone = false;

        const checkAll = () => {
          if (imgDone && fontsDone && domDone) {
            resolve();
          }
        };

        // Track profile.webp
        const img = new Image();
        img.src = profileImg;
        if (img.complete && img.naturalWidth !== 0) {
          imgDone = true;
          checkAll();
        } else {
          img.onload = () => { imgDone = true; checkAll(); };
          img.onerror = () => { imgDone = true; checkAll(); };
        }

        // Track fonts
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            fontsDone = true;
            checkAll();
          }).catch(() => {
            fontsDone = true;
            checkAll();
          });
        } else {
          fontsDone = true;
          checkAll();
        }

        // Track non-video DOM readiness
        if (document.readyState === 'complete') {
          domDone = true;
          checkAll();
        } else {
          const handleLoad = () => {
            domDone = true;
            checkAll();
            window.removeEventListener('load', handleLoad);
          };
          window.addEventListener('load', handleLoad);
          // Safety timeout (max 3 seconds so user is never stuck)
          setTimeout(() => {
            domDone = true;
            checkAll();
          }, 3000);
        }
      });
    };

    // Start asset tracking
    trackEssentialAssets().then(() => {
      isAssetsLoaded = true;
      tryFinishLoader();
    });

    if (prefersReducedMotion) {
      // Reduced motion fallback: dissolve immediately when assets ready
      trackEssentialAssets().then(() => {
        triggerDissolve();
      });
      return;
    }

    // 4. Motion Animation Sequence
    const pathState = { ...INITIAL_PATH };
    const getPathD = (p) => `M ${p.p1x} ${p.p1y} C ${p.c1x} ${p.c1y}, ${p.c2x} ${p.c2y}, ${p.p2x} ${p.p2y}`;

    const updateSvgPaths = () => {
      const dStr = getPathD(pathState);
      if (basePathRef.current) basePathRef.current.setAttribute('d', dStr);
      if (animPathRef.current) animPathRef.current.setAttribute('d', dStr);
    };

    updateSvgPaths();
    if (animPathRef.current) {
      const len = animPathRef.current.getTotalLength();
      gsap.set(animPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
    }
    if (dotRef.current) {
      gsap.set(dotRef.current, { opacity: 0 });
    }

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
    });

    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(nameRef.current, { opacity: 0, y: 25 });
    gsap.set(subtitleRef.current, { opacity: 0, y: 15 });
    gsap.set(svgContainerRef.current, { opacity: 0 });

    // Start motion sequence only after custom fonts are 100% ready (prevents font jump/FOUT)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        tl.play();
      }).catch(() => {
        tl.play();
      });
    } else {
      tl.play();
    }

    // 0.15s: Name fades upward
    tl.to(nameRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, 0.15);

    // 0.5s: Subtitle fades in
    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.5);

    // 0.8s: Line draws left to right
    tl.to(svgContainerRef.current, {
      opacity: 1,
      duration: 0.2,
    }, 0.8);

    tl.to({ progress: 0 }, {
      progress: 1,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: function () {
        if (!animPathRef.current) return;
        const totalLen = animPathRef.current.getTotalLength();
        const drawOffset = totalLen * (1 - this.targets()[0].progress);
        gsap.set(animPathRef.current, { strokeDashoffset: drawOffset });
      },
    }, 0.8);

    // 1.3s: Line morphs smoothly into curved journey path
    tl.to(pathState, {
      c1x: CURVED_PATH.c1x,
      c1y: CURVED_PATH.c1y,
      c2x: CURVED_PATH.c2x,
      c2y: CURVED_PATH.c2y,
      duration: 0.4,
      ease: 'power2.inOut',
      onUpdate: updateSvgPaths,
    }, 1.3);

    // 1.5s: Glowing dot travels along curve
    tl.to(dotRef.current, {
      opacity: 1,
      duration: 0.15,
    }, 1.5);

    tl.to({ progress: 0 }, {
      progress: 1,
      duration: 0.45,
      ease: 'power1.inOut',
      onUpdate: function () {
        const p = this.targets()[0].progress;
        if (!animPathRef.current || !dotRef.current) return;

        const pathEl = animPathRef.current;
        const totalLen = pathEl.getTotalLength();
        const point = pathEl.getPointAtLength(p * totalLen);

        gsap.set(dotRef.current, { cx: point.x, cy: point.y });

        const drawOffset = totalLen * (1 - p);
        gsap.set(pathEl, { strokeDashoffset: drawOffset });
      },
      onComplete: () => {
        isMinAnimationDone = true;
        tryFinishLoader();
      },
    }, 1.5);

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#F6F2EC] select-none overflow-hidden"
    >
      {/* Paper grain texture matching portfolio background */}
      <div className="pointer-events-none absolute inset-0 paper-grain-overlay opacity-80" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-4xl">
        
        {/* Editorial Name Typography */}
        <div
          ref={nameRef}
          className="text-center font-display font-bold uppercase tracking-wider text-[#171717] leading-[0.88] select-none text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8.5vw] drop-shadow-sm opacity-0 translate-y-6"
        >
          <div>SHUBHAM</div>
          <div>KUMAR</div>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm font-sans tracking-[0.25em] sm:tracking-[0.32em] uppercase text-[#6F5A43] font-semibold text-center max-w-md opacity-0 translate-y-4"
        >
          Building thoughtful digital experiences.
        </p>

        {/* Dynamic Journey Line & Glowing Dot SVG */}
        <div ref={svgContainerRef} className="mt-6 sm:mt-8 w-full max-w-[320px] sm:max-w-[420px] h-[50px] flex justify-center items-center opacity-0">
          <svg
            viewBox="0 0 600 120"
            className="w-full h-full overflow-visible"
          >
            {/* Subtle background path */}
            <path
              ref={basePathRef}
              d="M 50 60 C 200 60, 400 60, 550 60"
              stroke="rgba(111, 90, 67, 0.18)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Accent active path */}
            <path
              ref={animPathRef}
              d="M 50 60 C 200 60, 400 60, 550 60"
              stroke="#6F5A43"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Tiny traveling glowing dot */}
            <circle
              ref={dotRef}
              cx="50"
              cy="60"
              r="3.5"
              fill="#6F5A43"
              className="drop-shadow-[0_0_6px_rgba(111,90,67,0.7)]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
