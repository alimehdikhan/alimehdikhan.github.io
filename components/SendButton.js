'use client';

import { motion } from 'motion/react';
import { Send } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { cn } from '@/lib/utils';

/* Submit button. While sending, a light sweeps through it, the paper plane
   flies in place and the label animates its dots. It stays focusable
   (aria-disabled) so keyboard focus never jumps, and the form ignores
   repeat submissions. The success scene itself lives in ContactSuccess.
   Under reduced motion the sweep, flight and dots are static. */
export function SendButton({ status, reduce, anchorRef }) {
  const sending = status === 'sending';

  return (
    <div ref={anchorRef} className="inline-flex self-start">
      <Magnetic>
        <Button asChild size="lg" className={cn('relative overflow-hidden', sending && 'cursor-progress')}>
          <button type="submit" data-status={status || 'idle'} aria-disabled={sending} aria-busy={sending}>
            {sending && !reduce && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgb(255_255_255/0.55),transparent)]"
                initial={{ x: '-120%' }}
                animate={{ x: '320%' }}
                transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.15 }}
              />
            )}
            <motion.span
              aria-hidden="true"
              className="inline-flex"
              animate={sending && !reduce ? { x: [0, 3, 0], y: [0, -3, 0], rotate: [0, -8, 0] } : { x: 0, y: 0, rotate: 0 }}
              transition={sending && !reduce ? { duration: 0.9, ease: 'easeInOut', repeat: Infinity } : { duration: 0.2 }}
            >
              <Send />
            </motion.span>
            <span className="relative">
              {sending ? 'Sending' : 'Send Message'}
              {sending && (
                <span aria-hidden="true" className="inline-flex w-[1.1em] justify-start">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0.25 }}
                      animate={reduce ? { opacity: 1 } : { opacity: [0.25, 1, 0.25] }}
                      transition={reduce ? { duration: 0 } : { duration: 1, repeat: Infinity, delay: i * 0.18 }}
                    >
                      .
                    </motion.span>
                  ))}
                </span>
              )}
            </span>
          </button>
        </Button>
      </Magnetic>
    </div>
  );
}
