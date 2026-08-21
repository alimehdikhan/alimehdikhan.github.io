'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { smoothScrollTo } from './Navbar';
import { trackResumeDownload } from './fx/trackDownload';
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
  { href: RESUME.github, icon: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z', label: 'GitHub' },
  { href: RESUME.linkedin, icon: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z', label: 'LinkedIn' },
  { href: `mailto:${RESUME.email}`, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', stroke: true },
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

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(currentRole.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === currentRole) {
          setIsDeleting(true);
          setTypingSpeed(2000);
        }
      } else {
        setCurrentText(currentRole.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(500);
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

  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      smoothScrollTo(el.offsetTop - 80, 850);
    }
  };

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
          <div className="hero-role hero-fade" aria-live="polite">
            I&apos;m a&nbsp;<b>{currentText}</b>
            <span className="caret" aria-hidden="true" />
          </div>

          <p className="hero-sub hero-fade">{RESUME.summary}</p>

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
            <MagneticButton variant="primary" as="a" href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')} aria-label="View Projects">
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
            <MagneticButton variant="secondary" as="a" href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} aria-label="Contact Me">
              Contact Me
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
                <svg
                  width="17"
                  height="17"
                  fill={social.stroke ? 'none' : 'currentColor'}
                  stroke={social.stroke ? 'currentColor' : 'none'}
                  strokeWidth={social.stroke ? '2' : '0'}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={social.icon} />
                </svg>
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
