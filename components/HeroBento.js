'use client';

import { ArrowUpRight, GitMerge, GithubMark } from '@/components/ui/icons';
import { LocalClock } from './fx/LocalClock';
import { revealSection } from './fx/revealSection';
import { scrollToHash } from './fx/scrollTo';
import { WORDS } from './VocalyShowcase';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

const NOW = RESUME.experience[0];
const VOCALY = RESUME.projects.find((p) => p.github === `https://github.com/${RESUME.starRepo.path}`);
const SLIP = WORDS.find((w) => w.slip);

/* one surface for every tile, the site's card; link tiles lift a little
   under a mouse and give under a press */
const TILE = 'hero-in relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft';
const LINK =
  'group outline-none transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-0.5 hover:border-border-strong focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.98] motion-reduce:transform-none';
const LABEL = 'text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase';

/* in-page tiles travel like the nav does; e.detail is 0 for Enter or Space */
const goTo = (hash) => (e) => {
  if (scrollToHash(hash, { keyboard: e.detail === 0 })) e.preventDefault();
  else revealSection(hash);
};

/* The hero's right half as a bento: the portrait is the largest tile and
   every tile round it is proof that links somewhere. What I do now, the
   best-known open-source project I've had a pull request merged into (read
   from GitHub at build time), my local time, and Vocaly at work. Tiles rise
   in with the rest of the hero in plain CSS (first paint, no waiting for
   JS); the only things that keep moving are the "now" dot and the clock.
   Phones: the portrait and two proof tiles side by side, then a time strip
   and Vocaly. */
export function HeroBento({ merged }) {
  return (
    <div className="mx-auto grid w-full max-w-[560px] grid-cols-2 gap-3 [grid-template-areas:'photo_now'_'photo_oss'_'time_time'_'vocaly_vocaly'] sm:grid-cols-5 sm:[grid-template-areas:'photo_photo_photo_now_now'_'photo_photo_photo_oss_oss'_'time_time_vocaly_vocaly_vocaly'] lg:max-w-none">
      {/* the portrait: the cutout on one soft light, a lime glow from the
          upper left, the shoulders running off the bottom edge. No caption:
          the name is the headline beside it. */}
      <figure
        style={{ '--i': 1 }}
        className={cn(
          TILE,
          'min-h-56 [grid-area:photo] sm:aspect-[4/5]',
          'bg-[radial-gradient(120%_85%_at_15%_0%,rgb(var(--glow)/0.4),transparent_58%),linear-gradient(180deg,#f1f2ec,#e3e5dc)]',
          'dark:bg-[radial-gradient(120%_85%_at_15%_0%,rgb(var(--glow)/0.3),transparent_58%),linear-gradient(180deg,#191c19,#0d0f0d)]'
        )}
      >
        <img
          src="/assets/images/profile-cutout-800.webp"
          srcSet="/assets/images/profile-cutout-480.webp 480w, /assets/images/profile-cutout-640.webp 640w, /assets/images/profile-cutout-800.webp 800w"
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 360px, 50vw"
          alt="Portrait of Ali Mehdi Khan, Software Engineer and AI/ML Developer"
          width={800}
          height={800}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          /* phones: sized by the tile's height, as the tiles beside it set
             that; from sm the tile is 4:5 and the photo is sized by width */
          className="absolute bottom-0 left-1/2 h-[84%] w-auto max-w-none -translate-x-1/2 sm:h-auto sm:w-[124%]"
        />
      </figure>

      {/* now: the current job, the one lime accent in the grid */}
      <a href="#experience" onClick={goTo('#experience')} style={{ '--i': 2 }} className={cn(TILE, LINK, 'flex flex-col justify-between gap-3 p-4 [grid-area:now] sm:p-5')}>
        <span className={cn(LABEL, 'inline-flex items-center gap-2')}>
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Now
        </span>
        <span className="block">
          <span className="block text-[15px] leading-snug font-semibold tracking-[-0.015em] sm:text-lg">{NOW.role.split(',')[0]}</span>
          {NOW.role.includes(',') && <span className="mt-0.5 block text-[13px] text-muted-foreground">{NOW.role.split(',').slice(1).join(',').trim()}</span>}
        </span>
        {NOW.logo ? (
          <span className="inline-flex h-8 w-fit items-center rounded-xl bg-[#0b0b0b] px-3 ring-1 ring-white/10">
            <img src={NOW.logo.src} alt={NOW.company.split(' · ')[0]} width={NOW.logo.width} height={NOW.logo.height} className="h-4 w-auto" />
          </span>
        ) : (
          <span className="text-[13px] text-muted-foreground">{NOW.company}</span>
        )}
      </a>

      {/* open source: the project's stars carry the proof; falls back to the
          profile when GitHub couldn't be read at build time */}
      {merged ? (
        <a
          href={merged.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open source contribution: a pull request merged into ${merged.name}, ${merged.stars} stars (opens in a new tab)`}
          style={{ '--i': 3 }}
          className={cn(TILE, LINK, 'flex flex-col justify-between gap-3 p-4 [grid-area:oss] sm:p-5')}
        >
          <span className={cn(LABEL, 'flex items-start gap-1.5')}>
            <GitMerge className="size-3.5 shrink-0" />
            Open source contribution
          </span>
          <span className="block text-[28px] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[32px]">
            ★ {merged.stars}
          </span>
          <span className="flex items-end justify-between gap-2 text-[13px] leading-snug text-muted-foreground">
            <span>
              Merged into <span className="font-medium whitespace-nowrap text-foreground">{merged.name}</span>
            </span>
            <ArrowUpRight className="size-3.5 shrink-0" />
          </span>
        </a>
      ) : (
        <a
          href={RESUME.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ '--i': 3 }}
          className={cn(TILE, LINK, 'flex flex-col justify-between gap-3 p-4 [grid-area:oss] sm:p-5')}
        >
          <span className={cn(LABEL, 'inline-flex items-center gap-1.5')}>
            <GithubMark className="size-3.5" />
            GitHub
          </span>
          <span className="block text-[28px] leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[32px]">
            {RESUME.githubStats.publicRepos}
          </span>
          <span className="flex items-end justify-between gap-2 text-[13px] text-muted-foreground">
            Public repositories
            <ArrowUpRight className="size-3.5 shrink-0" />
          </span>
        </a>
      )}

      {/* local time: is it a sensible hour to write or call? */}
      <a
        href="#contact"
        onClick={goTo('#contact')}
        style={{ '--i': 4 }}
        className={cn(TILE, LINK, 'flex items-center justify-between gap-3 px-4 py-3 [grid-area:time] sm:flex-col sm:items-start sm:justify-between sm:p-5')}
      >
        <span className={cn(LABEL, 'hidden sm:block')}>Local time</span>
        <span className="text-2xl leading-none font-semibold tracking-[-0.04em] tabular-nums sm:text-[32px]">
          <LocalClock timeZone="Asia/Kolkata" />
        </span>
        <span className="text-[13px] text-muted-foreground">Lucknow · IST</span>
      </a>

      {/* Vocaly at work: the README's demo sentence, its slip flagged */}
      {VOCALY && (
        <a
          href={VOCALY.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${VOCALY.title}, live demo: it marks each sound you mispronounce (opens in a new tab)`}
          style={{ '--i': 5 }}
          className={cn(TILE, LINK, 'flex flex-col justify-between gap-3 border-white/10 bg-[linear-gradient(160deg,#121733,#07080f_72%)] p-4 text-white [grid-area:vocaly] sm:p-5')}
        >
          <span className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <img src="/assets/images/vocaly-mark.webp" alt="" width="96" height="96" className="size-5" />
              {VOCALY.title}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-[#8cc2ff] uppercase">
              <span className="size-1.5 rounded-full bg-[#8cc2ff] shadow-[0_0_8px_#8cc2ff]" />
              Live
              <ArrowUpRight className="size-3.5 text-white/60" />
            </span>
          </span>
          <span aria-hidden="true" className="flex flex-wrap gap-x-1.5 gap-y-1 text-[15px] leading-tight font-medium sm:text-base">
            {WORDS.map((w, k) => (
              <span
                key={w.word}
                style={{ '--i': 6 + k * 0.6 }}
                className={cn('hero-in', w.slip && 'text-[#f9cf7f] underline decoration-[#f5b544] decoration-dotted decoration-2 underline-offset-4')}
              >
                {w.word}
              </span>
            ))}
          </span>
          {SLIP && (
            <span aria-hidden="true" style={{ '--i': 11 }} className="hero-in inline-flex w-fit items-center gap-2 rounded-lg bg-[#f5b544]/15 px-2 py-1 font-mono text-[12px] text-[#f9cf7f]">
              /{SLIP.sounds[SLIP.slip.at]}/ heard as /{SLIP.slip.heard}/
            </span>
          )}
        </a>
      )}
    </div>
  );
}
