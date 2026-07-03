'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';

// Custom eased smooth scroll utility (easeOutQuart)
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
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Open Source', href: '#opensource' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  // Observe scrolling to update active link, scrolled status, and scroll hide
  useEffect(() => {
    const navEl = navRef.current;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollPos = currentScrollY + 160;
      
      // 1. Update active section
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

      // 2. Hide/Reveal navbar on scroll direction & Scrolled glass treatment
      if (navEl) {
        // Scrolled glass background transition
        if (currentScrollY > 40) {
          navEl.classList.add('bg-neutral-900/80', 'backdrop-blur-lg', 'border-neutral-800/80', 'shadow-2xl');
          navEl.classList.remove('bg-neutral-950/20', 'border-transparent');
        } else {
          navEl.classList.remove('bg-neutral-900/80', 'backdrop-blur-lg', 'border-neutral-800/80', 'shadow-2xl');
          navEl.classList.add('bg-neutral-950/20', 'border-transparent');
        }

        // Scroll direction tracker (past a safety margin)
        if (currentScrollY > 120) {
          if (currentScrollY > lastScrollY.current) {
            // Scrolling down - hide navigation smoothly
            navEl.style.transform = 'translate3d(-50%, -120%, 0)';
          } else {
            // Scrolling up - show navigation immediately
            navEl.style.transform = 'translate3d(-50%, 0, 0)';
          }
        } else {
          navEl.style.transform = 'translate3d(-50%, 0, 0)';
        }
      }

      lastScrollY.current = currentScrollY;
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
    <nav 
      ref={navRef}
      className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between w-max max-w-[95vw] px-4 py-2 border border-transparent bg-neutral-950/20 rounded-full z-50 transition-all duration-300 transform"
      style={{ transform: 'translate3d(-50%, 0, 0)' }}
      role="navigation" 
      aria-label="Main Navigation"
    >
      <a href="#hero" className="text-white font-extrabold text-sm mr-6 hidden md:block" onClick={(e) => handleLinkClick(e, '#hero')}>
        Ali Mehdi Khan
      </a>

      {/* Hamburger menu for mobile devices */}
      <button 
        className="block md:hidden p-2 text-white bg-transparent border-none cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Nav links container with sliding highlight */}
      <div 
        className="flex items-center gap-1 relative"
      >
        {navLinks.map((link) => {
          const id = link.href.substring(1);
          const isActive = activeSection === id;
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-full select-none transition-colors z-10 ${isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'} ${isOpen ? 'block' : 'hidden md:block'}`}
              role="menuitem"
            >
              {isActive && !prefersReducedMotion && (
                <motion.div 
                  layoutId="nav-highlight"
                  className="absolute inset-0 bg-neutral-800/80 border border-neutral-700/50 rounded-full z-[-1]"
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                />
              )}
              {isActive && prefersReducedMotion && (
                <div className="absolute inset-0 bg-neutral-800/80 border border-neutral-700/50 rounded-full z-[-1]" />
              )}
              {link.name}
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-3 ml-6">
        <ThemeToggle />
        <a 
          href="/assets/resume/AliMehdiKhan Resume Optimized.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          download="AliMehdiKhan_Resume.pdf"
          className="px-3.5 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 hover:text-white transition-all hidden md:block"
          aria-label="Download Resume"
        >
          Resume
        </a>
      </div>

      {/* Mobile menu container overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col gap-2 md:hidden shadow-2xl"
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
                  className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg ${isActive ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                  role="menuitem"
                >
                  {link.name}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
