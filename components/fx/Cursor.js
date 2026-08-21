'use client';

import { useEffect, useRef } from 'react';

/* Blend-mode cursor: instant dot + trailing ring that grows over
   interactive elements. Hidden entirely on coarse pointers. */
export function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduce) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let rafId;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    };
    const onOver = (e) => {
      if (e.target.closest && e.target.closest('a,button,[role="button"],input,textarea,select,label')) {
        ring.classList.add('big');
      }
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest('a,button,[role="button"],input,textarea,select,label')) {
        ring.classList.remove('big');
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
    };
  }, []);

  return (
    <>
      <div className="cur" ref={dotRef} aria-hidden="true" />
      <div className="cur-r" ref={ringRef} aria-hidden="true" />
    </>
  );
}
