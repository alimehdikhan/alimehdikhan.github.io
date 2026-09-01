'use client';

import { useEffect, useState } from 'react';

/* Minute-accurate local time in a leaf component, so ticks never re-render
   the section that shows it. Aligns to the minute boundary and skips ticks
   in a hidden tab. Renders an em dash until hydrated. */
export function LocalClock({ timeZone = 'Asia/Kolkata' }) {
  const [clock, setClock] = useState('—');

  useEffect(() => {
    let interval = 0;
    let first = 0;
    const tick = () => {
      if (document.hidden) return;
      setClock(
        new Date().toLocaleTimeString('en-GB', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    tick();
    first = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60000);
    }, 60000 - (Date.now() % 60000) + 50);
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [timeZone]);

  return <span suppressHydrationWarning>{clock}</span>;
}
