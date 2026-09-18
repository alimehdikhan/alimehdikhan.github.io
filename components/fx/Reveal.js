'use client';
import { useEffect, useRef } from 'react';

// Content is visible in static HTML. Only animate after intersection, so a
// failed script never leaves a heading or the contact form hidden.
export function Reveal({ as = 'div', className = '', stagger, rise = true, style, children, ...rest }) {
  const ref = useRef(null);
  const Tag = as;
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.IntersectionObserver || className.includes('head')) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let animation;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      animation = el.animate([
        { opacity: 0.65, transform: !media.matches && rise ? 'translateY(10px)' : 'none' },
        { opacity: 1, transform: 'none' },
      ], { duration: media.matches ? 180 : 420, easing: 'cubic-bezier(.2,0,0,1)' });
    }, { rootMargin: `0px 0px -${Math.round(innerHeight * 0.15)}px 0px`, threshold: 0 });
    observer.observe(el);
    return () => { observer.disconnect(); animation?.cancel(); };
  }, [className, rise]);
  return <Tag ref={ref} className={`rev ${className}`.trim()} style={style} {...rest}>{children}</Tag>;
}
