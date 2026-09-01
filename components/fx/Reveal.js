'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useWillChange } from 'framer-motion';
import { BLOCK_T, INSTANT, VIEWPORT } from './motion';
import { onRevealSection } from './revealSection';
import { useLoaded } from './useLoaded';

/* Fade-and-rise once the element scrolls into view.

   - Opacity is fast (0.4s) and the 24px rise is slow (0.8s), so the travel is
     actually seen rather than spent while the block is still transparent.
   - `stagger` turns the block into an orchestrator: the block itself only
     fades, and motion children carrying the shared ITEM variants land into
     it one after another. Nested motion children with their own `variants`
     inherit hidden/visible automatically.
   - `rise={false}` keeps the block's own fade but drops its rise, for blocks
     whose children carry the movement (section heads).
   - Observers are held until the preloader curtain lifts (useLoaded), so a
     hash load rises with the curtain instead of finishing behind it.
   - The `rev` class stays on so the reduced-motion stylesheet (and the
     <noscript> fallback) can pin it visible before hydration.
   - `revealSection()` still snaps a section visible for the non-animated
     anchor fallback; animated travel lets the choreography play on arrival. */

const blockVariants = (stagger, rise) => ({
  hidden: { opacity: 0, y: rise && !stagger ? 24 : 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: stagger ? { ...BLOCK_T, staggerChildren: stagger, delayChildren: 0.08 } : BLOCK_T,
  },
});

export function Reveal({ as = 'div', className = '', stagger = 0, rise = true, style, children, ...rest }) {
  const Tag = motion[as];
  const ref = useRef(null);
  const [forced, setForced] = useState(false);
  const loaded = useLoaded();
  const willChange = useWillChange();
  const memo = useRef(null);
  if (!memo.current || memo.current.stagger !== stagger || memo.current.rise !== rise) {
    memo.current = { stagger, rise, variants: blockVariants(stagger, rise) };
  }

  useEffect(
    () =>
      onRevealSection((hash) => {
        try {
          if (ref.current && ref.current.closest(hash)) setForced(true);
        } catch (e) {
          /* invalid selector — ignore */
        }
      }),
    []
  );

  return (
    <Tag
      ref={ref}
      className={`rev ${className}`.trim()}
      variants={memo.current.variants}
      initial="hidden"
      whileInView={loaded ? 'visible' : undefined}
      animate={forced ? 'visible' : undefined}
      viewport={VIEWPORT}
      transition={forced ? INSTANT : undefined}
      style={{ willChange, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
