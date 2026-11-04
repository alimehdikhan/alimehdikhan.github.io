'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight } from '@/components/ui/icons';

/* A "View case study" tag that trails the mouse wherever a click on a
   project scene opens its case study (the title's link covers the scene).
   It takes the scene's colour, and hides over the buttons and Vocaly's demo,
   which keep their own clicks. Mouse only; with reduced motion it sits at
   the pointer instead of trailing it. */
export function ReelCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const tag = ref.current;
    const section = tag?.closest('section');
    if (!tag || !section || !matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let shown = false;
    let raf = 0;
    let look = 0;

    const place = () => {
      tag.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const trail = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      place();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(trail) : 0;
    };
    /* show the tag over a scene's link, in that scene's colour */
    const update = (target) => {
      const scene = target?.closest?.('[data-cursor="case"]')?.closest('.reel-scene');
      if (scene && tag.dataset.scene !== scene.dataset.index) {
        tag.dataset.scene = scene.dataset.index;
        tag.style.setProperty('--tone', scene.style.getPropertyValue('--tone'));
      }
      if (!!scene === shown) return;
      shown = !!scene;
      if (shown) {
        /* appear at the pointer, not sliding over from where it last hid */
        x = tx;
        y = ty;
        place();
      }
      tag.dataset.show = String(shown);
    };
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      update(e.target);
      if (still) {
        x = tx;
        y = ty;
        place();
      } else if (!raf) raf = requestAnimationFrame(trail);
    };
    const leave = () => update(null);
    /* the reel slides under a mouse that stays put, so look again on scroll */
    const scroll = () => {
      if (look || !tx) return;
      look = requestAnimationFrame(() => {
        look = 0;
        update(document.elementFromPoint(tx, ty));
      });
    };

    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', scroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(look);
    };
  }, []);

  return (
    <div ref={ref} className="reel-cursor" data-show="false" aria-hidden="true">
      <span className="reel-cursor-tag">
        View case study
        <ArrowRight />
      </span>
    </div>
  );
}
