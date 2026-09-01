'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { VIEWPORT } from './motion';
import { useLoaded } from './useLoaded';

/* Eases a number up the first time it scrolls into view. The final value is
   server-rendered, so the markup reads correctly without JS.
   - `delay` lets a cell start counting only once its own reveal has made it
     legible (pass the cell's stagger offset).
   - The suffix rides along on every frame, so nothing pops in at the end.
   - Small integers tick deliberately instead of stuttering through an ease. */
export function Counter({ to, suffix = '', delay = 0.2, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotion();
  const loaded = useLoaded();

  useEffect(() => {
    const el = ref.current;
    if (!inView || !loaded || !el || reduce) return undefined;

    const small = to < 10;
    const controls = animate(0, to, {
      duration: small ? 0.55 : 1.1,
      delay,
      ease: small ? 'linear' : [0.33, 1, 0.68, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
      onComplete: () => {
        el.textContent = `${to}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, loaded, reduce, to, suffix, delay]);

  return (
    <em ref={ref} className={className}>
      {to}
      {suffix}
    </em>
  );
}
