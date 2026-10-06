'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Card } from '../card';
import { cn } from '@/lib/utils';

/* Aceternity-style card spotlight on top of the shadcn Card. A soft lime
   radial follows the cursor across the surface; with `borderGlow`, a second,
   brighter highlight rides the 1px border so the edge nearest the cursor
   lights up. Both are fixed-size gradients moved with transforms (no
   repainting gradients per move) and only appear for a mouse. Touch and
   keyboard users get the plain card with its border and lift. */
export const SpotlightCard = React.forwardRef(function SpotlightCard(
  { className, children, radius = 360, borderGlow = false, onPointerMove, ...props },
  ref
) {
  const px = useMotionValue(-1000);
  const py = useMotionValue(-1000);
  const surfaceX = useTransform(px, (v) => v - radius);
  const surfaceY = useTransform(py, (v) => v - radius);
  const ringX = useTransform(px, (v) => v - 140);
  const ringY = useTransform(py, (v) => v - 140);

  const handleMove = (e) => {
    onPointerMove?.(e);
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };

  return (
    <Card
      ref={ref}
      onPointerMove={handleMove}
      className={cn('group/spot relative isolate overflow-hidden hover:border-link/30', className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      >
        <motion.div
          className="absolute top-0 left-0 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.13),transparent)]"
          style={{ x: surfaceX, y: surfaceY, width: radius * 2, height: radius * 2 }}
        />
      </div>
      {borderGlow && (
        <div
          aria-hidden="true"
          className="border-glow pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        >
          <motion.div
            className="absolute top-0 left-0 size-[280px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.95),rgb(var(--glow)/0.25)_55%,transparent)]"
            style={{ x: ringX, y: ringY }}
          />
        </div>
      )}
      {children}
    </Card>
  );
});
