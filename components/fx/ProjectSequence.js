'use client';

import { useEffect } from 'react';
import { loadGsap } from './gsap';

const NAV = 88; // sticky top for the first card, clear of the 56px nav
const PEEK = 28; // how much of each earlier card stays visible above the next

/* Scroll-driven featured-project sequence (GSAP ScrollTrigger, native
   scrolling throughout).
   Desktop: cards are sticky and stack; as the next card rises over the
   current one, the current one scales back and dims (scrubbed). Each card's
   artwork wipes in and its details stagger up the first time it arrives.
   Stacking only switches on when every card fits under the nav, so text is
   never trapped off screen; otherwise the cards just flow.
   Phones and short screens: a plain vertical list with a simple entrance.
   Reduced motion: nothing runs and every card is static. */
export function ProjectSequence() {
  useEffect(() => {
    let disposed = false;
    let mm;

    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (disposed) return;
        const section = document.getElementById('projects');
        const stack = section?.querySelector('.project-stack');
        if (!stack) return;
        const slots = [...stack.querySelectorAll('.project-slot')];

        mm = gsap.matchMedia();
        mm.add(
          {
            desktop: '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)',
            compact: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference), (max-height: 699.98px) and (prefers-reduced-motion: no-preference)',
          },
          (context) => {
            if (context.conditions.compact) {
              slots.forEach((slot) => {
                gsap.from(slot, {
                  y: 32,
                  opacity: 0,
                  duration: 0.8,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: slot, start: 'top 88%', toggleActions: 'play none none none' },
                });
              });
              return undefined;
            }

            /* reveals: once per card, on arrival */
            slots.forEach((slot) => {
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: slot.querySelector('.project-marker'),
                  start: 'top 80%',
                  toggleActions: 'play none none none',
                },
              });
              tl.from(slot.querySelector('.project-art-wrap'), {
                clipPath: 'inset(0% 0% 100% 0%)',
                duration: 1.1,
                ease: 'power3.inOut',
                clearProps: 'clipPath',
              })
                .from(slot.querySelector('.project-art-inner'), { scale: 1.18, duration: 1.4, ease: 'power3.out' }, 0)
                .from(
                  slot.querySelectorAll('.project-reveal > *'),
                  { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06, clearProps: 'opacity,transform' },
                  0.25
                );
            });

            /* stacking: rebuilt when the viewport changes whether cards fit */
            let stacking = null;
            let fitsNow = null;
            const build = () => {
              const tallest = Math.max(...slots.map((s) => s.offsetHeight));
              const fits = tallest + NAV + (slots.length - 1) * PEEK + 24 <= window.innerHeight;
              if (fits === fitsNow) return;
              fitsNow = fits;
              stacking?.revert();
              stack.classList.toggle('is-stacked', fits);
              if (!fits) {
                ScrollTrigger.refresh();
                return;
              }
              /* 3D hand-off between consecutive cards, scrubbed to the same
                 scroll range: the incoming card tilts up out of perspective
                 as it rises; the outgoing one tips back, scales and dims */
              stacking = gsap.context(() => {
                slots.forEach((slot) => {
                  gsap.set(slot.querySelector('.project-scaler'), { transformPerspective: 1400, transformOrigin: '50% 0%' });
                });
                slots.slice(1).forEach((slot, n) => {
                  const range = {
                    trigger: slot.querySelector('.project-marker'),
                    start: 'top bottom',
                    end: `top ${NAV + (n + 1) * PEEK}px`,
                    scrub: 0.5,
                  };
                  gsap.fromTo(
                    slot.querySelector('.project-scaler'),
                    { rotateX: 16, scale: 0.94 },
                    { rotateX: 0, scale: 1, ease: 'power1.out', scrollTrigger: range }
                  );
                  gsap.to(slots[n].querySelector('.project-scaler'), {
                    rotateX: -7,
                    scale: 0.9,
                    opacity: 0.55,
                    ease: 'power1.in',
                    immediateRender: false,
                    scrollTrigger: { ...range },
                  });
                });
              });
              ScrollTrigger.refresh();
            };

            let timer = 0;
            const onResize = () => {
              clearTimeout(timer);
              timer = setTimeout(build, 150);
            };
            build();
            window.addEventListener('resize', onResize);

            return () => {
              clearTimeout(timer);
              window.removeEventListener('resize', onResize);
              stacking?.revert();
              stack.classList.remove('is-stacked');
            };
          }
        );
      })
      .catch(() => {
        /* static cards remain */
      });

    return () => {
      disposed = true;
      mm?.revert();
    };
  }, []);

  return null;
}
