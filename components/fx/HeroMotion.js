'use client';
import { useEffect } from 'react';

export function HeroMotion() {
  useEffect(() => {
    let dead = false;
    let mm;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;
    Promise.all([import('gsap'), import('gsap/SplitText')]).then(([{gsap}, {SplitText}]) => {
      if (dead) return;
      gsap.registerPlugin(SplitText);
      mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const name = document.querySelector('.first-name');
        const split = SplitText.create(name, { type: 'chars', aria: 'auto' });
        gsap.from(split.chars, { yPercent: 75, opacity: .2, duration: .36, stagger: .022, ease: 'power3.out', onComplete: () => split.revert() });
        const label = document.querySelector('.hero-label');
        const original = label.textContent;
        const labelBox = label.getBoundingClientRect();
        label.style.width = `${labelBox.width}px`;
        label.style.height = `${labelBox.height}px`;
        label.style.contain = 'strict';
        const restoreLabel = () => {
          label.textContent = original;
          label.style.removeProperty('width');
          label.style.removeProperty('height');
          label.style.removeProperty('contain');
        };
        const progress = { value: 0 };
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        label.setAttribute('aria-label', original);
        gsap.to(progress, { value: 1, duration: .5, ease: 'none', onUpdate: () => {
          label.textContent = [...original].map((c,i) => c === ' ' || i < progress.value*original.length ? c : chars[Math.floor(Math.random()*chars.length)]).join('');
        }, onComplete: restoreLabel });
        const portrait = document.querySelector('.portrait');
        const displacement = document.querySelector('#portrait-displacement');
        const hover = () => {
          if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
          gsap.fromTo(displacement, {attr:{scale:0}}, {attr:{scale:5},duration:.24,repeat:1,yoyo:true,ease:'sine.inOut'});
        };
        portrait.addEventListener('pointerenter',hover);
        return () => { portrait.removeEventListener('pointerenter',hover); restoreLabel(); split.revert(); displacement.setAttribute('scale','0'); };
      });
    }).catch(() => { /* The unmodified static headline remains available. */ });
    return () => {dead=true;mm?.revert();};
  }, []);
  return null;
}
