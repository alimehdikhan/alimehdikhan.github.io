'use client';

import { useEffect, useRef } from 'react';
import { Sparkle } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

/* the invitation, and the roles under it */
const LEAD = [{ text: "Let's build something" }, { text: 'worth using', serif: true }, { star: true }, { text: 'Open to AI and software roles' }, { star: true }];
const ROLES = RESUME.roles.flatMap((role) => [{ text: role }, { star: true }]);

/* keeps a looping offset inside one copy's width, moving either way */
const wrap = (v, w) => (((v % w) + w) % w) - w;

function Row({ items, track, className }) {
  /* three copies, so the widest screen never sees the seam */
  return (
    <div ref={track} className={cn('flex w-max items-center whitespace-nowrap will-change-transform', className)}>
      {[0, 1, 2].map((copy) => (
        <span key={copy} className="flex shrink-0 items-center">
          {items.map((item, i) =>
            item.star ? (
              <Sparkle key={i} className="mx-[0.3em] size-[0.5em] text-link [--icon-accent-opacity:0.5] [--icon-accent:currentColor]" />
            ) : (
              <span key={i} className={cn('px-[0.12em]', item.serif && 'font-serif font-normal tracking-[-0.01em] text-link italic')}>
                {item.text}
              </span>
            )
          )}
        </span>
      ))}
    </div>
  );
}

/* A kinetic type band before the contact section: an invitation in large
   type, the roles in outline beneath it running the other way. Scrolling
   speeds both up, turns them with the direction of travel and leans them
   into the motion; a hovering mouse slows them to read. One rAF loop, only
   while the band is on screen; reduced motion leaves it still. Decorative:
   the contact section says the same in words. */
export function KineticBand() {
  const root = useRef(null);
  const lead = useRef(null);
  const roles = useRef(null);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const rows = [lead.current, roles.current];
    const x = [0, 0];
    const width = [1, 1];
    let dir = 1;
    let velocity = 0;
    let lean = 0;
    let slow = 1;
    let hover = false;
    let visible = false;
    let frame = 0;
    let last = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const measure = () => rows.forEach((row, k) => (width[k] = row.scrollWidth / 3 || 1));
    const render = (t) => {
      frame = 0;
      if (!visible || document.hidden || media.matches) return;
      const dt = Math.min(t - (last || t), 50);
      last = t;
      velocity *= Math.exp(-dt / 260);
      slow += ((hover ? 0.25 : 1) - slow) * 0.08;
      /* px per ms: a slow drift, up to six times faster on a hard scroll */
      const speed = 0.05 * slow * (1 + Math.min(Math.abs(velocity) / 500, 5));
      x[0] = wrap(x[0] - dir * speed * dt, width[0]);
      x[1] = wrap(x[1] + dir * speed * 0.75 * dt, width[1]);
      lean += (Math.min(Math.abs(velocity) / 220, 6) - lean) * 0.1;
      rows[0].style.transform = `translate3d(${x[0]}px,0,0) skewX(${(dir * lean).toFixed(2)}deg)`;
      rows[1].style.transform = `translate3d(${x[1]}px,0,0) skewX(${(-dir * lean).toFixed(2)}deg)`;
      frame = requestAnimationFrame(render);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (media.matches) {
        rows.forEach((row) => (row.style.transform = 'none'));
        return;
      }
      if (visible && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(render);
      }
    };
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      velocity = (dy / Math.max(now - lastT, 16)) * 1000;
      if (dy) dir = dy > 0 ? 1 : -1;
      lastY = window.scrollY;
      lastT = now;
    };
    const enter = (e) => (hover = e.pointerType === 'mouse');
    const leave = () => (hover = false);

    const ro = new ResizeObserver(measure);
    rows.forEach((row) => ro.observe(row));
    measure();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(root.current);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', sync);
    media.addEventListener('change', sync);
    root.current.addEventListener('pointerenter', enter);
    root.current.addEventListener('pointerleave', leave);
    const el = root.current;

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', sync);
      media.removeEventListener('change', sync);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="flex flex-col gap-1 overflow-hidden py-8 select-none [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] md:gap-2 md:py-14"
    >
      <Row items={LEAD} track={lead} className="text-[clamp(2.75rem,8.5vw,7.25rem)] leading-[1.08] font-semibold tracking-[-0.045em]" />
      <Row
        items={ROLES}
        track={roles}
        className="text-[clamp(1.6rem,4.6vw,3.75rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_var(--muted-foreground)]"
      />
    </div>
  );
}
