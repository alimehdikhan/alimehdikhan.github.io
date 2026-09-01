'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';
import { trackResumeDownload } from './fx/trackDownload';
import { revealSection } from './fx/revealSection';
import { scrollToHash } from './fx/scrollTo';
import { EASE, SPRING, STAGGER } from './fx/motion';
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

/* the section spy reads a 1px band this far below the top edge (clear of
   the fixed nav); scrollTo.js lands anchors at 92px so the band sits inside
   the arriving section */
const SPY_LINE = 160;
/* safety release for the click lock if `anchor:done` never arrives
   (native anchor path: reduced motion or a missing target) */
const LOCK_TIMEOUT = 1500;

const pillSpring = { type: 'spring', ...SPRING.ui };
const burgerSpring = { type: 'spring', ...SPRING.ui };
const lineOrigin = { originX: '50%', originY: '50%' };

/* mobile menu: panel fades first, then links rise in one after another;
   only the panel fades on exit (children carry no exit variant) */
const panelVariants = {
  open: {
    opacity: 1,
    transition: { duration: 0.22, when: 'beforeChildren', staggerChildren: STAGGER.link, delayChildren: 0.04 },
  },
  closed: { opacity: 0, transition: { duration: 0.18 } },
};
const linkVariants = {
  closed: { opacity: 0, y: 14 },
  open: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

/* keep the URL hash on the visible section: replaceState (no history spam,
   no scroll side effects), carrying the router's entry state through */
function syncHash(id) {
  try {
    window.history.replaceState(window.history.state, '', `#${id}`);
  } catch (e) {
    /* ignore */
  }
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const burgerRef = useRef(null);
  const mobRef = useRef(null);
  /* id the user just clicked: while set, the spy ignores the sections the
     travel passes through so the pill springs once, straight to the target */
  const lock = useRef(null);
  const lockTimer = useRef(null);
  /* mirrors `activeSection` for the observer callback (no stale closure) */
  const current = useRef('hero');
  /* last section the spy saw under the band, tracked even while locked so an
     interrupted travel can settle on whatever is actually on screen */
  const under = useRef('hero');

  const applyUnder = useCallback(() => {
    const id = under.current;
    if (lock.current || !id || id === current.current) return;
    current.current = id;
    setActiveSection(id);
    syncHash(id);
  }, []);

  const release = useCallback(() => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = null;
    lock.current = null;
    applyUnder();
  }, [applyUnder]);

  /* chrome flag: the only scroll-time work left, with hysteresis so a
     trackpad hovering near the threshold cannot flutter the bar */
  useEffect(() => {
    let prev = false;
    const onScroll = () => {
      const y = window.scrollY;
      const next = prev ? y > 24 : y > 56;
      if (next !== prev) {
        prev = next;
        setScrolled(next);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* section spy: an IntersectionObserver whose root is a 1px band at
     SPY_LINE; rootMargin cannot be calc(), so it is rebuilt on resize. Runs
     its initial pass at mount, so deep links and restored scroll positions
     start in the right state. */
  useEffect(() => {
    let io = null;
    let raf = 0;

    const build = () => {
      if (io) io.disconnect();
      const below = Math.max(0, window.innerHeight - (SPY_LINE + 1));
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id;
            if (entry.isIntersecting) under.current = id;
            else if (under.current === id) under.current = null;
          }
          applyUnder();
        },
        { rootMargin: `-${SPY_LINE}px 0px -${below}px 0px`, threshold: 0 }
      );
      navLinks.forEach((link) => {
        const el = document.getElementById(link.href.slice(1));
        if (el) io.observe(el);
      });
    };

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };

    build();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (io) io.disconnect();
    };
  }, [applyUnder]);

  /* the anchor travel reports when it ends (arrival or user interruption) */
  useEffect(() => {
    window.addEventListener('anchor:done', release);
    return () => {
      window.removeEventListener('anchor:done', release);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, [release]);

  /* mobile menu contract: html.menu-open (the WebGL backdrop pauses on it),
     body scroll lock, Escape closes and hands focus back to the burger,
     focus moves to the first link on open */
  useEffect(() => {
    if (!isOpen) return undefined;
    const root = document.documentElement;
    root.classList.add('menu-open');
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      if (burgerRef.current) burgerRef.current.focus();
    };
    window.addEventListener('keydown', onKey);

    const first = mobRef.current ? mobRef.current.querySelector('a') : null;
    if (first) first.focus({ preventScroll: true });

    return () => {
      window.removeEventListener('keydown', onKey);
      root.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* pill/highlight jump to the target at once; the spy stays locked until
     the travel reports done. scrollToHash pushes the hash itself; when it
     declines (reduced motion, missing target) the native anchor runs and the
     section's reveals are snapped visible so the jump never lands blank. */
  const handleLinkClick = (e, href) => {
    const id = href.slice(1);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lock.current = id;
    lockTimer.current = setTimeout(release, LOCK_TIMEOUT);
    current.current = id;
    setActiveSection(id);
    setIsOpen(false);
    if (scrollToHash(href)) e.preventDefault();
    else revealSection(href);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main Navigation">
        <a className="mark" href="#hero" aria-label={RESUME.name} onClick={(e) => handleLinkClick(e, '#hero')}>
          AMK<em>.</em>
        </a>

        <div className="nav-links">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={isActive ? 'on' : ''}
                aria-current={isActive ? 'true' : undefined}
              >
                {isActive &&
                  (prefersReducedMotion ? (
                    <span className="nav-pill" aria-hidden="true" style={{ borderRadius: 999 }} />
                  ) : (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav-pill"
                      aria-hidden="true"
                      style={{ borderRadius: 999 }}
                      transition={pillSpring}
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
            ref={burgerRef}
            className="icon-btn burger"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <motion.line
                x1="4"
                y1="7"
                x2="20"
                y2="7"
                style={lineOrigin}
                initial={false}
                animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={burgerSpring}
              />
              <motion.line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
                style={lineOrigin}
                initial={false}
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={burgerSpring}
              />
              <motion.line
                x1="4"
                y1="17"
                x2="20"
                y2="17"
                style={lineOrigin}
                initial={false}
                animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={burgerSpring}
              />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobRef}
            className="mob"
            variants={panelVariants}
            initial={prefersReducedMotion ? false : 'closed'}
            animate="open"
            exit="closed"
          >
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  variants={linkVariants}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={isActive ? 'on' : ''}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  {link.name}
                </motion.a>
              );
            })}
            <motion.a
              href={RESUME.resumePath}
              download={RESUME.resumeDownloadName}
              variants={linkVariants}
              onClick={() => trackResumeDownload('mobile menu')}
            >
              <span className="n">↓</span>
              Download Resume
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
