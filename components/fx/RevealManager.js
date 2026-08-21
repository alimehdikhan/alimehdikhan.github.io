'use client';

import { useEffect } from 'react';

/* Scroll reveals + counters. Observes every `.rev` element once, adds `.in`,
   and eases any nested `[data-to]` counters up from zero. Also flips the
   `using-mouse` focus-ring class the old page handled. */
export function RevealManager() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          if (!reduce) {
            en.target.querySelectorAll('[data-to]').forEach((el) => {
              const to = +el.dataset.to;
              const suffix = el.dataset.suffix || '';
              const t0 = performance.now();
              const step = (now) => {
                const k = Math.min((now - t0) / 1100, 1);
                el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + (k === 1 ? suffix : '');
                if (k < 1) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
            });
          }
          io.unobserve(en.target);
        });
      },
      /* generous margins pre-reveal content just outside the viewport so
         fast scrolling never shows blank blocks */
      { rootMargin: '160px 0px 120px 0px' }
    );

    document.querySelectorAll('.rev').forEach((el) => io.observe(el));

    const onMouseDown = () => document.body.classList.add('using-mouse');
    const onKeyDown = (e) => {
      if (e.key === 'Tab') document.body.classList.remove('using-mouse');
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      io.disconnect();
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
