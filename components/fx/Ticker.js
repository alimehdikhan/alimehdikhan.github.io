'use client';

import { useEffect, useRef } from 'react';

/* Marquee strip that drifts continuously and gains momentum from scroll velocity. */
export function Ticker({ items }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const track = trackRef.current;
    if (!track) return undefined;

    let off = 0;
    const base = 0.55;
    let extra = 0;
    let lastY = window.scrollY;
    let w = 0;
    let rafId;

    const onScroll = () => {
      extra += Math.min(Math.abs(window.scrollY - lastY) * 0.05, 3);
      lastY = window.scrollY;
    };
    const onResize = () => {
      w = 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (!w) w = track.scrollWidth / 2;
      extra *= 0.94;
      off = (off + base + extra) % (w || 1);
      track.style.transform = `translateX(${-off}px)`;
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
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
