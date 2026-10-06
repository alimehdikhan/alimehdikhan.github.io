'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useReduce } from './fx/useReduce';
import { ArrowUp, ArrowUpRight, Download, GithubMark, LinkedinMark, Mail } from '@/components/ui/icons';
import { IconTile } from './ui/icon-tile';
import { MaskReveal } from './fx/MaskReveal';
import { trackResumeDownload } from './fx/trackDownload';
import { scrollToHash } from './fx/scrollTo';
import { LocalClock } from './fx/LocalClock';
import { RESUME } from '../data/resume';

const EASE = [0.16, 1, 0.3, 1];

/* the A monogram from the favicon, as a self-contained mark */
function Monogram({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ft-face" cx=".25" cy=".15" r="1.1">
          <stop offset="0" stopColor="#232820" />
          <stop offset="1" stopColor="#090a0a" />
        </radialGradient>
        <linearGradient id="ft-lime" x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#eefba9" />
          <stop offset="1" stopColor="#c2e84a" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#ft-face)" />
      <rect x=".75" y=".75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="#fff" strokeOpacity=".14" />
      <path d="M17 47 32 15l15 32M23.5 36.5h17" fill="none" stroke="url(#ft-lime)" strokeWidth="6.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50.5" cy="46" r="3.6" fill="url(#ft-lime)" />
    </svg>
  );
}

/* A link pill: a glass tile with the icon, the label, and an arrow that
   slides in on hover. The tile's lime bloom wakes with the pill. */
function FooterLink({ icon, label, ...props }) {
  return (
    <a
      className="group/pill flex items-center gap-3 rounded-full border border-border bg-card/40 py-1.5 pr-4 pl-1.5 text-[15px] font-medium transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-link/40 hover:bg-card motion-reduce:hover:translate-y-0"
      {...props}
    >
      <IconTile icon={icon} size="sm" className="size-9 rounded-full" />
      <span className="flex-1">{label}</span>
      <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,transform] duration-300 group-hover/pill:translate-x-0 group-hover/pill:opacity-100" />
    </a>
  );
}

/* Back to top, wrapped in a ring that fills as you read down the page. */
function BackToTop({ onClick }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  return (
    <a
      href="#hero"
      aria-label="Back to Top"
      onClick={onClick}
      className="group/top relative grid size-14 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r="26" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
        <motion.circle
          cx="28"
          cy="28"
          r="26"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: reduce ? scrollYProgress : progress }}
        />
      </svg>
      <span className="icon-tile size-10 rounded-full text-link transition-transform duration-300 group-hover/top:-translate-y-0.5 motion-reduce:group-hover/top:translate-y-0">
        <ArrowUp className="size-5" />
      </span>
    </a>
  );
}

export function Footer() {
  const root = useRef(null);
  const word = useRef(null);
  const reduce = useReduce();

  const toTop = (e) => {
    if (scrollToHash('#hero')) e.preventDefault();
  };

  /* the wordmark lights up in lime where the cursor is, and eases back out
     when it leaves. Mouse only; a still, faint wordmark otherwise. */
  useEffect(() => {
    const el = root.current;
    const target = word.current;
    if (!el || !target) return undefined;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const set = (x, y, a) => {
      target.style.setProperty('--mx', `${x}px`);
      target.style.setProperty('--my', `${y}px`);
      target.style.setProperty('--ma', a);
    };
    const onMove = (e) => {
      if (!fine.matches || reduced.matches || e.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = target.getBoundingClientRect();
        set(e.clientX - r.left, e.clientY - r.top, 1);
      });
    };
    const onLeave = () => set(-999, -999, 0);
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <footer ref={root} className="relative isolate overflow-hidden pt-10 pb-10 md:pt-16">
      {/* lime aurora rising from the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(var(--glow)/0.14),transparent)]"
      />

      <div className="container-page">
        {/* the top edge: a hairline with a lime beam that sweeps across once */}
        <div className="relative mb-12 h-px bg-border-strong md:mb-16">
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 h-px w-1/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] shadow-[0_0_16px_rgb(var(--glow)/0.9)]"
              initial={{ x: '-100%', opacity: 0 }}
              whileInView={{ x: '300%', opacity: [0, 1, 1, 0] }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 2.2, ease: EASE }}
            />
          )}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <Monogram className="size-12 shrink-0 drop-shadow-[0_8px_18px_rgb(var(--glow)/0.25)]" />
              <div>
                <p className="text-lg leading-tight font-semibold tracking-[-0.02em]">{RESUME.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{RESUME.roles.join(' · ')}</p>
              </div>
            </div>
            <p className="mt-6 inline-flex items-center gap-2.5 text-sm font-medium">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Available for entry-level roles
            </p>
          </div>

          <nav aria-label="Footer" className="grid gap-3 sm:grid-cols-2">
            <FooterLink
              icon={Download}
              label="Resume"
              href={RESUME.resumePath}
              download={RESUME.resumeDownloadName}
              onClick={() => trackResumeDownload('footer')}
              aria-label="Download Resume"
            />
            <FooterLink icon={GithubMark} label="GitHub" href={RESUME.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" />
            <FooterLink icon={LinkedinMark} label="LinkedIn" href={RESUME.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" />
            <FooterLink icon={Mail} label="Email" href={`mailto:${RESUME.email}`} aria-label="Email" />
          </nav>
        </div>

        {/* the wordmark: a faint, fading giant name that glows lime under the cursor */}
        <div aria-hidden="true" className="mt-14 select-none [container-type:inline-size] md:mt-20">
          <MaskReveal>
            <p
              ref={word}
              className="footer-word text-center text-[clamp(2.5rem,15.4cqw,14rem)] leading-[0.95] font-semibold tracking-[-0.045em] whitespace-nowrap"
            >
              {RESUME.name}
            </p>
          </MaskReveal>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-border pt-6 text-[13px] text-muted-foreground">
          <span>© 2026 {RESUME.name}</span>
          <span className="tabular-nums">
            Lucknow · <LocalClock timeZone="Asia/Kolkata" />
          </span>
          <span className="ml-auto flex items-center gap-3">
            <span aria-hidden="true" className="hidden sm:inline">Back to Top</span>
            <BackToTop onClick={toTop} />
          </span>
        </div>
      </div>
    </footer>
  );
}
