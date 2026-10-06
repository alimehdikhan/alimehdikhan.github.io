'use client';

import * as React from 'react';
import { animate } from 'motion';
import { useReducedMotion } from 'motion/react';
import { Card } from './card';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1];
/* where the wash waits, per edge, as [x, y] */
const OFFSET = {
  left: ['-101%', '0%'],
  right: ['101%', '0%'],
  top: ['0%', '-101%'],
  bottom: ['0%', '101%'],
};

function edgeOf(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  if (Math.abs(x) > Math.abs(y)) return x < 0 ? 'left' : 'right';
  return y < 0 ? 'top' : 'bottom';
}

/* Directional hover: a soft lime wash slides in from the edge the cursor
   entered and leaves through the edge it exits. Mouse only; under reduced
   motion the wash just fades. */
export const DirectionalCard = React.forwardRef(function DirectionalCard({ className, children, lift = true, ...props }, ref) {
  const wash = React.useRef(null);
  const controls = React.useRef(null);
  const reduce = useReducedMotion();

  const run = (keyframes, options) => {
    controls.current?.stop();
    controls.current = animate(wash.current, keyframes, options);
  };

  const onEnter = (e) => {
    if (e.pointerType !== 'mouse' || !wash.current) return;
    if (reduce) {
      run({ x: '0%', y: '0%', opacity: [0, 1] }, { duration: 0.2 });
      return;
    }
    const [x, y] = OFFSET[edgeOf(e)];
    run({ x: [x, '0%'], y: [y, '0%'], opacity: 1 }, { duration: 0.45, ease: EASE });
  };

  const onLeave = (e) => {
    if (!wash.current) return;
    if (reduce || e.pointerType !== 'mouse') {
      run({ opacity: 0 }, { duration: 0.2 });
      return;
    }
    const [x, y] = OFFSET[edgeOf(e)];
    run({ x, y }, { duration: 0.4, ease: EASE });
  };

  return (
    <Card
      ref={ref}
      interactive={lift}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={cn('relative isolate overflow-hidden hover:border-link/40', className)}
      {...props}
    >
      <div
        ref={wash}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgb(var(--glow)/0.16),rgb(var(--glow)/0.03)_70%)]"
        style={{ transform: 'translateX(-101%)' }}
      />
      {children}
    </Card>
  );
});
