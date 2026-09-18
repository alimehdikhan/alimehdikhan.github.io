'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CursorTrail = dynamic(() => import('./CursorTrail'), { ssr: false });
const HeroShader = dynamic(() => import('./HeroShader'), { ssr: false });

export function ClientEffects() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)');
    let frame;
    let idle;
    const sync = () => {
      setReady(false);
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      if (!media.matches || navigator.maxTouchPoints > 0) return;
      // Two frames put canvas allocation after the initial content paint.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => { idle = setTimeout(() => setReady(true), 200); });
      });
    };
    sync();
    media.addEventListener('change', sync);
    return () => { media.removeEventListener('change', sync); cancelAnimationFrame(frame); clearTimeout(idle); };
  }, []);
  return ready ? <><CursorTrail /><HeroShader /></> : null;
}
