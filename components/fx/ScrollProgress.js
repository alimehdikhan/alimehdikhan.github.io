'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { SPRING } from './motion';

/* 1px amber page-progress hairline pinned to the top edge; spring-smoothed
   so wheel steps read as a glide, and scaled on the compositor. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, SPRING.scroll);
  return <motion.div id="prog" aria-hidden="true" style={{ scaleX: smooth, originX: 0 }} />;
}
