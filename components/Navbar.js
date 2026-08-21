'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';
import { trackResumeDownload } from './fx/trackDownload';
import { revealSection } from './fx/revealSection';
import { RESUME } from '../data/resume';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let current = 'hero';
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const scrollPos = window.scrollY + 160;
      for (const link of navLinks) {
        const id = link.href.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            if (current !== id) {
              current = id;
              setActiveSection(id);
              /* keep the URL hash in sync with the visible section
                 (replaceState: no history spam, no scroll side effects) */
              try {
                window.history.replaceState(null, '', `#${id}`);
              } catch (e) {
                /* ignore */
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* native anchor handles the (fast) scroll and the hash; we only close the
     menu and reveal the target's content immediately */
  const handleLinkClick = (href) => {
    setIsOpen(false);
    revealSection(href);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main Navigation">
        <a className="mark" href="#hero" aria-label={RESUME.name}>
          AMK<em>.</em>
        </a>

        <div className="nav-links">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={isActive ? 'on' : ''}
                aria-current={isActive ? 'true' : undefined}
              >
                {isActive &&
                  (prefersReducedMotion ? (
                    <span className="nav-pill" aria-hidden="true" />
                  ) : (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      aria-hidden="true"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  ))}
                {link.name}
              </a>
            );
          })}
        </div>

        <div className="nav-right">
          <ThemeToggle />
          <a
            href={RESUME.resumePath}
            download={RESUME.resumeDownloadName}
            onClick={() => trackResumeDownload('navbar')}
            className="btn btn-sm nav-resume"
            aria-label="Download Resume PDF"
          >
            Resume
          </a>
          <button
            className="icon-btn burger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mob"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={isActive ? 'on' : ''}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  {link.name}
                </a>
              );
            })}
            <a
              href={RESUME.resumePath}
              download={RESUME.resumeDownloadName}
              onClick={() => trackResumeDownload('mobile menu')}
            >
              <span className="n">↓</span>
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
