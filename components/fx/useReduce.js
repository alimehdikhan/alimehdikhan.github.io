'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/* The reduced-motion preference, safe for hydration: false until mounted, so
   the first client render matches the server HTML, then it flips. Use it for
   anything that changes what is rendered (not just how it moves); elements
   whose initial state depends on it should be keyed on it so they remount. */
export function useReduce() {
  const pref = useReducedMotion();
  const [on, setOn] = useState(false);
  useEffect(() => setOn(Boolean(pref)), [pref]);
  return on;
}
