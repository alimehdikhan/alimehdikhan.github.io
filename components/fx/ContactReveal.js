'use client';

import { useEffect } from 'react';
import { loadGsap } from './gsap';

/* Contact: the lime panel expands from a smaller rounded window to its
   full size as it scrolls into view (GSAP ScrollTrigger, scrubbed), and its
   content fades in over the last part of the expansion so no half-clipped
   text ever shows. GSAP owns the panel's clip-path and the .contact-inner
   wrapper's opacity; the elements inside are revealed by Motion.
   Phones and reduced motion: the panel is simply there. */
export function ContactReveal() {
  useEffect(() => {
    let disposed = false;
    let mm;
    loadGsap()
      .then(({ gsap }) => {
        if (disposed) return;
        const panel = document.querySelector('#contact .contact-panel');
        const inner = panel?.querySelector('.contact-inner');
        if (!panel || !inner) return;
        mm = gsap.matchMedia();
        mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: panel, start: 'top 98%', end: 'top 30%', scrub: 0.6 },
          });
          tl.fromTo(
            panel,
            { clipPath: 'inset(18% 32% 18% 32% round 160px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 40px)', ease: 'power2.out', duration: 1 },
            0
          ).fromTo(inner, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 0.55);
        });
      })
      .catch(() => {});
    return () => {
      disposed = true;
      mm?.revert();
    };
  }, []);
  return null;
}
