'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { SkillLogo } from './Skills';
import { HeroParticles } from './HeroParticles';
import { useReduce } from './fx/useReduce';
import { cn } from '@/lib/utils';

/* Skill chips around the portrait. Positions are percentages of the stage;
   `depth` sets how far a chip drifts with the cursor (parallax) and `delay`
   offsets its float so they never bob in unison. */
const badges = [
  { name: 'Python', note: 'Language', className: 'left-[-2%] top-[20%]', depth: 16, delay: 0, pace: 9, from: [-28, 10] },
  { name: 'FastAPI', note: 'Backend', className: 'right-[-4%] top-[14%]', depth: 12, delay: 1.6, pace: 10.5, from: [28, 10] },
  { name: 'TensorFlow', note: 'Deep learning', className: 'right-[-6%] top-[60%]', depth: 20, delay: 3.1, pace: 8.5, hideSm: true, from: [28, 10] },
  { name: 'OpenAI Whisper', note: 'Speech AI', className: 'left-[-4%] top-[66%]', depth: 18, delay: 4.4, pace: 11, from: [-28, 10] },
];

/* soft lime specks in front of the stage: they drift further than anything
   else, which is what makes the layers read as depth */
const specks = [
  { className: 'left-[11%] top-[7%] size-2.5 blur-[1px]', depth: 34, delay: 1.2, opacity: 0.7 },
  { className: 'right-[8%] bottom-[13%] size-3.5 blur-[2px]', depth: 44, delay: 3.4, opacity: 0.5 },
  { className: 'left-[15%] bottom-[5%] size-2 blur-[0.5px]', depth: 28, delay: 5.2, opacity: 0.8 },
  { className: 'right-[20%] top-[3%] size-1.5', depth: 24, delay: 2.2, opacity: 0.9 },
];

const EASE_OUT = [0.16, 1, 0.3, 1];
/* entrance timing, after the headline has started rising */
const RINGS_AT = 0.45;
const BADGES_AT = 0.9;
const LIGHT_AT = 1.3; // the stage's light switches on once everything has landed

/* soft, slightly under-damped: the stage settles after the cursor stops */
const TILT = { stiffness: 70, damping: 16, mass: 0.9 };
const MAX = 5;

/* the light, in degrees clockwise from the top: it points at the cursor, and
   circles slowly on its own when there is none */
const REST_ANGLE = -38;
const IDLE_SPEED = 7; // deg/s
const REST_POWER = 0.62;

/* ticks of the bezel between the disc and the outer orbit, in a 500 box */
const polar = (deg, r) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(250 + r * Math.cos(a)).toFixed(1)} ${(250 + r * Math.sin(a)).toFixed(1)}`;
};
const tickPath = (major) => {
  let d = '';
  for (let i = 0; i < 120; i += 1) {
    if ((i % 5 === 0) !== major) continue;
    d += `M${polar(i * 3, 249)}L${polar(i * 3, major ? 237 : 243)}`;
  }
  return d;
};
const MINOR_TICKS = tickPath(false);
const MAJOR_TICKS = tickPath(true);

function shortest(from, to) {
  let d = (to - from) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

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
        initial={{ opacity: 0, x: badge.from[0], y: badge.from[1], scale: 0.8 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{
          opacity: { duration: 0.6, ease: EASE_OUT, delay: BADGES_AT + index * 0.14 },
          default: { type: 'spring', stiffness: 150, damping: 17, delay: BADGES_AT + index * 0.14 },
        }}
      >
        <span
          className="badge-glass chip-drift flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 whitespace-nowrap motion-reduce:animate-none"
          style={{ animationDelay: `-${badge.delay}s`, animationDuration: `${badge.pace}s` }}
        >
          <SkillLogo name={badge.name} size={20} shape="circle" />
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-[-0.005em]">{badge.name}</span>
            <span className="text-[11px] font-medium tracking-[0.07em] text-muted-foreground uppercase">{badge.note}</span>
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}

function Speck({ speck, sx, sy }) {
  const { x, y } = useLayer(sx, sy, speck.depth);
  return (
    <motion.span
      aria-hidden="true"
      className={cn('pointer-events-none absolute', speck.className)}
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: BADGES_AT + 0.5 }}
    >
      <span
        className="block size-full animate-float rounded-full bg-primary motion-reduce:animate-none"
        style={{ opacity: speck.opacity, animationDelay: `-${speck.delay}s` }}
      />
    </motion.span>
  );
}

/* expanding lime rings: three pulses spread out from the disc once, as the
   portrait settles in (the particle vortex swells with them) */
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

/* Portrait stage, back to front: an interactive particle vortex, a lime halo,
   the orbit (a ring that draws itself, a comet, a tick bezel), the cutout on a
   glass disc with a rim light, floating skill chips and a few drifting specks.
   One light ties it together: the rim highlight and the lit ticks both point
   at the cursor, and circle slowly on their own otherwise. The stage tilts
   toward the cursor anywhere over the hero while its layers drift by different
   amounts. Fine pointers only; reduced motion keeps everything still. */
export function HeroPortrait() {
  const reduce = useReduce();
  const stage = useRef(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, TILT);
  const sy = useSpring(my, TILT);
  const rotateY = useTransform(sx, [-1, 1], [-MAX, MAX]);
  const rotateX = useTransform(sy, [-1, 1], [MAX, -MAX]);
  const glow = useLayer(sx, sy, -10);
  const orbit = useLayer(sx, sy, -5);
  const disc = useLayer(sx, sy, 2);
  const subject = useLayer(sx, sy, 10);
  /* cursor-driven light: a soft lime patch on the disc that leans toward the
     cursor on the same spring as the tilt */
  const lightX = useTransform(sx, [-1, 1], ['-28%', '28%']);
  const lightY = useTransform(sy, [-1, 1], ['-28%', '28%']);
  /* the stage's light: angle and strength */
  const ang = useMotionValue(REST_ANGLE);
  const power = useMotionValue(0);
  const antiAng = useTransform(ang, (a) => -a);

  useEffect(() => {
    if (reduce) {
      ang.set(REST_ANGLE);
      power.set(REST_POWER);
      return undefined;
    }
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
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mx.set(Math.max(-1, Math.min(1, dx / (window.innerWidth / 2))));
        my.set(Math.max(-1, Math.min(1, dy / (window.innerHeight / 2))));
        pointer.current = { x: dx, y: dy, active: true };
      });
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
      pointer.current.active = false;
    };
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, mx, my, ang, power]);

  /* the light's own loop: eases the angle toward the cursor (or the idle
     sweep) and its strength up or down. It only runs while the stage is on
     screen and the tab is visible. */
  useEffect(() => {
    if (reduce) return undefined;
    const el = stage.current;
    if (!el) return undefined;
    let frame = 0;
    let last = 0;
    let t = 0;
    let visible = false;
    const tick = (now) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(now - last, 50) : 16;
      last = now;
      t += dt / 1000;
      const p = pointer.current;
      const a = ang.get();
      const target = p.active ? (Math.atan2(p.x, -p.y) * 180) / Math.PI : REST_ANGLE + t * IDLE_SPEED;
      ang.set(a + shortest(a, target) * (1 - Math.exp(-dt / 200)));
      const want = t < LIGHT_AT ? 0 : p.active ? 1 : REST_POWER;
      power.set(power.get() + (want - power.get()) * (1 - Math.exp(-dt / 420)));
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(el);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce, ang, power]);

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

        {/* the orbit: an outer ring that draws itself, a comet that circles it
            once the stage has landed, and a bezel of ticks that the light
            picks out */}
        <motion.div aria-hidden="true" className="absolute inset-0" style={reduce ? still : orbit}>
          <svg viewBox="0 0 500 500" className="absolute inset-0 size-full -rotate-90">
            <motion.circle
              key={reduce ? 'still' : 'live'}
              cx="250"
              cy="250"
              r="248"
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth="1"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: EASE_OUT, delay: RINGS_AT }}
            />
          </svg>

          {!reduce && (
            <motion.div
              className="absolute inset-[0.4%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: RINGS_AT + 1.6 }}
            >
              <div className="stage-comet absolute inset-0">
                <div className="stage-ring absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg_230deg,rgb(var(--glow)/0.9)_360deg)]" />
                <span className="absolute top-px left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_3px_rgb(var(--glow)/0.75)]" />
              </div>
            </motion.div>
          )}

          <div className="absolute inset-[2.5%]">
            <svg viewBox="0 0 500 500" className="absolute inset-0 size-full">
              <path d={MINOR_TICKS} stroke="var(--border-strong)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d={MAJOR_TICKS} stroke="var(--muted-foreground)" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
            {/* the same ticks in lime, seen through a window that turns toward
                the light (the ticks themselves are turned back so they stay put) */}
            <motion.div
              className="absolute inset-0 [mask-image:conic-gradient(from_-55deg,transparent,#000_55deg,transparent_110deg)]"
              style={{ rotate: ang, opacity: power }}
            >
              <motion.div className="absolute inset-0" style={{ rotate: antiAng }}>
                <svg viewBox="0 0 500 500" className="absolute inset-0 size-full">
                  <path d={MINOR_TICKS} stroke="var(--link)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  <path d={MAJOR_TICKS} stroke="var(--link)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* glass disc, lit from behind */}
        <motion.div className="absolute inset-[6%]" style={reduce ? still : disc}>
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,var(--card),var(--secondary)_70%)] shadow-[inset_0_0_0_1px_var(--border)]"
          />
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--tile-from),transparent_46%)]" />
            {/* lime backlight behind the head, switched on as the portrait lands */}
            <motion.div
              key={reduce ? 'still' : 'live'}
              className="absolute inset-0 bg-[radial-gradient(56%_52%_at_50%_36%,rgb(var(--glow)/0.34),transparent_72%)]"
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.5 }}
            />
            <motion.div
              className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.3),transparent)] blur-xl"
              style={reduce ? still : { x: lightX, y: lightY }}
            />
          </div>

          {/* the subject: below the disc's centre line it is clipped by the
              disc, above it the head is free to rise past the edge. It drifts
              further than the disc, and rises into place as the stage lands. */}
          <div className="subject-mask absolute -inset-x-[10%] -top-[25%] bottom-0">
            <motion.div className="absolute inset-0" style={reduce ? still : subject}>
              <motion.div
                key={reduce ? 'still' : 'live'}
                className="absolute inset-0"
                initial={reduce ? false : { y: 44, scale: 0.96 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 70, damping: 15, mass: 1, delay: 0.3 }}
                style={{ transformOrigin: '50% 100%' }}
              >
                {/* lime silhouette glow: the cutout's own shape, blurred */}
                <div aria-hidden="true" className="absolute bottom-0 left-1/2 aspect-square h-[78%] -translate-x-1/2 scale-[1.04] opacity-60 blur-2xl">
                  <div className="subject-stencil size-full" />
                </div>
                <img
                  src="/assets/images/profile-cutout-800.webp"
                  srcSet="/assets/images/profile-cutout-480.webp 480w, /assets/images/profile-cutout-640.webp 640w, /assets/images/profile-cutout-800.webp 800w"
                  sizes="(max-width: 640px) 80vw, 420px"
                  alt="Portrait of Ali Mehdi Khan, Software Engineer and AI/ML Developer"
                  width={800}
                  height={800}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="absolute bottom-0 left-1/2 aspect-square h-[78%] w-auto max-w-none -translate-x-1/2 [filter:drop-shadow(0_0_1px_rgb(var(--glow)/0.55))]"
                />
              </motion.div>
            </motion.div>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            {/* the shoulders melt into the disc instead of ending on a hard edge */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--secondary),transparent_26%)] opacity-80" />
            {/* one pass of light across the glass as the stage lands */}
            {!reduce && (
              <motion.div
                className="absolute inset-y-[-10%] left-0 w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.16),transparent)]"
                initial={{ x: '-120%' }}
                animate={{ x: '320%' }}
                transition={{ duration: 1.7, ease: EASE_OUT, delay: 1.05 }}
              />
            )}
          </div>

          {/* rim light: a lime highlight on the disc's edge that turns toward
              the light, with a soft bloom behind it */}
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ rotate: ang, opacity: power }}>
            <div className="absolute -inset-1 blur-md">
              <div className="stage-ring absolute inset-1 [--ring-w:10px] bg-[conic-gradient(from_-65deg,transparent,rgb(var(--glow)/0.55)_65deg,transparent_130deg)]" />
            </div>
            <div className="stage-ring absolute inset-0 [--ring-w:2px] bg-[conic-gradient(from_-55deg,transparent,var(--link)_55deg,transparent_110deg)]" />
          </motion.div>
        </motion.div>

        <EntranceRings />

        {badges.map((badge, i) => (
          <Badge key={badge.name} badge={badge} index={i} sx={sx} sy={sy} />
        ))}
        {specks.map((speck) => (
          <Speck key={speck.className} speck={speck} sx={sx} sy={sy} />
        ))}
      </motion.div>
    </div>
  );
}
