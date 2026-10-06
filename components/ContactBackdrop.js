'use client';

import { useEffect, useRef } from 'react';

/* Texture and light behind the contact panel: a field of ink dots that fades
   out from the top-right corner and a soft white light that follows a mouse
   across the panel. It sits behind the content (the panel is its own stacking
   context) and ignores the pointer. The light is mouse-only and off under
   reduced motion; the dots are static. */
export function ContactBackdrop() {
  const light = useRef(null);

  useEffect(() => {
    const el = light.current;
    const panel = el?.closest('.contact-panel');
    if (!el || !panel) return undefined;
    const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    const onMove = (e) => {
      if (!allowed.matches || e.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = panel.getBoundingClientRect();
        el.style.setProperty('--sx', `${e.clientX - r.left}px`);
        el.style.setProperty('--sy', `${e.clientY - r.top}px`);
        el.style.opacity = '1';
      });
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };
    panel.addEventListener('pointermove', onMove, { passive: true });
    panel.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      panel.removeEventListener('pointermove', onMove);
      panel.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
      <div className="absolute inset-0 [background-image:radial-gradient(rgb(9_10_10/0.2)_1.2px,transparent_1.7px)] [background-size:26px_26px] [mask-image:radial-gradient(70%_60%_at_90%_4%,#000,transparent)]" />
      <div
        ref={light}
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{ background: 'radial-gradient(520px circle at var(--sx, 50%) var(--sy, 30%), rgb(255 255 255 / 0.45), transparent 70%)' }}
      />
    </div>
  );
}
