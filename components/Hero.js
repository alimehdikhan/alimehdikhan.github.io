'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { trackResumeDownload } from './fx/trackDownload';
import { revealSection } from './fx/revealSection';
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

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const h1Ref = useRef(null);

  const roles = RESUME.roles;
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [clock, setClock] = useState('—');
  const [cueGone, setCueGone] = useState(false);
  const [coarse, setCoarse] = useState(false);

  /* typewriter (existing behaviour, restyled) */
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

    /* fast type/delete, long hold on the complete word — so the line reads
       as a finished phrase most of the time */
    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(currentRole.substring(0, currentText.length + 1));
        setTypingSpeed(55);

        if (currentText === currentRole) {
          setIsDeleting(true);
          setTypingSpeed(3200);
        }
      } else {
        setCurrentText(currentRole.substring(0, currentText.length - 1));
        setTypingSpeed(28);

        if (currentText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(300);
        }
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, typingSpeed, prefersReducedMotion, roles]);

  /* local time (Lucknow · IST) */
  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    tick();
    const iv = setInterval(tick, 20000);
    return () => clearInterval(iv);
  }, []);

  /* headline parallax: the giant name drifts and fades as you scroll away */
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = h1Ref.current;
        if (!el) return;
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.transform = `translateY(${(y * 0.18).toFixed(1)}px)`;
        el.style.opacity = String(Math.max(1 - (y / window.innerHeight) * 1.1, 0));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  /* cursor cue: dismiss on first pointer move */
  useEffect(() => {
    setCoarse(window.matchMedia('(pointer: coarse)').matches);
    const once = () => {
      setCueGone(true);
      window.removeEventListener('pointermove', once);
    };
    window.addEventListener('pointermove', once, { passive: true });
    return () => window.removeEventListener('pointermove', once);
  }, []);

  const [first, ...rest] = RESUME.name.split(' ');
  const lineOne = `${first} ${rest.slice(0, -1).join(' ')}`.trim();
  const lineTwo = rest.slice(-1).join(' ');

  return (
    <header id="hero" className="hero">
      <div className="hero-top">
        <span className="hero-badge eyebrow">
          <span className="dot" />
          Actively seeking entry-level opportunities
        </span>
        <span className="eyebrow">
          {RESUME.location} · <span suppressHydrationWarning>{clock}</span>
        </span>
      </div>

      <span className="hero-hi">Hi, I&apos;m</span>
      <h1 ref={h1Ref}>
        <span className="line">
          <i>{lineOne}</i>
        </span>
        <span className="line">
          <i>{lineTwo}</i>
        </span>
      </h1>

      <div className="hero-grid">
        <div>
          <div className="hero-role hero-fade">
            {/* complete phrase for screen readers; the typewriter is decorative */}
            <span className="sr-only">I&apos;m a {roles.join(', ')}.</span>
            <span aria-hidden="true">
              I&apos;m a&nbsp;<b>{currentText}</b>
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
            <MagneticButton
              variant="primary"
              as="a"
              href="#projects"
              onClick={() => revealSection('#projects')}
              aria-label="View Projects"
            >
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
        {coarse
          ? 'Tap and drag — the background is a live simulation'
          : 'Move your cursor — the background is a live simulation'}
      </div>
    </header>
  );
}
