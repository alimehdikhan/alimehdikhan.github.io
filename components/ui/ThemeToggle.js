'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from '@/components/ui/icons';
import { Button } from './button';
import { SPRING } from '../fx/motion';
import { switchTheme } from '../fx/themeSwitch';

const iconSpring = { type: 'spring', ...SPRING.ui };

export function ThemeToggle() {
  /* `theme` can be 'system'; resolvedTheme is what is actually on screen */
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Button
      variant="glass"
      size="icon"
      className="overflow-hidden"
      data-theme-toggle
      /* the new theme opens out of the button itself */
      onClick={() => switchTheme(isDark ? 'light' : 'dark', setTheme)}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Toggle theme'}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          className="grid place-items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={iconSpring}
          aria-hidden="true"
        >
          {isDark ? <Moon /> : <Sun />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
