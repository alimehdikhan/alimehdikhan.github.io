'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { SkillLogo } from './Skills';
import { HeroParticles } from './HeroParticles';
import { cn } from '@/lib/utils';

/* Skill badges around the portrait. Positions are percentages of the
   stage; `depth` sets how far a badge drifts with the cursor (parallax) and
   `delay` offsets its float so they never bob in unison. */
const badges = [
  { name: 'Python', className: 'left-[-2%] top-[20%]', depth: 16, delay: 0, from: [-24, 0] },
  { name: 'FastAPI', className: 'right-[-4%] top-[14%]', depth: 12, delay: 1.6, from: [24, 0] },
  { name: 'TensorFlow', className: 'right-[-6%] top-[60%]', depth: 20, delay: 3.1, hideSm: true, from: [24, 0] },
  { name: 'OpenAI Whisper', className: 'left-[-4%] top-[66%]', depth: 18, delay: 4.4, from: [-24, 0] },
];

const EASE_OUT = [0.16, 1, 0.3, 1];
/* entrance timing, after the headline has started rising */
const RINGS_AT = 0.45;
const BADGES_AT = 0.9;

/* soft, slightly under-damped: the stage settles after the cursor stops */
const TILT = { stiffness: 70, damping: 16, mass: 0.9 };
const MAX = 5;

/* layered parallax: each layer drifts by its own depth in px */
function useLayer(sx, sy, depth) {
  return {
    x: useTransform(sx, [-1, 1], [-depth, depth]),
    y: useTransform(sy, [-1, 1], [-depth, depth]),
  };
}

/* three wrappers, one job each: parallax (cursor), entrance (once), float
   (CSS loop), so no transform is ever driven by two systems */
function Badge({ badge, index, sx, sy }) {
  const { x, y } = useLayer(sx, sy, badge.depth);
  return (
    <motion.div className={cn('absolute', badge.className, badge.hideSm && 'hidden sm:block')} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, x: badge.from[0], scale: 0.85 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: BADGES_AT + index * 0.12 }}
      >
        <span
          className="flex animate-float items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 text-[13px] font-medium whitespace-nowrap shadow-soft motion-reduce:animate-none md:bg-card/85 md:backdrop-blur-md"
          style={{ animationDelay: `-${badge.delay}s` }}
        >
          <span className="grid size-7 place-items-center rounded-full bg-secondary">
            <SkillLogo name={badge.name} size={15} />
          </span>
          {badge.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* expanding lime rings: three pulses spread out from the disc once, as the
   portrait settles in */
function EntranceRings() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-[6%]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-primary"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.7, 1.32] }}
          transition={{ duration: 2.2, ease: EASE_OUT, delay: RINGS_AT + i * 0.28, times: [0, 0.25, 1] }}
        />
      ))}
    </div>
  );
}

/* Portrait stage, back to front: an interactive particle vortex with a
   cursor-driven light, a lime halo, still orbit lines, the cutout on a soft disc
   and floating skill badges. The stage tilts toward the cursor anywhere over
   the hero while its layers drift by different amounts. Fine pointers only;
   reduced motion keeps everything still. */
export function HeroPortrait() {
  const reduce = useReducedMotion();
  const stage = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, TILT);
  const sy = useSpring(my, TILT);
  const rotateY = useTransform(sx, [-1, 1], [-MAX, MAX]);
  const rotateX = useTransform(sy, [-1, 1], [MAX, -MAX]);
  const glow = useLayer(sx, sy, -10);
  const orbit = useLayer(sx, sy, -5);
  const portrait = useLayer(sx, sy, 6);
  /* cursor-driven light: a soft lime patch on the disc that leans toward the
     cursor on the same spring as the tilt */
  const lightX = useTransform(sx, [-1, 1], ['-28%', '28%']);
  const lightY = useTransform(sy, [-1, 1], ['-28%', '28%']);

  useEffect(() => {
    if (reduce) return undefined;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const hero = document.getElementById('hero');
    if (!hero) return undefined;
    let frame = 0;
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || !fine.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = stage.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2))));
        my.set(Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2))));
      });
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, mx, my]);

  const still = { x: 0, y: 0 };

  return (
    <div className="relative mx-auto w-full max-w-[480px]" style={{ perspective: '1600px' }}>
      <motion.div
        ref={stage}
        className="relative aspect-square w-full"
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }}
      >
        {/* particle field: its own three depth layers and moving light */}
        <HeroParticles className="pointer-events-none absolute -inset-[16%] size-[132%] [mask-image:radial-gradient(closest-side,black_80%,transparent)]" />

        {/* soft lime halo */}
        <motion.div aria-hidden="true" className="absolute -inset-[6%]" style={reduce ? still : glow}>
          <div className="size-full rounded-full bg-[radial-gradient(circle_at_50%_50%,rgb(var(--glow)/0.26),rgb(var(--glow)/0.06)_55%,transparent_72%)] blur-2xl" />
        </motion.div>

        {/* orbit lines: two still hairline rings (the vortex carries the motion) */}
        <motion.div aria-hidden="true" className="absolute inset-0" style={reduce ? still : orbit}>
          <svg viewBox="0 0 500 500" className="absolute inset-0 size-full">
            <circle cx="250" cy="250" r="248" fill="none" stroke="var(--border)" strokeWidth="1" />
            <circle cx="250" cy="250" r="248" fill="none" stroke="var(--link)" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="1 12" strokeLinecap="round" />
            <circle cx="250" cy="2" r="4" fill="var(--primary)" />
            <circle cx="250" cy="2" r="10" fill="var(--primary)" fillOpacity="0.2" />
          </svg>
          <svg viewBox="0 0 500 500" className="absolute inset-[3%] size-[94%]">
            <ellipse cx="250" cy="250" rx="248" ry="248" fill="none" stroke="var(--border)" strokeDasharray="4 10" />
            <circle cx="2" cy="250" r="3" fill="var(--muted-foreground)" />
          </svg>
        </motion.div>

        {/* soft disc and the cutout, clipped at the shoulders */}
        <motion.div className="absolute inset-[6%]" style={reduce ? still : portrait}>
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,var(--card),var(--secondary)_70%)] shadow-[inset_0_0_0_1px_var(--border)]"
          />
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.3),transparent)] blur-xl"
              style={reduce ? still : { x: lightX, y: lightY }}
            />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <img
              src="/assets/images/profile-cutout-800.webp"
              srcSet="/assets/images/profile-cutout-480.webp 480w, /assets/images/profile-cutout-640.webp 640w, /assets/images/profile-cutout-800.webp 800w"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 440px"
              alt="Portrait of Ali Mehdi Khan, Software Engineer and AI/ML Developer"
              width={800}
              height={800}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-x-0 bottom-0 h-[96%] w-full object-contain object-bottom"
            />
          </div>
        </motion.div>

        <EntranceRings />

        {badges.map((badge, i) => (
          <Badge key={badge.name} badge={badge} index={i} sx={sx} sy={sy} />
        ))}
      </motion.div>
    </div>
  );
}
