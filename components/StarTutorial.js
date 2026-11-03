'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'motion/react';
import { ArrowUpRight, Bell, GitFork, GithubMark, Lock, Pause, Play, RotateCcw, Star, StarFill } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Reveal } from './fx/Reveal';
import { EASE, EASE_FADE } from './fx/motion';
import { useReduce } from './fx/useReduce';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

const [, repoName] = RESUME.starRepo.path.split('/');
const SITE = RESUME.portfolio.replace(/^https?:\/\//, '');
const REPO = `github.com/${RESUME.starRepo.path}`;

/* "Tap" under a finger, "Click" with a mouse */
function Press({ upper = false }) {
  return (
    <>
      <span className="pointer-coarse:hidden">{upper ? 'Click' : 'click'}</span>
      <span className="hidden pointer-coarse:inline">{upper ? 'Tap' : 'tap'}</span>
    </>
  );
}

/* The steps, each with the address the demo shows and how long it holds.
   The GitHub details are its real layout: under 768px the star is a small
   unlabelled square beside Fork, just under the repo name; from 768px it
   says "Star" at the top right. Signed out, pressing it asks for sign-in
   and then lands back on the repo. #e3b341 is GitHub's starred yellow. */
const STEPS = [
  {
    url: SITE,
    ms: 2400,
    title: 'Open Vocaly on GitHub',
    text: (
      <>
        <span className="font-medium text-foreground">Star on GitHub</span> opens its page in a new tab.
      </>
    ),
  },
  {
    url: REPO,
    ms: 2600,
    title: (
      <>
        <Press upper /> the star next to Fork
      </>
    ),
    text: (
      <>
        <span className="md:hidden">
          It&apos;s the small <Star className="inline-block size-3.5 align-[-2px] [--icon-accent-opacity:0]" />
          <span className="sr-only">star</span> button just under the repo name.
        </span>
        <span className="hidden md:inline">It&apos;s at the top right of the page and says Star.</span>
      </>
    ),
  },
  {
    url: 'github.com/login',
    ms: 2600,
    title: 'Sign in, if GitHub asks',
    text: (
      <>
        No account? Signing up is free. Back on the repo, <Press /> the star once more.
      </>
    ),
  },
  {
    url: REPO,
    ms: 3400,
    title: (
      <>
        The star turns yellow <StarFill className="inline-block size-4 align-[-3px] text-[#e3b341]" />
      </>
    ),
    text: (
      <>
        <span className="hidden md:inline">It now says Starred, and </span>
        <span className="md:hidden">That means </span>Vocaly is saved in your stars. Thank you!
      </>
    ),
  },
];

/* a control giving way under a press at `at` seconds */
const pressAt = (at) =>
  at == null
    ? {}
    : {
        animate: { scale: [1, 1, 0.92, 1] },
        transition: { delay: at, duration: 0.7, times: [0, 0.4, 0.55, 1], ease: 'easeOut' },
      };

/* a fingertip: lands on the control at `at` seconds, presses, ripples */
function Tap({ at }) {
  return (
    <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <motion.span
        className="col-start-1 row-start-1 size-7 rounded-full border-2 border-white/90 bg-black/25 shadow-[0_2px_10px_rgb(0_0_0/0.35)]"
        initial={{ opacity: 0, scale: 1.6 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [1.6, 1, 0.8, 1] }}
        transition={{ delay: at, duration: 0.9, times: [0, 0.3, 0.45, 1], ease: 'easeOut' }}
      />
      <motion.span
        className="col-start-1 row-start-1 size-7 rounded-full border-2 border-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0], scale: [1, 1, 2.6] }}
        transition={{ delay: at + 0.4, duration: 0.6, times: [0, 0.1, 1], ease: 'easeOut' }}
      />
    </span>
  );
}

/* six specks thrown off the star as it fills */
function Sparks() {
  return [0, 60, 120, 180, 240, 300].map((deg) => (
    <motion.i
      key={deg}
      className="absolute top-1/2 left-1/2 -mt-0.5 -ml-0.5 size-1 rounded-full bg-[#e3b341]"
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 1, 0], x: Math.cos((deg * Math.PI) / 180) * 13, y: Math.sin((deg * Math.PI) / 180) * 13 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  ));
}

/* this page's own button, pressed */
function SiteScene() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="display max-w-[16rem] text-base leading-tight font-semibold tracking-[-0.02em]">
        Help <em>Vocaly</em> reach more learners
      </p>
      <motion.span
        {...pressAt(0.75)}
        className="relative inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground [--icon-accent-opacity:0.25] [--icon-accent:currentColor]"
      >
        <Star className="size-4" />
        Star on GitHub
        <Tap at={0.75} />
      </motion.span>
      <motion.span
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.3, ease: EASE_FADE }}
      >
        Opens in a new tab <ArrowUpRight className="size-3" />
      </motion.span>
    </div>
  );
}

function GhButton({ icon: Icon, children }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-[6px] border border-border-strong bg-secondary/70 px-2 font-medium">
      <Icon className="size-3.5 text-muted-foreground" />
      {children}
    </span>
  );
}

/* GitHub's Star control: a square under 768px, labelled from there up. A
   ring marks the spot until `starAt`, when it fills yellow. */
function StarControl({ tapAt, starAt }) {
  const reduce = useReduce();
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    if (starAt == null) return undefined;
    const t = setTimeout(() => setStarred(true), starAt * 1000);
    return () => clearTimeout(t);
  }, [starAt]);

  return (
    <motion.span
      {...pressAt(tapAt)}
      className="relative inline-flex h-7 min-w-7 items-center justify-center gap-1.5 rounded-[6px] border border-border-strong bg-secondary/70 font-medium md:px-2"
    >
      {!starred && (
        <motion.span
          className="absolute -inset-1 rounded-[10px] ring-2 ring-link"
          animate={reduce ? undefined : { opacity: [1, 0.3] }}
          transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      )}
      {starred ? (
        <motion.span
          className="relative grid size-3.5 place-items-center"
          initial={{ scale: 0.3 }}
          animate={{ scale: [0.3, 1.3, 1] }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <StarFill className="size-3.5 text-[#e3b341]" />
          {!reduce && <Sparks />}
        </motion.span>
      ) : (
        <Star className="size-3.5 text-muted-foreground" />
      )}
      <span className="hidden md:inline">{starred ? 'Starred' : 'Star'}</span>
      {tapAt != null && <Tap at={tapAt} />}
    </motion.span>
  );
}

/* the repo page as the visitor will meet it on this screen; counts are
   left out, the rest of the page is shapes */
function RepoScene({ tapAt, starAt }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-8 shrink-0 items-center justify-between bg-[#0d1117] px-4 text-white md:h-9 md:px-5">
        <GithubMark className="size-[18px]" />
        <span className="flex items-center gap-2">
          <i className="block h-2 w-9 rounded-full bg-white/25" />
          <i className="block h-5 w-12 rounded-[6px] border border-white/30" />
        </span>
      </div>
      <div className="flex flex-col gap-3.5 px-4 pt-4 md:px-5 md:pt-5">
        <div className="flex flex-col items-start gap-2.5 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex max-w-full min-w-0 items-center gap-2">
            <span className="size-5 shrink-0 rounded-full bg-[linear-gradient(135deg,#9aa0a6,#4b5157)]" />
            <span className="truncate text-[13px] font-semibold">{repoName}</span>
            <span className="shrink-0 rounded-full border border-border-strong px-1.5 text-[10px] leading-4 font-medium text-muted-foreground @max-2xs:hidden md:@max-lg:hidden">
              Public
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[11px] md:text-xs">
            <GhButton icon={Bell}>
              <span className="md:@max-lg:hidden">Notifications</span>
            </GhButton>
            <GhButton icon={GitFork}>Fork</GhButton>
            <StarControl tapAt={tapAt} starAt={starAt} />
          </div>
        </div>
        <i className="block h-px bg-border" />
        {/* the files from 768px, with About beside them; About alone on a phone */}
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_6.5rem]">
          <div className="hidden overflow-hidden rounded-[6px] border border-border md:block">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
              <span className="size-3.5 shrink-0 rounded-full bg-foreground/20" />
              <i className="block h-1.5 w-2/5 rounded-full bg-foreground/15" />
            </div>
            {['w-1/3', 'w-1/4', 'w-2/5', 'w-1/3'].map((w, i) => (
              <div key={i} className="flex items-center gap-2 border-b border-border px-3 py-2 last:border-b-0">
                <span className="size-3 shrink-0 rounded-[3px] bg-[#54aeff]/55" />
                <i className={`block h-1.5 rounded-full bg-foreground/15 ${w}`} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <i className="block h-2 w-14 rounded-full bg-foreground/20" />
            <i className="block h-1.5 w-11/12 rounded-full bg-foreground/10" />
            <i className="block h-1.5 w-4/5 rounded-full bg-foreground/10" />
            <i className="block h-1.5 w-2/3 rounded-full bg-foreground/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ children }) => (
  <span className="flex h-7 items-center gap-1 rounded-[6px] border border-border-strong bg-card px-2.5">{children}</span>
);

/* GitHub's sign-in, filled in and sent; shapes, not a form */
function SignInScene({ tapAt }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
      <GithubMark className="size-7" />
      <p className="text-[13px] font-semibold">Sign in to GitHub</p>
      <div className="flex w-full max-w-[220px] flex-col gap-2">
        <Field>
          <motion.i
            className="block h-1.5 w-20 rounded-full bg-foreground/30"
            style={{ originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'linear' }}
          />
        </Field>
        <Field>
          {Array.from({ length: 8 }, (_, i) => (
            <motion.i
              key={i}
              className="block size-1 rounded-full bg-foreground/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 + i * 0.05, duration: 0.01 }}
            />
          ))}
        </Field>
        <motion.span
          {...pressAt(tapAt)}
          className="relative mt-1 grid h-7 place-items-center rounded-[6px] bg-[#1f883d] text-[11px] font-semibold text-white"
        >
          Sign in
          <Tap at={tapAt} />
        </motion.span>
      </div>
      <p className="text-[10px] text-muted-foreground">
        New to GitHub? <span className="text-[#0969da] dark:text-[#4493f8]">Create an account</span>
      </p>
    </div>
  );
}

function Scene({ step }) {
  if (step === 0) return <SiteScene />;
  if (step === 1) return <RepoScene tapAt={1.2} />;
  if (step === 2) return <SignInScene tapAt={1.35} />;
  return <RepoScene tapAt={0.5} starAt={0.85} />;
}

/* the browser the demo plays in; decorative, the steps carry the words */
function Demo({ step, run }) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-border-strong bg-background shadow-soft select-none [--icon-accent-opacity:0]"
    >
      <div className="flex h-10 items-center gap-3 border-b border-border bg-card px-3">
        <span className="hidden shrink-0 gap-1.5 md:flex">
          <i className="block size-2.5 rounded-full bg-foreground/15" />
          <i className="block size-2.5 rounded-full bg-foreground/15" />
          <i className="block size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-full bg-secondary px-3 font-mono text-[11px] text-muted-foreground">
          <Lock className="size-3" />
          <span className="truncate">{STEPS[step].url}</span>
        </span>
      </div>
      <div className="relative @container h-[236px] md:h-[300px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${run}-${step}`}
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_FADE }}
          >
            <Scene step={step} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* "New to GitHub?": how to star, for visitors who never have. Four steps
   beside a small demo of the pages they will meet. It plays once, the first
   time it is properly in view, and rests on the yellow star; picking a step
   shows that step again. The clock stops offscreen, a button pauses it, and
   under reduced motion it never starts by itself. `children` is the call to
   action under the steps. */
export function StarTutorial({ children }) {
  const figure = useRef(null);
  const progress = useMotionValue(0);
  const [step, setStep] = useState(0);
  /* idle until first seen; then playing, paused or done */
  const [mode, setMode] = useState('idle');
  /* bumped on every fresh start, so the scene replays from its beginning */
  const [run, setRun] = useState(0);
  const [inView, setInView] = useState(false);

  const show = (i, next) => {
    progress.set(0);
    setStep(i);
    setRun((r) => r + 1);
    setMode(next);
  };

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    io.observe(figure.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || mode !== 'idle' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    /* a fresh run, so the first scene plays its press in view */
    progress.set(0);
    setRun((r) => r + 1);
    setMode('playing');
  }, [inView, mode, progress]);

  /* "See how" in the card above replays it on arrival */
  useEffect(() => {
    const arrive = (e) => {
      if (e.detail !== '#how-to-star' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      progress.set(0);
      setStep(0);
      setRun((r) => r + 1);
      setMode('playing');
    };
    window.addEventListener('anchor:done', arrive);
    return () => window.removeEventListener('anchor:done', arrive);
  }, [progress]);

  /* the clock: fills the active step's bar, then moves on. It keeps real
     time through slow frames; frames stop in a background tab, and the gap
     on return counts as a quarter second, so it never skips a step. */
  const running = mode === 'playing' && inView;
  useEffect(() => {
    if (!running) return undefined;
    let frame = 0;
    let prev = performance.now();
    const tick = (now) => {
      const p = Math.min(1, progress.get() + Math.min(now - prev, 250) / STEPS[step].ms);
      prev = now;
      progress.set(p);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      progress.set(0);
      if (step < STEPS.length - 1) setStep(step + 1);
      else setMode('done');
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, step, run, progress]);

  const control =
    mode === 'playing'
      ? { label: 'Pause the walkthrough', Icon: Pause, act: () => setMode('paused') }
      : mode === 'done'
        ? { label: 'Replay the walkthrough', Icon: RotateCcw, act: () => show(0, 'playing') }
        : { label: 'Play the walkthrough', Icon: Play, act: () => (mode === 'idle' ? show(step, 'playing') : setMode('playing')) };

  return (
    <Reveal className="mt-6 sm:mt-8">
      <Card id="how-to-star" className="p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-x-10 lg:gap-y-6 xl:gap-x-14">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">New to GitHub?</p>
            <h3 className="mt-2.5 text-[26px] leading-[1.15] tracking-[-0.025em] sm:text-[28px]">
              How to star <em>Vocaly</em>
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Starring is free and doesn&apos;t subscribe you to anything.
            </p>
          </div>

          <figure ref={figure} className="min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-center">
            <Demo step={step} run={run} />
            <figcaption className="mt-3 flex items-center justify-between gap-4">
              <span className="text-[13px] leading-snug text-muted-foreground">
                Simplified; the real page may look a little different.
              </span>
              <Button type="button" variant="outline" size="icon" onClick={control.act} aria-label={control.label} className="shrink-0">
                <control.Icon className="size-4" />
              </Button>
            </figcaption>
          </figure>

          <ol className="flex flex-col gap-1 lg:col-start-1 lg:row-start-2">
            {STEPS.map((s, i) => {
              const active = i === step;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => show(i, 'paused')}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'relative flex w-full cursor-pointer touch-manipulation gap-3.5 overflow-hidden rounded-2xl p-3 text-left outline-none select-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/40 active:bg-secondary sm:p-3.5',
                      active ? 'bg-secondary' : 'hover:bg-secondary/50'
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold tabular-nums transition-colors duration-200',
                        active ? 'bg-primary text-primary-foreground' : 'border border-border-strong text-muted-foreground'
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 pt-0.5">
                      <span className="block text-[15px] leading-snug font-medium">{s.title}</span>
                      <span className="mt-1 block text-sm leading-snug text-muted-foreground">{s.text}</span>
                    </span>
                    {active && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-link"
                        style={{ scaleX: progress, originX: 0 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:col-start-1 lg:row-start-3">{children}</div>
        </div>
      </Card>
    </Reveal>
  );
}
