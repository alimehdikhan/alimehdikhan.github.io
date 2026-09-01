'use client';

import { useEffect, useState } from 'react';

/* True once the preloader curtain has lifted (html.is-loading is gone).
   Reveals hold their observers until then, so blocks already in the
   viewport on a hash load rise with the curtain instead of finishing
   behind it. Server and reduced-motion (no is-loading class) resolve to
   true immediately, so markup is unchanged and the CSS pin stays the
   fallback. */
export function useLoaded() {
  const [loaded, setLoaded] = useState(() =>
    typeof document === 'undefined' ? true : !document.documentElement.classList.contains('is-loading')
  );

  useEffect(() => {
    if (loaded) return undefined;
    const html = document.documentElement;
    if (!html.classList.contains('is-loading')) {
      setLoaded(true);
      return undefined;
    }
    const mo = new MutationObserver(() => {
      if (!html.classList.contains('is-loading')) {
        setLoaded(true);
        mo.disconnect();
      }
    });
    mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, [loaded]);

  return loaded;
}
