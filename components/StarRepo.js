'use client';

import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Bookmark, GithubMark, Heart, Play, Repo, Star, TrendUp } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { IconTile } from './ui/icon-tile';
import { SpotlightCard } from './ui/aceternity/spotlight-card';
import { Reveal } from './fx/Reveal';
import { trackClick } from './fx/trackClick';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

const { path, description, language } = RESUME.starRepo;
const [owner, repoName] = path.split('/');
const REPO_URL = `https://github.com/${path}`;
const PROFILE_URL = `https://github.com/${owner}`;
const DEMO_URL = RESUME.projects.find((p) => p.github === REPO_URL)?.demo;
const CACHE_KEY = 'gh-counts';
const CACHE_FOR = 10 * 60 * 1000;

/* A small count reads as "nobody else cares", so live counts only show once
   they persuade; until then the proof below does that job. */
const SHOW_COUNTS_FROM = 25;
const persuasive = (n) => (n >= SHOW_COUNTS_FROM ? n : null);

/* proof that already persuades: the model's measured result, a demo anyone
   can try, and a repo that is visibly alive */
const PROOF = [
  { text: '0.94 AUC vs expert raters', Icon: BadgeCheck },
  { text: 'Free live demo', Icon: Play, href: DEMO_URL },
  { text: '100+ commits', Icon: Repo },
];

/* why a star is worth two seconds, in the visitor's terms first */
const REASONS = [
  { text: "It bookmarks Vocaly in your GitHub stars, so it's easy to find again.", Icon: Bookmark },
  { text: 'Stars help it surface in GitHub search and topic pages.', Icon: TrendUp },
  { text: 'It tells me people want it, so I keep building.', Icon: Heart },
];

/* 1234 -> 1.2k, the way GitHub prints its counts */
const short = (n) => (n < 1000 ? `${n}` : `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '')}k`);

/* Live star, fork and follower counts from GitHub's public API, fetched as
   the section comes near and kept for ten minutes of the visit. Offline or
   rate-limited, the numbers are simply left out. */
function useGithubCounts(ref) {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (saved && Date.now() - saved.at < CACHE_FOR) {
        setCounts(saved);
        return undefined;
      }
    } catch {
      /* storage blocked: fetch instead */
    }

    const controller = new AbortController();
    const get = (endpoint) =>
      fetch(`https://api.github.com/${endpoint}`, { signal: controller.signal }).then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(`GitHub API ${res.status}`))
      );

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        Promise.all([get(`repos/${path}`), get(`users/${owner}`)])
          .then(([repo, user]) => {
            const next = { stars: repo.stargazers_count, forks: repo.forks_count, followers: user.followers, at: Date.now() };
            setCounts(next);
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
            } catch {
              /* not cached; fetched again next visit */
            }
          })
          .catch(() => {});
      },
      { rootMargin: '800px 0px' }
    );
    io.observe(ref.current);

    return () => {
      io.disconnect();
      controller.abort();
    };
  }, [ref]);

  return counts;
}

/* GitHub-style count beside a button label, once there is one worth showing */
function Count({ value }) {
  if (value == null) return null;
  return (
    <span aria-hidden="true" className="min-w-6 rounded-full bg-current/10 px-2 py-0.5 text-[13px] leading-5 tabular-nums">
      {short(value)}
    </span>
  );
}

/* The star ask as a button: straight to the repo, where GitHub's own Star
   button sits at the top, and counted per placement so the asks can be
   compared. Shared by the Vocaly project card and this section. */
export function StarButton({ placement, variant = 'outline', size, shine = false, className, children }) {
  return (
    <Button asChild variant={variant} size={size} className={cn(shine && 'star-shine', className)}>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(`star-${placement}`)}
        aria-label={`Star ${repoName} on GitHub (opens in a new tab)`}
      >
        <Star aria-hidden="true" />
        Star on GitHub
        {children}
      </a>
    </Button>
  );
}

/* The closing ask, written the way the reader weighs it: what the star does
   for them and for the project, proof it is worth it, then one main action.
   Both actions live on GitHub (a visitor has to be signed in there). */
export function StarRepo() {
  const card = useRef(null);
  const counts = useGithubCounts(card);
  const stars = persuasive(counts?.stars);
  const followers = persuasive(counts?.followers);

  return (
    <section id="star" className="section-y" aria-labelledby="star-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Help <em>Vocaly</em> reach more learners
            </>
          }
          titleId="star-title"
          intro="Vocaly AI is free and open source. A star takes two seconds on GitHub, and it's how projects like this get found."
        />

        <Reveal>
          <SpotlightCard ref={card} borderGlow className="bg-card p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
              {/* the repo, laid out the way GitHub shows one */}
              <div className="min-w-0">
                <div className="flex items-start gap-4">
                  <IconTile size="md">
                    <img src="/assets/images/vocaly-mark.webp" alt="" width="96" height="96" className="size-7" loading="lazy" decoding="async" />
                  </IconTile>
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group min-w-0 font-mono text-[15px] leading-snug outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  >
                    <span className="block text-muted-foreground">{owner} /</span>
                    <span className="block font-semibold break-words text-foreground underline-offset-4 group-hover:underline">{repoName}</span>
                  </a>
                  <span className="ml-auto shrink-0 rounded-full border border-border-strong px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Public
                  </span>
                </div>

                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground md:text-base">{description}</p>

                <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-muted-foreground" aria-label="Repository details">
                  <li className="inline-flex items-center gap-2">
                    {/* GitHub's colour for Python */}
                    <span aria-hidden="true" className="size-3 rounded-full bg-[#3572a5]" />
                    {language}
                  </li>
                  {stars != null && (
                    <li className="inline-flex items-center gap-1.5">
                      <Star className="size-4" />
                      <span className="tabular-nums">{short(stars)}</span> stars
                    </li>
                  )}
                  {PROOF.map(({ text, Icon, href }) => (
                    <li key={text} className="inline-flex items-center gap-1.5">
                      <Icon className="size-4 text-link" />
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline text-foreground">
                          {text}
                        </a>
                      ) : (
                        <span className="text-foreground">{text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* why, then the ask: full width under a thumb, side by side on
                  a tablet, stacked beside the repo on a wide screen */}
              <div className="min-w-0 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14">
                <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">Why star it</h3>
                <ul className="mt-4 space-y-3">
                  {REASONS.map(({ text, Icon }) => (
                    <li key={text} className="flex gap-3 text-[15px] leading-snug">
                      <Icon className="mt-0.5 size-[18px] text-link" />
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
                  <Magnetic className="w-full sm:w-auto lg:w-full">
                    <StarButton placement="section" variant="default" size="lg" shine className="w-full px-5 sm:px-7">
                      <Count value={stars} />
                    </StarButton>
                  </Magnetic>
                  <Button asChild variant="outline" size="lg" className="w-full px-5 sm:w-auto sm:px-7 lg:w-full">
                    <a
                      href={PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick('follow-section')}
                      aria-label={`Follow @${owner} on GitHub (opens in a new tab)`}
                    >
                      <GithubMark aria-hidden="true" />
                      Follow on GitHub
                      <Count value={followers} />
                    </a>
                  </Button>
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">Takes two seconds if you&apos;re signed in to GitHub.</p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
