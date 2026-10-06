'use client';

import { useEffect, useRef } from 'react';
import { animate, inView, stagger as staggerDelay } from 'motion';
import { onRevealSection } from './revealSection';

const EASE = [0.25, 0.1, 0.25, 1];

/* Scroll reveal: a gentle upward fade driven by Motion.
   Content is fully visible in the server HTML. Only blocks that start below
   the fold are hidden, and only once JS is running, so no-JS visitors and
   anything already on screen never flash. `stagger` reveals the direct
   children one after another instead of the block as a whole. */
export function Reveal({ as: Tag = 'div', className, stagger, delay = 0, x = 0, y = 16, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const targets = stagger ? Array.from(el.children) : [el];
    if (!targets.length) return undefined;

    let done = false;
    let armed = false;
    let controls;
    let stopView = () => {};
    let stopJump = () => {};
    let stopArm = () => {};

    /* decide what to hide only once the page sits where it will stay: on a
       deep link (/#projects) that is after the browser's anchor jump. The
       position comes from an observer's first report rather than a
       synchronous measurement, so dozens of blocks mounting together never
       force layout one after another. */
    const arm = () => {
      const io = new IntersectionObserver(([entry]) => {
        io.disconnect();
        if (entry.boundingClientRect.top < innerHeight * 0.9) return;
        armed = true;
        targets.forEach((t) => {
          t.style.opacity = '0';
          t.style.transform = `translate(${x}px, ${y}px)`;
        });
        stopView = inView(el, () => show(false), { margin: '0px 0px -12% 0px' });
        /* anchor jumps land on content immediately instead of a blank block */
        stopJump = onRevealSection(() => show(true));
      });
      io.observe(el);
      stopArm = () => io.disconnect();
    };

    const show = (instant) => {
      if (done) return;
      done = true;
      controls = animate(
        targets,
        { opacity: 1, transform: 'translate(0px, 0px)' },
        instant
          ? { duration: 0 }
          : { duration: 0.8, ease: EASE, delay: stagger ? staggerDelay(stagger, { startDelay: delay }) : delay }
      );
      /* hand the elements back to the stylesheet so CSS hover transforms work */
      controls.then(clear, clear);
    };

    function clear() {
      targets.forEach((t) => {
        t.style.removeProperty('opacity');
        t.style.removeProperty('transform');
      });
    }

    const deepLink = location.hash.length > 1 && document.readyState !== 'complete';
    if (deepLink) window.addEventListener('load', arm, { once: true });
    else arm();

    return () => {
      window.removeEventListener('load', arm);
      stopArm();
      stopView();
      stopJump();
      controls?.stop();
      if (armed) clear();
    };
  }, [stagger, delay, x, y]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
