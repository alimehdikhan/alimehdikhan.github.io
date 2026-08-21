'use client';

import { useEffect, useRef } from 'react';
import { RESUME } from '../../data/resume';

/* Name + counter preloader. The `is-loading` class is set on <html> by an
   inline head script before first paint (skipped for reduced motion); this
   component runs the counter and hands off to `is-loaded`, which triggers
   the hero rise/fade choreography. */
export function Preloader() {
  const preRef = useRef(null);
  const numRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    const pre = preRef.current;

    if (!html.classList.contains('is-loading')) {
      html.classList.add('is-loaded');
      return undefined;
    }

    let n = 0;
    let done;
    const iv = setInterval(() => {
      n = Math.min(100, n + Math.random() * 14 + 6);
      if (numRef.current) numRef.current.textContent = (n < 10 ? '0' : '') + Math.floor(n);
      if (barRef.current) barRef.current.style.width = n + '%';
      if (n >= 100) {
        clearInterval(iv);
        done = setTimeout(() => {
          if (pre) pre.classList.add('done');
          html.classList.remove('is-loading');
          html.classList.add('is-loaded');
        }, 260);
      }
    }, 105);

    return () => {
      clearInterval(iv);
      clearTimeout(done);
    };
  }, []);

  return (
    <div id="pre" ref={preRef} aria-hidden="true">
      <div className="word">
        <span>{RESUME.name}</span>
      </div>
      <div className="num" ref={numRef}>
        00
      </div>
      <div className="bar" ref={barRef} />
    </div>
  );
}
