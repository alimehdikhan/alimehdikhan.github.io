'use client';

import { useEffect, useState, useRef } from 'react';
import { MagneticButton } from './ui/MagneticButton';
import { smoothScrollTo } from './Navbar';

export function Hero() {
  const canvasRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  // Typewriter states
  const roles = ['Software Engineer', 'AI/ML Developer', 'Machine Learning Enthusiast'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Track prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Subtle Scroll Parallax on Background (direct DOM updates to preserve 60fps)
  useEffect(() => {
    if (prefersReducedMotion) return;

    let active = true;
    const handleScroll = () => {
      if (!active) return;
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        if (canvasRef.current) {
          canvasRef.current.style.transform = `translateY(${scrollY * 0.22}px)`;
        }
        if (orb1Ref.current) {
          orb1Ref.current.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
        if (orb2Ref.current) {
          orb2Ref.current.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      active = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  // Particle Canvas Background
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = [];
    const codeSymbols = ['{ }', '< >', '/ /', ';', '=', '( )', '[ ]', '0 1'];
    const particleCount = Math.min(Math.max(Math.floor((window.innerWidth * window.innerHeight) / 45000), 10), 30);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2 - 0.1,
        symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
        opacity: Math.random() * 0.12 + 0.04,
        size: Math.random() * 4 + 11,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.fillStyle = isLightTheme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)';

      particles.forEach((p) => {
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = isLightTheme 
          ? `rgba(0, 0, 0, ${p.opacity})` 
          : `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  // Typewriter effect logic
  useEffect(() => {
    let timer;
    const currentRole = roles[roleIndex];

    if (prefersReducedMotion) {
      setCurrentText(currentRole);
      timer = setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 3500);
      return () => clearTimeout(timer);
    }

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(currentRole.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === currentRole) {
          setIsDeleting(true);
          setTypingSpeed(2000); // Wait before starting to delete
        }
      } else {
        setCurrentText(currentRole.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(500); // Wait before starting to type next word
        }
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, typingSpeed, prefersReducedMotion]);

  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      smoothScrollTo(el.offsetTop - 80, 850);
    }
  };

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <canvas id="particle-canvas" ref={canvasRef} aria-hidden="true" />
      
      {/* Ambient background glows with refs for parallax */}
      <div className="ambient-orb orb-primary" ref={orb1Ref} aria-hidden="true" />
      <div className="ambient-orb orb-secondary" ref={orb2Ref} aria-hidden="true" />

      <div className="container">
        <div 
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'center',
            width: '100%',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="hero-status-wrapper load-animate-1">
              <div className="hero-badge">
                <span className="status-dot" />
                <span>Actively seeking internships and full-time opportunities</span>
              </div>
            </div>

            <h1 
              className="load-animate-2"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em' }}
            >
              Hi, I'm <span className="text-gradient-animated">Ali Mehdi Khan</span>
            </h1>

            <div className="hero-typing-subtitle load-animate-3">
              <span>I'm a&nbsp;</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentText}</span>
              <span className="typing-cursor" aria-hidden="true" />
            </div>

            <p 
              className="load-animate-4"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '600px' }}
            >
              Computer Science undergraduate with internship experience, certifications, project experience, and practical exposure to Python, APIs, and software development.
            </p>

            <div className="hero-trust-indicators load-animate-5">
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Google Cloud Certified
              </span>
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                B.Tech CSE (2026)
              </span>
            </div>

            <div className="hero-cta-container load-animate-6" style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}>
              <MagneticButton variant="primary" as="a" href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')} aria-label="View Projects">
                View Projects
              </MagneticButton>
              <MagneticButton variant="secondary" as="a" href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} aria-label="Contact Me">
                Contact Me
              </MagneticButton>
            </div>

            <div className="hero-social-row">
              <a href="https://github.com/alimehdikhan" target="_blank" rel="noopener noreferrer" className="hero-social-link load-animate-7" style={{ animationDelay: '0.48s' }} aria-label="GitHub">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
              </a>
              <a href="https://linkedin.com/in/ali-mehdi-khan-b4062b2a3" target="_blank" rel="noopener noreferrer" className="hero-social-link load-animate-7" style={{ animationDelay: '0.54s' }} aria-label="LinkedIn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
              </a>
              <a href="mailto:ali973mehdi@gmail.com" className="hero-social-link load-animate-7" style={{ animationDelay: '0.60s' }} aria-label="Email">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>

          <div 
            className="hero-avatar-wrapper load-animate-8"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div 
              style={{
                width: 'clamp(200px, 25vw, 300px)',
                aspectRatio: 1,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px)',
                boxShadow: 'var(--shadow-apple)',
                position: 'relative'
              }}
            >
              <img 
                src="/assets/images/profile.png" 
                alt="Ali Mehdi Khan" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Pure CSS keyframe animations for staggered fade/slide-up on load */
        .load-animate-1 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .load-animate-2 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.08s forwards; opacity: 0; }
        .load-animate-3 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.16s forwards; opacity: 0; }
        .load-animate-4 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.24s forwards; opacity: 0; }
        .load-animate-5 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.32s forwards; opacity: 0; }
        .load-animate-6 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.40s forwards; opacity: 0; }
        .load-animate-7 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.48s forwards; opacity: 0; }
        .load-animate-8 { animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.24s forwards; opacity: 0; }

        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .load-animate-1, .load-animate-2, .load-animate-3, .load-animate-4, .load-animate-5, .load-animate-6, .load-animate-7, .load-animate-8 {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }

        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 2rem !important;
          }
          .hero-grid > div {
            align-items: center !important;
          }
          .hero-cta-container {
            justify-content: center !important;
          }
          .hero-social-row {
            justify-content: center !important;
          }
          .hero-avatar-wrapper {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}
