'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { smoothScrollTo } from './Navbar';

export function Hero() {
  const canvasRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Typewriter states
  const roles = ['Software Engineer', 'AI/ML Developer', 'Web Developer'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

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
    const particleCount = Math.min(Math.max(Math.floor((window.innerWidth * window.innerHeight) / 45000), 10), 35);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: prefersReducedMotion ? 'none' : 'blur(4px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-bg-primary py-20 sm:py-24 md:py-32">
      <canvas id="particle-canvas" ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" aria-hidden="true" />
      
      {/* Ambient background glows */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none z-0" ref={orb1Ref} aria-hidden="true" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none z-0" ref={orb2Ref} aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-24 items-center text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:col-span-7 flex flex-col gap-6">
            <motion.div className="flex" variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Actively seeking opportunities</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-tight"
              variants={itemVariants}
            >
              Hi, I'm <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Ali Mehdi Khan</span>
            </motion.h1>

            <motion.div className="text-xl sm:text-2xl text-text-secondary font-medium flex items-center h-8" variants={itemVariants}>
              <span>I'm a&nbsp;</span>
              <span className="text-text-primary font-bold border-r-2 border-text-primary pr-1 animate-caret">{currentText}</span>
            </motion.div>

            <motion.p 
              className="text-lg text-text-tertiary leading-relaxed max-w-2xl"
              variants={itemVariants}
            >
              Computer Science undergraduate (2026) skilled in Python, Java, Machine Learning, and AI application development. Certified in Google Cloud and Deloitte Job Simulation.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4 text-sm text-text-tertiary" variants={itemVariants}>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Google Cloud Certified
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                B.Tech CSE (2026)
              </span>
            </motion.div>

            <motion.div className="flex flex-wrap gap-4 pt-2" variants={itemVariants}>
              <MagneticButton variant="primary" as="a" href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')} aria-label="View Projects">
                View Projects
              </MagneticButton>
              <MagneticButton variant="secondary" as="a" href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} aria-label="Contact Me">
                Contact Me
              </MagneticButton>
            </motion.div>

            <motion.div className="flex gap-4 pt-4" variants={itemVariants}>
              {[
                { href: 'https://github.com/alimehdikhan', icon: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z', label: 'GitHub' },
                { href: 'https://linkedin.com/in/ali-mehdi-khan-b4062b2a3', icon: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z', label: 'LinkedIn' },
                { href: 'mailto:ali973mehdi@gmail.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', stroke: true },
              ].map((social, sIdx) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-border-dim bg-bg-elevated/50 text-text-secondary hover:text-text-primary hover:border-border-dim transition-colors"
                  aria-label={social.label}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.08, y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <svg width="18" height="18" fill={social.stroke ? 'none' : 'currentColor'} stroke={social.stroke ? 'currentColor' : 'none'} strokeWidth={social.stroke ? '2' : '0'} viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </motion.div>
          </div>

          <div className="md:col-span-5 flex justify-center md:justify-end">
            <motion.div 
              className="relative w-[180px] sm:w-[240px] md:w-[280px] aspect-square rounded-lg overflow-hidden border border-border-dim bg-bg-elevated/50 backdrop-blur-md shadow-2xl"
              variants={itemVariants}
              whileHover={prefersReducedMotion ? {} : { scale: 1.03, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <img 
                src="/assets/images/profile.png" 
                alt="Ali Mehdi Khan" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
