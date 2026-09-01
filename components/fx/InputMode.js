'use client';

import { useEffect } from 'react';

/* Flips the `using-mouse` class so focus rings only show for keyboard users. */
export function InputMode() {
  useEffect(() => {
    const onMouseDown = () => document.body.classList.add('using-mouse');
    const onKeyDown = (e) => {
      if (e.key === 'Tab') document.body.classList.remove('using-mouse');
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
