'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from '@/components/ui/icons';
import { scrollToHash } from './scrollTo';
import { revealSection } from './revealSection';
import { SPRING } from './motion';

/* Back to top, with the page's progress drawn round it as a lime ring. It
   comes in once the first screen is behind the reader and leaves again at
   the contact section, so it never sits over the form (the footer has its
   own link). The ring is the same spring-smoothed progress as the hairline. */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING.scroll);
  /* the arc is a dash on a circle measured as length 1: it starts where the
     reader already is when the button comes in, then follows the scroll */
  const arc = useRef(null);
  const draw = (v) => arc.current?.style.setProperty('stroke-dashoffset', String(1 - v));
  useMotionValueEvent(progress, 'change', draw);
  const mountArc = (el) => {
    arc.current = el;
    draw(progress.get());
  };

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const contact = document.getElementById('contact');
      const past = window.scrollY > window.innerHeight * 1.2;
      const before = !contact || contact.getBoundingClientRect().top > window.innerHeight * 0.75;
      setShown(past && before);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* e.detail is 0 when Enter or Space fired the click */
  const toTop = (e) => {
    if (scrollToHash('#hero', { keyboard: e.detail === 0 })) e.preventDefault();
    else revealSection('#hero');
  };

  return (
    <AnimatePresence>
      {shown && (
        <motion.a
          key="top"
          href="#hero"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: 'spring', ...SPRING.ui }}
          whileTap={{ scale: 0.92 }}
          className="group fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full bg-card/85 text-foreground shadow-lift backdrop-blur-xl outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/40 md:right-6 md:bottom-6"
        >
          <svg viewBox="0 0 48 48" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
            <circle cx="24" cy="24" r="22.5" fill="none" strokeWidth="2" className="stroke-border-strong" />
            <circle
              ref={mountArc}
              cx="24"
              cy="24"
              r="22.5"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1 1"
              className="stroke-primary"
            />
          </svg>
          <ArrowUp className="size-[18px]" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
