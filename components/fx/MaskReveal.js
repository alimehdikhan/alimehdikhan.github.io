'use client';

import { useEffect, useRef } from 'react';
import { animate, inView } from 'motion';
import { onRevealSection } from './revealSection';

/* Masked reveal: the content rises out of a clipped line on a soft spring
   when it scrolls into view. Like <Reveal>, it is visible in the server
   HTML, only hides when it starts below the fold (measured by an observer,
   never synchronously), lands instantly on anchor jumps, and does nothing
   under reduced motion. */
export function MaskReveal({ as: Tag = 'span', className, innerClassName, delay = 0, children }) {
  const inner = useRef(null);

  useEffect(() => {
    const el = inner.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let done = false;
    let armed = false;
    let controls;
    let stopView = () => {};
    let stopJump = () => {};

    const clear = () => el.style.removeProperty('transform');
    const show = (instant) => {
      if (done) return;
      done = true;
      controls = animate(
        el,
        { y: ['105%', '0%'] },
        instant ? { duration: 0 } : { type: 'spring', visualDuration: 0.85, bounce: 0.12, delay }
      );
      controls.then(clear, clear);
    };

    const io = new IntersectionObserver(([entry]) => {
      io.disconnect();
      if (entry.boundingClientRect.top < innerHeight * 0.9) return;
      armed = true;
      el.style.transform = 'translateY(105%)';
      stopView = inView(el.parentElement, () => show(false), { margin: '0px 0px -10% 0px' });
      stopJump = onRevealSection(() => show(true));
    });
    io.observe(el.parentElement);

    return () => {
      io.disconnect();
      stopView();
      stopJump();
      controls?.stop();
      if (armed) clear();
    };
  }, [delay]);

  return (
    <Tag className={`block overflow-hidden pr-[0.08em] pb-[0.1em] ${className || ''}`}>
      <span ref={inner} className={`block ${innerClassName || ''}`}>
        {children}
      </span>
    </Tag>
  );
}
