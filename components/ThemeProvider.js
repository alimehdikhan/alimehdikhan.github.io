'use client';

import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

/* the colour at the very top of the page (the hero's surface) per theme */
const TOP_COLOR = { dark: '#090a0a', light: '#ffffff' };

/* Phone browsers paint their toolbar from theme-color. The site picks its
   own theme (dark by default, or the visitor's choice) rather than the OS
   setting, so the tag follows the theme on screen instead of a media query. */
function ThemeColor() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const color = TOP_COLOR[resolvedTheme];
    if (!color) return;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.removeAttribute('media');
      meta.setAttribute('content', color);
    });
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props}>
      <ThemeColor />
      {children}
    </NextThemesProvider>
  );
}
