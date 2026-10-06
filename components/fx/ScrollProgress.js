'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { SPRING } from './motion';

/* 2px lime page-progress hairline pinned to the top edge; spring-smoothed
   so wheel steps read as a glide, and scaled on the compositor. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, SPRING.scroll);
  return <motion.div id="prog" aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-primary shadow-[0_0_12px_rgb(var(--glow)/0.6)]" style={{ scaleX: smooth, originX: 0 }} />;
}
