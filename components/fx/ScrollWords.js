'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/* one word, dim until the reading line reaches its share of the paragraph */
function Word({ progress, from, to, children }) {
  const opacity = useTransform(progress, [from, to], [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/* A paragraph that reads itself in: words brighten one after another as it
   scrolls up the screen, done by the time its last line is a little above
   the middle. Scroll-linked, so it follows the reader both ways. The server
   HTML, and reduced motion, show the plain paragraph at full strength. */
export function ScrollWords({ text, className }) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] });

  useEffect(() => {
    setLive(!matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {live
        ? words.map((word, i) => (
            <span key={i}>
              <Word progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length}>
                {word}
              </Word>{' '}
            </span>
          ))
        : text}
    </p>
  );
}
