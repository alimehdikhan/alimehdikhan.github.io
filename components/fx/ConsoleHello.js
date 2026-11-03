'use client';

import { useEffect } from 'react';
import { RESUME } from '../../data/resume';

/* a hello for whoever opens the developer console */
export function ConsoleHello() {
  useEffect(() => {
    if (window.__amkHello) return;
    window.__amkHello = true;
    console.log(
      '%cAMK.',
      'font: 700 32px/1.1 system-ui, sans-serif; color: #d5f66b; background: #090a0a; padding: 10px 18px; border-radius: 10px;'
    );
    console.log(
      `%cHi, fellow developer. This site is open source: ${RESUME.github}/alimehdikhan.github.io\nPress ⌘K (Ctrl+K) to jump anywhere. Hiring? ${RESUME.email}`,
      'font: 13px/1.7 system-ui, sans-serif; color: #a0a4a0;'
    );
  }, []);
  return null;
}
