'use client';

import { useEffect, useRef } from 'react';

/* Marquee strip drifting at a constant speed, unaffected by scrolling. */
export function Ticker({ items }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const track = trackRef.current;
    if (!track) return undefined;

    let off = 0;
    const base = 0.55;
    let w = 0;
    let rafId;

    const onResize = () => {
      w = 0;
    };
    window.addEventListener('resize', onResize);

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (!w) w = track.scrollWidth / 2;
      off = (off + base) % (w || 1);
      track.style.transform = `translateX(${-off}px)`;
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="ticker" aria-hidden="true">
      <div className="track" ref={trackRef}>
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
