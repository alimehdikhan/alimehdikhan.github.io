'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { SPRING } from '../fx/motion';

const iconSpring = { type: 'spring', ...SPRING.ui };
/* both icons sit on the same 18px square; the active one scales/rotates in
   while the other turns the opposite way and shrinks out beneath it */
const layer = { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' };

export function ThemeToggle() {
  /* `theme` can be 'system'; resolvedTheme is what is actually on screen */
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <MagneticButton variant="secondary" style={{ width: '40px', height: '40px', padding: 0 }} aria-label="Toggle Theme">
        <span style={{ opacity: 0 }}>...</span>
      </MagneticButton>
    );
  }

  return (
    <MagneticButton
      variant="secondary"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        width: '40px',
        height: '40px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <span style={{ position: 'relative', display: 'block', width: 18, height: 18 }}>
        <motion.span
          style={layer}
          initial={false}
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0.55, rotate: isDark ? 0 : -90 }}
          transition={iconSpring}
          aria-hidden={isDark ? undefined : true}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </motion.span>
        <motion.span
          style={layer}
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.55 : 1, rotate: isDark ? 90 : 0 }}
          transition={iconSpring}
          aria-hidden={isDark ? true : undefined}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </motion.span>
      </span>
    </MagneticButton>
  );
}
