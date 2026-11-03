'use client';

import { useEffect, useRef, useState } from 'react';
import { GitFork, GithubMark, Star } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { IconTile } from './ui/icon-tile';
import { SpotlightCard } from './ui/aceternity/spotlight-card';
import { Reveal } from './fx/Reveal';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

const { path, description, language } = RESUME.starRepo;
const [owner, repoName] = path.split('/');
const REPO_URL = `https://github.com/${path}`;
const PROFILE_URL = `https://github.com/${owner}`;
const CACHE_KEY = 'gh-counts';
const CACHE_FOR = 10 * 60 * 1000;

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

/* GitHub-style count beside a button label; it holds its width until the
   number arrives so the label never jumps */
function Count({ value }) {
  return (
    <span
      aria-hidden="true"
      className={cn('min-w-6 rounded-full bg-current/10 px-2 py-0.5 text-[13px] leading-5 tabular-nums', value == null && 'invisible')}
    >
      {value == null ? '0' : short(value)}
    </span>
  );
}

/* Ask for a star on Vocaly AI and a follow on GitHub. Both actions live on
   GitHub (a visitor has to be signed in there), so the buttons go straight
   to the repo and the profile, with the live counts GitHub's own buttons show. */
export function StarRepo() {
  const card = useRef(null);
  const counts = useGithubCounts(card);

  return (
    <section id="star" className="section-y" aria-labelledby="star-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Star <em>Vocaly</em> on GitHub
            </>
          }
          titleId="star-title"
          intro="Vocaly AI is open source. A star helps more English learners find it, and following me on GitHub is the easiest way to see what I build next."
        />

        <Reveal>
          <SpotlightCard ref={card} borderGlow className="bg-card p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-14">
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

                <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Repository details">
                  <li className="inline-flex items-center gap-2">
                    {/* GitHub's colour for Python */}
                    <span aria-hidden="true" className="size-3 rounded-full bg-[#3572a5]" />
                    {language}
                  </li>
                  {counts && (
                    <li className="inline-flex items-center gap-1.5">
                      <Star className="size-4" />
                      <span className="tabular-nums">{short(counts.stars)}</span> {counts.stars === 1 ? 'star' : 'stars'}
                    </li>
                  )}
                  {counts?.forks > 0 && (
                    <li className="inline-flex items-center gap-1.5">
                      <GitFork className="size-4" />
                      <span className="tabular-nums">{short(counts.forks)}</span> {counts.forks === 1 ? 'fork' : 'forks'}
                    </li>
                  )}
                </ul>
              </div>

              {/* the two asks: full width under a thumb, side by side on a
                  tablet, stacked again beside the repo on a wide screen */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
                <Magnetic className="w-full sm:w-auto lg:w-full">
                  <Button asChild size="lg" className="star-shine w-full px-5 sm:px-7">
                    <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label={`Star ${repoName} on GitHub (opens in a new tab)`}>
                      <Star aria-hidden="true" />
                      Star on GitHub
                      <Count value={counts?.stars} />
                    </a>
                  </Button>
                </Magnetic>
                <Button asChild variant="outline" size="lg" className="w-full px-5 sm:w-auto sm:px-7 lg:w-full">
                  <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label={`Follow @${owner} on GitHub (opens in a new tab)`}>
                    <GithubMark aria-hidden="true" />
                    Follow on GitHub
                    <Count value={counts?.followers} />
                  </a>
                </Button>
                <p className="text-[13px] text-muted-foreground sm:w-full">Both open GitHub, where you&apos;ll need to be signed in.</p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
