'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Download, Menu } from '@/components/ui/icons';
import { ThemeToggle } from './ui/ThemeToggle';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog';
import { trackResumeDownload } from './fx/trackDownload';
import { revealSection } from './fx/revealSection';
import { scrollToHash } from './fx/scrollTo';
import { EASE, SPRING } from './fx/motion';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

/* the logo already returns to the top, so there is no separate Home link */
const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

/* the section spy reads a 1px band this far below the top edge (clear of
   the fixed nav); scrollTo.js lands anchors at 72px so the band sits inside
   the arriving section */
const SPY_LINE = 120;
/* safety release for the click lock if `anchor:done` never arrives
   (native anchor path: reduced motion or a missing target) */
const LOCK_TIMEOUT = 1500;

const underlineSpring = { type: 'spring', ...SPRING.ui };

/* mobile menu links rise in one after another once the dialog opens */
const listVariants = {
  open: { transition: { staggerChildren: 0.035, delayChildren: 0.06 } },
  closed: {},
};
const linkVariants = {
  closed: { opacity: 0, y: 8 },
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
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

  /* id the user just clicked: while set, the spy ignores the sections the
     travel passes through so the underline moves once, straight to the target */
  const lock = useRef(null);
  const lockTimer = useRef(null);
  /* mirrors `activeSection` for the observer callback (no stale closure) */
  const current = useRef('hero');
  /* last section the spy saw under the band, tracked even while locked so an
     interrupted travel can settle on whatever is actually on screen */
  const under = useRef('hero');
  /* a mobile-menu link waits for the dialog to close (and release its
     scroll lock) before travelling */
  const pending = useRef(null);

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

  /* chrome flag with hysteresis so a trackpad near the threshold cannot
     flutter the bar */
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
     SPY_LINE; rootMargin cannot be calc(), so it is rebuilt on resize */
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
      /* the hero and the GitHub section have no nav link; observing them too
         means no link stays highlighted while either is in view */
      ['#hero', ...navLinks.map((link) => link.href), '#opensource'].forEach((href) => {
        const el = document.getElementById(href.slice(1));
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

  const travel = (href) => {
    const id = href.slice(1);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lock.current = id;
    lockTimer.current = setTimeout(release, LOCK_TIMEOUT);
    current.current = id;
    setActiveSection(id);
    if (scrollToHash(href)) return true;
    revealSection(href);
    return false;
  };

  /* desktop links: the underline jumps to the target at once; the spy stays
     locked until the travel reports done. When scrollToHash declines
     (reduced motion, missing target) the native anchor runs. */
  const handleLinkClick = (e, href) => {
    if (travel(href)) e.preventDefault();
  };

  const handleMobileClick = (e, href) => {
    e.preventDefault();
    pending.current = href;
    setIsOpen(false);
  };

  const onMenuClosed = () => {
    const href = pending.current;
    pending.current = null;
    if (!href) return;
    requestAnimationFrame(() => {
      if (!travel(href)) {
        const el = document.getElementById(href.slice(1));
        if (el) el.scrollIntoView();
        try {
          window.history.pushState(window.history.state, '', href);
        } catch (err) {
          /* ignore */
        }
      }
    });
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
        scrolled
          ? 'border-border bg-surface/90 backdrop-blur-xl backdrop-saturate-[1.8]'
          : 'border-transparent bg-surface/0'
      )}
    >
      <nav aria-label="Main Navigation" className="container-page flex h-14 items-center justify-between gap-4">
        <a
          href="#hero"
          className="flex min-h-11 items-center text-[17px] font-semibold tracking-[-0.02em]"
          aria-label={`AMK. — ${RESUME.name}`}
          onClick={(e) => handleLinkClick(e, '#hero')}
        >
          AMK
          <span className="ml-0.5 inline-block size-2 rounded-full bg-primary shadow-[0_0_12px_rgb(var(--glow)/0.8)]" />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group relative rounded-full px-3 py-2 text-[13px] transition-colors duration-200',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.name}
                {/* hover underline for idle links; the active one carries the travelling bar */}
                {!isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-foreground/40 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                )}
                {/* MotionConfig (reducedMotion="user") makes the travel instant
                    under reduced motion, so the same element renders on server
                    and client */}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-primary shadow-[0_0_10px_rgb(var(--glow)/0.7)]"
                    transition={underlineSpring}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Magnetic className="hidden sm:inline-flex" strength={0.25} max={5}>
            <Button asChild size="sm" className="h-10">
              <a
                href={RESUME.resumePath}
                download={RESUME.resumeDownloadName}
                onClick={() => trackResumeDownload('navbar')}
                aria-label="Download Resume PDF"
              >
                <Download className="size-3.5" aria-hidden="true" />
                Resume
              </a>
            </Button>
          </Magnetic>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="glass" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <Menu />
              </Button>
            </DialogTrigger>
            <DialogContent
              id="mobile-menu"
              closeLabel="Close navigation menu"
              onCloseAutoFocus={onMenuClosed}
              className="top-0 left-0 flex h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-surface/95 px-6 pt-20 pb-10 shadow-none backdrop-blur-2xl data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 sm:max-w-none sm:px-8"
            >
              <DialogTitle className="sr-only">Navigation</DialogTitle>
              <DialogDescription className="sr-only">Jump to a section of the page.</DialogDescription>
              <motion.nav
                aria-label="Mobile Navigation"
                className="flex flex-col"
                variants={listVariants}
                initial={prefersReducedMotion ? false : 'closed'}
                animate="open"
              >
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.slice(1);
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      variants={linkVariants}
                      onClick={(e) => handleMobileClick(e, link.href)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'py-2 text-[28px] leading-tight font-semibold tracking-[-0.025em] transition-colors',
                        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.name}
                    </motion.a>
                  );
                })}
                <motion.div variants={linkVariants} className="pt-8">
                  <Button asChild size="lg" className="w-full">
                    <a
                      href={RESUME.resumePath}
                      download={RESUME.resumeDownloadName}
                      onClick={() => trackResumeDownload('mobile menu')}
                    >
                      <Download aria-hidden="true" />
                      Download Resume
                    </a>
                  </Button>
                </motion.div>
              </motion.nav>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </header>
  );
}
