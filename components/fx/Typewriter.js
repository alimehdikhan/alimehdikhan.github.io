'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/* State-free typewriter: writes textContent through a ref so the parent never
   re-renders. It starts on the first phrase exactly as the server rendered
   it, holds it, then erases faster than it types the next one, so the page
   never flickers from the full word to a single letter on load. Pauses
   while off-screen or in a hidden tab. Under reduced motion the first
   phrase simply stays. */
export function Typewriter({ words, type = 55, erase = 28, hold = 3200, pause = 300 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !words.length) return undefined;
    if (reduce) { el.textContent = words[0]; return; }

    let i = 0;
    let len = words[0].length;
    let deleting = true;
    let timer = 0;
    let active = true;
    let visible = true;

    const schedule = (ms) => {
      clearTimeout(timer);
      timer = setTimeout(step, ms);
    };

    const step = () => {
      if (!active) return;
      if (!visible || document.hidden) {
        /* idle poll while hidden — cheap, and resumes within a beat */
        schedule(400);
        return;
      }
      const w = words[i];
      if (reduce) {
        el.textContent = w;
        i = (i + 1) % words.length;
        schedule(3500);
        return;
      }
      len += deleting ? -1 : 1;
      el.textContent = w.slice(0, len);
      let wait = deleting ? erase : type;
      if (!deleting && len === w.length) {
        deleting = true;
        wait = hold;
      } else if (deleting && len === 0) {
        deleting = false;
        i = (i + 1) % words.length;
        wait = pause;
      }
      schedule(wait);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    schedule(hold);

    return () => {
      active = false;
      clearTimeout(timer);
      io.disconnect();
    };
  }, [words, reduce, type, erase, hold, pause]);

  return <b ref={ref}>{words[0]}</b>;
}
