'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

/* Aceternity UI — 3D Card container, adapted: springs instead of CSS
   transitions, a gentle tilt ceiling, and the effect is limited to a mouse
   on a fine pointer without reduced motion. */

const TILT = { stiffness: 180, damping: 22, mass: 0.6 };

export function CardContainer({ children, className, containerClassName, maxTilt = 5 }) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const rect = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, TILT);
  const rotateY = useSpring(ry, TILT);

  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const active = enabled && !reduce;

  const onEnter = (e) => {
    if (!active || e.pointerType !== 'mouse') return;
    rect.current = e.currentTarget.getBoundingClientRect();
  };
  const onMove = (e) => {
    if (!active || e.pointerType !== 'mouse') return;
    const r = rect.current || (rect.current = e.currentTarget.getBoundingClientRect());
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 2 * maxTilt);
    rx.set(-py * 2 * maxTilt);
  };
  const onLeave = () => {
    rect.current = null;
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className={cn('h-full', containerClassName)} style={{ perspective: '1200px' }}>
      <motion.div
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerCancel={onLeave}
        className={cn('relative h-full', className)}
        style={{ rotateX: active ? rotateX : 0, rotateY: active ? rotateY : 0, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
