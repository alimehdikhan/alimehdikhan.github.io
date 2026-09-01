'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { trackResumeDownload } from './fx/trackDownload';
import { revealSection } from './fx/revealSection';
import { scrollToHash } from './fx/scrollTo';
import { Typewriter } from './fx/Typewriter';
import { LocalClock } from './fx/LocalClock';
import { SPRING } from './fx/motion';
import { RESUME } from '../data/resume';

const credibilityChips = [
  {
    label: 'Google Cloud Certified',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  },
  { label: 'Deloitte Certified' },
  { label: 'B.Tech CSE (2026)' },
];

const socials = [
  { href: RESUME.github, label: 'GitHub', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', invDark: true },
  { href: RESUME.linkedin, label: 'LinkedIn', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg' },
  { href: `mailto:${RESUME.email}`, label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

/* The hero owns almost no state now: the typewriter and clock are leaf
   components that write through refs, so this tree renders once and only
   re-renders when the scroll cue is dismissed. */
export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const roles = RESUME.roles;
  const [cueGone, setCueGone] = useState(false);

  /* headline parallax: the giant name drifts and fades as you scroll away.
     The scroll value is spring-smoothed so wheel steps become a glide; the
     viewport height is cached so nothing is read from layout per frame. */
  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, SPRING.scroll);
  const vh = useRef(1);
  useEffect(() => {
    const update = () => {
      vh.current = window.innerHeight || 1;
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);
  const nameY = useTransform(smooth, (v) => (prefersReducedMotion ? 0 : Math.min(v, vh.current) * 0.14));
  const nameOpacity = useTransform(smooth, (v) =>
    prefersReducedMotion ? 1 : Math.max(1 - (Math.min(v, vh.current) / vh.current) * 1.5, 0)
  );

  /* cursor cue: only dismiss once the curtain is up and the pointer has
     actually travelled — or on the first scroll / tap, when it is moot */
  useEffect(() => {
    let travel = 0;
    const off = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', dismiss);
    };
    const dismiss = () => {
      setCueGone(true);
      off();
    };
    const onMove = (e) => {
      if (!document.documentElement.classList.contains('is-loaded')) return;
      travel += Math.abs(e.movementX) + Math.abs(e.movementY);
      if (travel >= 40) dismiss();
    };
    const onScroll = () => {
      if (window.scrollY > 40) dismiss();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', dismiss, { passive: true });
    return off;
  }, []);

  const [first, ...rest] = RESUME.name.split(' ');
  const lineOne = `${first} ${rest.slice(0, -1).join(' ')}`.trim();
  const lineTwo = rest.slice(-1).join(' ');

  const goToProjects = (e) => {
    if (scrollToHash('#projects')) e.preventDefault();
    else revealSection('#projects');
  };

  return (
    <header id="hero" className="hero">
      <div className="hero-top">
        <span className="hero-badge eyebrow">
          <span className="dot" />
          Actively seeking entry-level opportunities
        </span>
        <span className="eyebrow">
          {RESUME.location} · <LocalClock timeZone="Asia/Kolkata" />
        </span>
      </div>

      <span className="hero-hi">Hi, I&apos;m</span>
      <motion.h1 style={{ y: nameY, opacity: nameOpacity }}>
        <span className="line">
          <i>{lineOne}</i>
        </span>
        <span className="line">
          <i>{lineTwo}</i>
        </span>
      </motion.h1>

      <div className="hero-grid">
        <div>
          <div className="hero-role hero-fade">
            {/* complete phrase for screen readers; the typewriter is decorative */}
            <span className="sr-only">I&apos;m a {roles.join(', ')}.</span>
            <span aria-hidden="true">
              I&apos;m a&nbsp;<Typewriter words={roles} />
              <span className="caret" />
            </span>
          </div>

          <p className="hero-sub hero-fade">
            Python and AI/ML developer building deployed APIs and applied machine-learning products. Created a Whisper-based pronunciation coach and medical-image classification projects.
          </p>

          <div className="hero-meta eyebrow hero-fade hero-fade-2">
            {credibilityChips.map((chip) => (
              <span key={chip.label}>
                {chip.logo ? (
                  <img
                    src={chip.logo}
                    alt=""
                    width="14"
                    height="14"
                    loading="lazy"
                    aria-hidden="true"
                    style={{ objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {chip.label}
              </span>
            ))}
          </div>

          <div className="hero-actions hero-fade hero-fade-2">
            <MagneticButton variant="primary" as="a" href="#projects" onClick={goToProjects} aria-label="View Projects">
              View Projects
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              as="a"
              href={RESUME.resumePath}
              download={RESUME.resumeDownloadName}
              onClick={() => trackResumeDownload('hero button')}
              aria-label="Download Resume PDF"
            >
              Download Resume
            </MagneticButton>
          </div>

          <div className="hero-socials hero-fade hero-fade-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tile"
                aria-label={social.label}
              >
                {social.img ? (
                  <img
                    className={`brand-logo${social.invDark ? ' inv-dark' : ''}`}
                    src={social.img}
                    alt=""
                    width="17"
                    height="17"
                    loading="lazy"
                    aria-hidden="true"
                  />
                ) : (
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.icon} />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        <figure className="portrait hero-fade hero-fade-2">
          <img
            src="/assets/images/profile.png"
            alt="Portrait of Ali Mehdi Khan, Software Engineer and AI/ML Developer"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={320}
            height={320}
          />
          <i className="corner" aria-hidden="true" />
        </figure>
      </div>

      <div className={`cue eyebrow${cueGone ? ' gone' : ''}`}>
        <span className="arrow">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M12 19l-6-6M12 19l6-6" />
          </svg>
        </span>
        <span className="cue-fine">Move your cursor — the background is a live simulation</span>
        <span className="cue-coarse">Tap and drag — the background is a live simulation</span>
      </div>
    </header>
  );
}
