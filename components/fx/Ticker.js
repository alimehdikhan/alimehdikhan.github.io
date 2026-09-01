'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from 'framer-motion';

/* px per ms — 0.55px/frame at 60fps. framer clamps `delta` to 40ms, so below
   25fps the strip slows rather than skips, which reads better under jank. */
const SPEED = 0.033;

/* Marquee strip drifting at a constant speed, unaffected by scrolling.
   - Only runs while on screen (±200px), so it stops writing transforms for
     the 90% of a visit spent below the hero.
   - Hover eases the velocity to rest (~400ms) instead of hard-stopping.
   - The loop distance is measured sub-pixel from the duplicate set's real
     offset and re-measured by a ResizeObserver (font swap, item change).
   - Never moves under reduced motion. */
export function Ticker({ items }) {
  const trackRef = useRef(null);
  const halfWidth = useRef(0);
  const paused = useRef(false);
  const vel = useRef(1);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  const inView = useInView(trackRef, { margin: '200px 0px 200px 0px' });

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      halfWidth.current = 0;
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    const track = trackRef.current;
    if (!track) return;

    const target = paused.current ? 0 : 1;
    vel.current += (target - vel.current) * (1 - Math.exp(-delta / 160));
    if (paused.current && vel.current < 0.002) return;

    if (!halfWidth.current) {
      const kids = track.children;
      const half = kids.length >> 1;
      if (kids.length && kids[half]) {
        halfWidth.current = kids[half].getBoundingClientRect().left - kids[0].getBoundingClientRect().left;
      }
    }
    const w = halfWidth.current || 1;
    x.set((x.get() - SPEED * vel.current * delta) % w);
  });

  return (
    <div
      className="ticker"
      aria-hidden="true"
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
    >
      <motion.div className="track" ref={trackRef} style={{ x }}>
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}
