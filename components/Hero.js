'use client';

import { Fragment, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, BadgeCheck, Download, GitMerge, GithubMark, GraduationCap, LinkedinMark, Mail, Star } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { HeroPortrait } from './HeroPortrait';
import { trackResumeDownload } from './fx/trackDownload';
import { trackClick } from './fx/trackClick';
import { revealSection } from './fx/revealSection';
import { scrollToHash } from './fx/scrollTo';
import { Typewriter } from './fx/Typewriter';
import { LocalClock } from './fx/LocalClock';
import { RESUME } from '../data/resume';

/* each credential leads with an icon: the real Google Cloud mark where one
   exists, a duotone seal or cap otherwise */
const credibilityChips = [
  { label: 'Google Cloud skill badges', logo: '/assets/icons/tech/googlecloud.svg' },
  { label: 'Deloitte job simulation', Icon: BadgeCheck },
  { label: 'B.Tech CSE, 2026', Icon: GraduationCap },
];

const socials = [
  { href: RESUME.github, label: 'GitHub', Icon: GithubMark },
  { href: RESUME.linkedin, label: 'LinkedIn', Icon: LinkedinMark },
  { href: `mailto:${RESUME.email}`, label: 'Email', Icon: Mail },
];

/* the open-source repo the hero's announcement pill asks visitors to star */
const STAR_URL = `https://github.com/${RESUME.starRepo.path}`;

/* "an AI/ML Engineer", "a Software Engineer" */
const articleFor = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a');


/* `merged`: the best-known open-source project with a merged pull request
   of mine, read from GitHub when the site is built (lib/github.js) */
export function Hero({ merged }) {
  const roles = RESUME.roles;
  /* the typewriter swaps the article as each role starts, in place */
  const article = useRef(null);

  const [first, ...rest] = RESUME.name.split(' ');
  const lineOne = `${first} ${rest.slice(0, -1).join(' ')}`.trim();
  const lineTwo = rest.slice(-1).join(' ');

  /* the looping decoration (floating badges, caret) rests offscreen */
  useEffect(() => {
    const hero = document.getElementById('hero');
    const io = new IntersectionObserver(([entry]) => hero.classList.toggle('is-offscreen', !entry.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  /* e.detail is 0 when Enter or Space fired the click */
  const goTo = (hash) => (e) => {
    if (scrollToHash(hash, { keyboard: e.detail === 0 })) e.preventDefault();
    else revealSection(hash);
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex items-center overflow-hidden bg-surface pt-24 pb-12 md:pt-32 md:pb-20 lg:min-h-[min(100svh,960px)]"
    >

      <div className="container-page relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col items-start">
          {/* announcement: straight to the repo, where the Star button is */}
          <a
            href={STAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vocaly AI is open source: star it on GitHub (opens in a new tab)"
            onClick={() => trackClick('star-hero')}
            style={{ '--i': 0 }}
            className="hero-in star-shine mb-5 inline-flex max-w-full items-center gap-2.5 rounded-full border border-border-strong bg-secondary py-1 pr-3.5 pl-1 text-[13px] font-medium transition-[border-color,transform] duration-200 [--shine:rgb(var(--glow)/0.22)] hover:border-link/50 active:scale-[0.98] motion-reduce:active:scale-100"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground [--icon-accent:currentColor] [--icon-accent-opacity:0.25]">
              <Star className="size-4" />
            </span>
            {/* the why leads where there's room for it; the ask always fits */}
            <span className="truncate">
              <span className="hidden text-muted-foreground min-[390px]:inline">Open source · </span>
              Star <span className="text-link">Vocaly AI</span> on GitHub
            </span>
            <ArrowUpRight className="size-3.5 text-muted-foreground" />
          </a>

          <div style={{ '--i': 0 }} className="hero-in mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2 font-medium">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgb(var(--glow)/0.8)]" aria-hidden="true" />
              Open to entry-level AI and software roles
            </span>
            <span className="text-muted-foreground">
              {RESUME.location} · <LocalClock timeZone="Asia/Kolkata" />
            </span>
          </div>

          <p style={{ '--i': 1 }} className="hero-in mb-2 text-xl font-medium text-muted-foreground md:text-2xl">Hi, I&apos;m</p>
          {/* each word rises inside its own clipped line box */}
          <h1 id="hero-title" className="text-[clamp(3rem,7.4vw,5.5rem)] leading-[1.02] tracking-[-0.035em]">
            {lineOne.split(' ').map((word, i) => (
              <Fragment key={word}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                  <span className="hero-word inline-block" style={{ '--i': i }}>
                    {word}
                  </span>
                </span>{' '}
              </Fragment>
            ))}
            <span className="inline-block overflow-hidden pr-[0.06em] pb-[0.08em] align-top">
              <em className="hero-word inline-block" style={{ '--i': lineOne.split(' ').length }}>
                {lineTwo}
              </em>
            </span>
          </h1>

          <div style={{ '--i': 2 }} className="hero-in mt-4 text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug font-semibold tracking-[-0.02em]">
            {/* complete phrase for screen readers; the typewriter is decorative */}
            <span className="sr-only">I&apos;m a {roles.join(', ')}.</span>
            <span aria-hidden="true" className="inline-flex items-baseline">
              <span className="text-muted-foreground">
                I&apos;m <span ref={article}>{articleFor(roles[0])}</span>&nbsp;
              </span>
              <span className="[&_b]:font-semibold [&_b]:text-link">
                <Typewriter
                  words={roles}
                  onWord={(word) => {
                    if (article.current) article.current.textContent = articleFor(word);
                  }}
                />
              </span>
              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] animate-pulse bg-primary motion-reduce:animate-none" />
            </span>
          </div>

          <p style={{ '--i': 3 }} className="hero-in mt-6 max-w-[52ch] text-muted-foreground md:text-lg">
            I build AI products end to end: the model, the Python API that serves it, and the app people use. My latest, Vocaly AI, marks every sound you mispronounce in English and shows you how to fix it.
          </p>

          <ul style={{ '--i': 4 }} className="hero-in mt-6 flex flex-wrap gap-2" aria-label="Credentials">
            {credibilityChips.map((chip) => (
              <li key={chip.label} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-[13px] font-medium">
                {chip.logo ? (
                  <img src={chip.logo} alt="" width="14" height="14" aria-hidden="true" className="size-3.5 object-contain" />
                ) : (
                  <chip.Icon className="size-4" />
                )}
                {chip.label}
              </li>
            ))}
            {merged && (
              <li>
                <a
                  href={merged.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-[13px] font-medium transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.97] motion-reduce:active:scale-100"
                >
                  <GitMerge className="size-4" />
                  Merged PR in {merged.name}
                  <span className="text-muted-foreground tabular-nums">★ {merged.stars}</span>
                </a>
              </li>
            )}
          </ul>

          <div style={{ '--i': 5 }} className="hero-in mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button asChild>
                <a href="#projects" onClick={goTo('#projects')} aria-label="View Projects">
                  View Projects
                  <ArrowDown aria-hidden="true" />
                </a>
              </Button>
            </Magnetic>
            <Button asChild variant="outline">
              <a
                href={RESUME.resumePath}
                download={RESUME.resumeDownloadName}
                onClick={() => trackResumeDownload('hero button')}
                aria-label="Download Resume PDF"
              >
                <Download aria-hidden="true" />
                Download Resume
              </a>
            </Button>
          </div>

          <div style={{ '--i': 6 }} className="hero-in mt-8 flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => {
              /* mail links open the mail app in place; profiles open a new tab */
              const external = !href.startsWith('mailto:');
              return (
                <Button key={label} asChild variant="glass" size="icon">
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="hero-portrait relative">
          <HeroPortrait />
        </div>
      </div>

      <a
        href="#about"
        onClick={goTo('#about')}
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 hidden size-10 -translate-x-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground lg:grid"
      >
        <ArrowDown className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
