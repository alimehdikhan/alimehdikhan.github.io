'use client';

import { useEffect } from 'react';
import { animate } from 'framer-motion';

// Event-driven springs add no continuous animation loop or React re-renders.
// Animate card surfaces and icon children so GSAP's rail/magnets retain
// ownership of their transforms.
export function MicroInteractions() {
  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const cleanups = [];
    const controls = new Map();
    const spring = { type: 'spring', stiffness: 440, damping: 30, mass: .65 };
    const play = (el, values, options = spring) => {
      controls.get(el)?.stop();
      controls.set(el, animate(el, values, options));
    };
    const bind = (host, target, over, out) => {
      const enter = e => {
        if (reduced.matches || (e.type === 'pointerenter' && (!fine.matches || e.pointerType !== 'mouse'))) return;
        play(target, over);
      };
      const leave = () => play(target, out, reduced.matches ? { duration: 0 } : spring);
      host.addEventListener('pointerenter', enter);
      host.addEventListener('pointerleave', leave);
      host.addEventListener('pointercancel', leave);
      host.addEventListener('focusin', enter);
      host.addEventListener('focusout', leave);
      cleanups.push(() => {
        host.removeEventListener('pointerenter', enter);
        host.removeEventListener('pointerleave', leave);
        host.removeEventListener('pointercancel', leave);
        host.removeEventListener('focusin', enter);
        host.removeEventListener('focusout', leave);
        controls.get(target)?.stop();
        target.style.removeProperty('transform');
        target.style.removeProperty('box-shadow');
      });
    };
    document.querySelectorAll('.skill-grid > span').forEach(el => bind(el, el, { y: -2, scale: 1.025 }, { y: 0, scale: 1 }));
    document.querySelectorAll('#certifications .hair > div').forEach(el => bind(el, el, { y: -3 }, { y: 0 }));
    document.querySelectorAll('.hero-socials .tile').forEach(el => {
      const icon = el.querySelector('img,svg');
      if (icon) bind(el, icon, { scale: 1.12, rotate: -5 }, { scale: 1, rotate: 0 });
    });
    document.querySelectorAll('.form .field').forEach(el => {
      const number = el.querySelector('label i');
      if (number) bind(el, number, { x: 3, scale: 1.08 }, { x: 0, scale: 1 });
    });
    document.querySelectorAll('.project-action, .nav-resume, .foot .up').forEach(el => {
      const icon=el.querySelector('svg,.arr');
      if(icon) bind(el,icon,{y:-2},{y:0});
    });
    const reset = () => {
      controls.forEach((control, el) => { control.stop(); el.style.removeProperty('transform'); });
      controls.clear();
    };
    const visibility = () => { if(document.hidden) reset(); };
    reduced.addEventListener('change', reset);
    document.addEventListener('visibilitychange', visibility);
    return () => { cleanups.forEach(fn => fn()); reset(); reduced.removeEventListener('change', reset); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return null;
}
