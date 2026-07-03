'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';
import { RESUME } from '../data/resume';

export function smoothScrollTo(targetPosition, duration = 800) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const run = easeOutQuart(progress) * distance + startPosition;

    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  requestAnimationFrame(animation);
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const navEl = navRef.current;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollPos = currentScrollY + 160;

      for (const link of navLinks) {
        const id = link.href.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }

      if (navEl) {
        if (currentScrollY > 40) {
          navEl.classList.add('bg-bg-elevated/80', 'border-border-dim/80', 'shadow-2xl');
          navEl.classList.remove('bg-bg-elevated/40', 'border-border-dim/40');
        } else {
          navEl.classList.remove('bg-bg-elevated/80', 'border-border-dim/80', 'shadow-2xl');
          navEl.classList.add('bg-bg-elevated/40', 'border-border-dim/40');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;
      smoothScrollTo(offsetPosition, 850);
    }
  };

  return (
    <div className="fixed top-4 w-full flex justify-center z-50 pointer-events-none px-4">
      <nav
        ref={navRef}
        className="pointer-events-auto flex items-center justify-between w-[95vw] md:max-w-4xl px-6 py-2 border border-border-dim/40 bg-bg-elevated/40 backdrop-blur-md rounded-full transition-all duration-300"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="flex-1 flex items-center justify-start">
          <a href="#hero" className="text-text-primary font-extrabold text-sm hidden lg:block" onClick={(e) => handleLinkClick(e, '#hero')}>
            Ali Mehdi Khan
          </a>

          <button
            className="block lg:hidden p-2 text-text-primary bg-transparent border-none cursor-pointer -ml-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 relative hidden lg:flex shrink-0">
          {navLinks.map((link) => {
            const id = link.href.substring(1);
            const isActive = activeSection === id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-full select-none transition-colors z-10 ${isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {isActive && !prefersReducedMotion && (
                  <motion.div
                    layoutId="nav-highlight"
                    className="absolute inset-0 bg-bg-elevated/80 border border-border-dim/50 rounded-full z-[-1]"
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  />
                )}
                {isActive && prefersReducedMotion && (
                  <div className="absolute inset-0 bg-bg-elevated/80 border border-border-dim/50 rounded-full z-[-1]" />
                )}
                {link.name}
              </a>
            );
          })}
        </div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <ThemeToggle />
          <a
            href={RESUME.resumePath}
            download={RESUME.resumeDownloadName}
            className="px-3.5 py-1.5 text-xs font-semibold text-text-secondary bg-bg-primary border border-border-dim rounded-full hover:bg-bg-elevated hover:text-text-primary transition-all"
            aria-label="Download Resume PDF"
          >
            Resume
          </a>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 p-4 bg-bg-elevated border border-border-dim rounded-2xl flex flex-col gap-2 lg:hidden shadow-2xl max-h-[70vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((link) => {
                const id = link.href.substring(1);
                const isActive = activeSection === id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg ${isActive ? 'bg-bg-primary text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <a
                href={RESUME.resumePath}
                download={RESUME.resumeDownloadName}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-lg text-indigo-400 border border-border-dim hover:bg-bg-primary text-center"
              >
                Download Resume
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}