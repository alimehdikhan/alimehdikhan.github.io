'use client';

import { useState, useEffect, useRef } from 'react';
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
  const navRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const lastScrollY = useRef(0);

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
    const navEl = navRef.current ? navRef.current.closest('.ds-nav') : null;

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
          navEl.classList.add('nav-scrolled');
        } else {
          navEl.classList.remove('nav-scrolled');
        }

        // Scroll direction tracker (past a safety margin)
        if (currentScrollY > 120) {
          if (currentScrollY > lastScrollY.current) {
            // Scrolling down - hide navigation smoothly
            navEl.classList.add('nav-hidden');
          } else {
            // Scrolling up - show navigation immediately
            navEl.classList.remove('nav-hidden');
          }
        } else {
          navEl.classList.remove('nav-hidden');
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding pill highlight coordinates dynamically
  useEffect(() => {
    if (!navRef.current) return;
    
    const activeEl = navRef.current.querySelector('.ds-nav-link.active');
    if (activeEl) {
      setSliderStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1
      });
    } else {
      setSliderStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection, isOpen]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!navRef.current) return;
      const activeEl = navRef.current.querySelector('.ds-nav-link.active');
      if (activeEl) {
        setSliderStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);

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
    <nav className="ds-nav" role="navigation" aria-label="Main Navigation">
      <a href="#hero" className="ds-nav-logo" onClick={(e) => handleLinkClick(e, '#hero')}>
        <strong>Ali Mehdi Khan</strong>
      </a>

      {/* Hamburger menu for mobile devices */}
      <button 
        className="hamburger-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        aria-expanded={isOpen}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer'
        }}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Nav links container with sliding highlight */}
      <div 
        ref={navRef}
        className={`nav-links-container ${isOpen ? 'show' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          position: 'relative'
        }}
      >
        {/* Dynamic Highlight Pill */}
        <div className="nav-slider-highlight" style={sliderStyle} />

        {navLinks.map((link) => {
          const id = link.href.substring(1);
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`ds-nav-link ${activeSection === id ? 'active' : ''}`}
              role="menuitem"
            >
              {link.name}
            </a>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="ds-nav-resume">
        <ThemeToggle />
        <a 
          href="/assets/resume/AliMehdiKhan Resume Optimized.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          download="AliMehdiKhan_Resume.pdf"
          className="ds-btn ds-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          aria-label="Download Resume"
        >
          Resume
        </a>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          :global(.nav-slider-highlight) {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .hamburger-toggle {
            display: block !important;
          }
          .nav-links-container {
            display: ${isOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--nav-bg);
            backdrop-filter: blur(24px);
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-top: 0.5rem;
            box-shadow: var(--shadow-drop);
            border: 1px solid var(--card-border);
            align-items: stretch !important;
          }
        }
      `}</style>
    </nav>
  );
}
