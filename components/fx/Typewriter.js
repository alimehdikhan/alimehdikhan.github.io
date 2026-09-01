'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLoaded } from './useLoaded';

/* State-free typewriter: writes textContent through a ref so the parent never
   re-renders. Waits for the curtain, then types fast, holds the finished
   phrase, erases faster. Pauses while off-screen or in a hidden tab. Under
   reduced motion the whole word swaps every 3.5s. SSR output is an empty
   <b>, identical to the old first render. */
export function Typewriter({ words, type = 55, erase = 28, hold = 3200, pause = 300, start = 500 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const loaded = useLoaded();

  useEffect(() => {
    const el = ref.current;
    if (!el || !loaded || !words.length) return undefined;

    let i = 0;
    let len = 0;
    let deleting = false;
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

    schedule(reduce ? 0 : start);

    return () => {
      active = false;
      clearTimeout(timer);
      io.disconnect();
    };
  }, [words, reduce, loaded, type, erase, hold, pause, start]);

  return <b ref={ref} />;
}
