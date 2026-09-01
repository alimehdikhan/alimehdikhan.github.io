'use client';

import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { RESUME } from '../../data/resume';
import { EASE } from './motion';
import { realignHash } from './scrollTo';

/* Name + counter preloader. The `is-loading` class is set on <html> by an
   inline head script before first paint (skipped for reduced motion); this
   component counts to 100, slides the curtain away, and hands off to
   `is-loaded`, which triggers the hero rise/fade choreography.
   - The count is budgeted against time already spent since navigation, so a
     slow load does not pay a full 1.2s on top of its own wait.
   - The bar scales (compositor) instead of animating width (layout).
   - The curtain unmounts once it has left, freeing a full-viewport layer.
   While the curtain is up the document is flagged aria-busy. */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const count = useMotionValue(0);
  const num = useTransform(count, (v) => String(Math.floor(v)).padStart(2, '0'));
  const scaleX = useTransform(count, (v) => v / 100);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('is-loading')) {
      html.classList.add('is-loaded');
      setGone(true);
      return undefined;
    }

    document.body.setAttribute('aria-busy', 'true');
    const elapsed = performance.now() / 1000;
    const duration = Math.max(0.45, Math.min(1.2, 1.6 - elapsed));
    let handoff;
    const controls = animate(count, 100, {
      duration,
      ease: EASE,
      onComplete: () => {
        handoff = setTimeout(() => {
          realignHash();
          setDone(true);
          html.classList.remove('is-loading');
          html.classList.add('is-loaded');
          document.body.removeAttribute('aria-busy');
        }, 260);
      },
    });

    return () => {
      controls.stop();
      clearTimeout(handoff);
      document.body.removeAttribute('aria-busy');
    };
  }, [count]);

  if (gone) return null;

  return (
    <motion.div
      id="pre"
      aria-hidden="true"
      initial={false}
      animate={{ y: done ? '-101%' : '0%' }}
      transition={{ duration: 1, ease: EASE }}
      onAnimationComplete={() => {
        if (done) setGone(true);
      }}
    >
      <div className="word">
        <span>{RESUME.name}</span>
      </div>
      <motion.div className="num">{num}</motion.div>
      <motion.div className="bar" style={{ scaleX, originX: 0 }} />
    </motion.div>
  );
}
