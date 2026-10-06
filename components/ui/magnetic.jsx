'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

const PULL = { stiffness: 260, damping: 18, mass: 0.5 };
const PRESS = { stiffness: 500, damping: 30 };

/* Magnetic wrapper for primary buttons: the child drifts a few pixels toward
   a mouse pointer and springs back on leave, and squeezes slightly while
   pressed. Fine pointers only, never under reduced motion. It moves a
   wrapper span (transform only), so the button keeps its own styles, and
   adds no tab stop of its own. */
export function Magnetic({ children, className, strength = 0.3, max = 8 }) {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  const rect = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const s = useMotionValue(1);
  const sx = useSpring(x, PULL);
  const sy = useSpring(y, PULL);
  const scale = useSpring(s, PRESS);

  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const active = fine && !reduce;
  const clamp = (v) => Math.max(-max, Math.min(max, v));

  const onEnter = (e) => {
    if (!active || e.pointerType !== 'mouse') return;
    rect.current = e.currentTarget.getBoundingClientRect();
  };
  const onMove = (e) => {
    if (!active || e.pointerType !== 'mouse') return;
    const r = rect.current || (rect.current = e.currentTarget.getBoundingClientRect());
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
  };
  const reset = () => {
    rect.current = null;
    x.set(0);
    y.set(0);
    s.set(1);
  };

  return (
    <motion.span
      className={cn('inline-flex', className)}
      style={active ? { x: sx, y: sy, scale } : undefined}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onPointerDown={() => active && s.set(0.96)}
      onPointerUp={() => s.set(1)}
    >
      {children}
    </motion.span>
  );
}
