'use client';

import { useEffect } from 'react';
import { loadGsap } from './gsap';

/* Experience timeline (GSAP ScrollTrigger): the rail draws downward with
   scroll, and each node pops in as the rail reaches it. The cards
   themselves are revealed by Motion (<Reveal>), so the two never share an
   element. Reduced motion: the rail and nodes are simply there. */
export function TimelineMotion() {
  useEffect(() => {
    let disposed = false;
    let mm;
    loadGsap()
      .then(({ gsap }) => {
        if (disposed) return;
        const section = document.getElementById('experience');
        const line = section?.querySelector('.timeline-line');
        const list = section?.querySelector('.timeline-list');
        if (!line || !list) return;
        mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: list, start: 'top 72%', end: 'bottom 62%', scrub: 0.5 },
            }
          );
          section.querySelectorAll('.timeline-node').forEach((node) => {
            gsap.from(node, {
              scale: 0,
              duration: 0.55,
              ease: 'back.out(2.4)',
              scrollTrigger: { trigger: node, start: 'top 72%', toggleActions: 'play none none reverse' },
            });
          });
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
