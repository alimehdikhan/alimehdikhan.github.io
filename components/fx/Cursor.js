'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { EASE, SPRING } from './motion';

const HOT = 'a,button,[role="button"],label';
const TEXT = 'input,textarea,select';
const centre = (_, generated) => `translate(-50%, -50%) ${generated}`;
const RING = {
  idle: 0.46,
  big: 1,
  text: 0.25,
};

/* Blend-mode cursor: instant dot + trailing ring. The ring has a fixed 74px
   box and only ever changes `scale` (compositor), so hovering a link no
   longer pays a width/height layout tween. It stays hidden until the
   pointer has actually moved, hides when the pointer leaves the window,
   shrinks over text fields, and acknowledges presses. Not mounted on coarse
   pointers or under reduced motion. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('idle');
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const modeRef = useRef('idle');
  const visibleRef = useRef(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(mx, SPRING.trail);
  const ry = useSpring(my, SPRING.trail);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;
    setEnabled(true);

    const show = (on) => {
      if (visibleRef.current !== on) {
        visibleRef.current = on;
        setVisible(on);
      }
    };
    const onMove = (e) => {
      if (!visibleRef.current) {
        /* first sighting: jump both layers there so the ring does not
           spring in from the corner */
        mx.jump(e.clientX);
        my.jump(e.clientY);
        rx.jump(e.clientX);
        ry.jump(e.clientY);
        show(true);
        return;
      }
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    /* pointerover fires for every element entered, including body when
       leaving a link, so one listener + a ref dedupes hover state without
       the out/over double render */
    const onOver = (e) => {
      const t = e.target;
      const closest = t && t.closest ? (sel) => t.closest(sel) : () => null;
      const next = closest(TEXT) ? 'text' : closest(HOT) ? 'big' : 'idle';
      if (next !== modeRef.current) {
        modeRef.current = next;
        setMode(next);
      }
    };
    const onOut = (e) => {
      if (!e.relatedTarget) show(false);
    };
    const onBlur = () => show(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('blur', onBlur);
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [mx, my, rx, ry]);

  if (!enabled) return null;

  const ringScale = RING[mode] * (pressed ? 0.82 : 1);
  const ringOpacity = !visible ? 0 : mode === 'text' ? 0.5 : 1;

  return (
    <>
      <motion.div
        className="cur"
        aria-hidden="true"
        style={{ x: mx, y: my }}
        transformTemplate={centre}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 1.6 : 1 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
      <motion.div
        className="cur-r"
        aria-hidden="true"
        style={{ x: rx, y: ry }}
        transformTemplate={centre}
        initial={{ opacity: 0, scale: RING.idle }}
        animate={{
          opacity: ringOpacity,
          scale: ringScale,
          borderColor: mode === 'big' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.55)',
        }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </>
  );
}
