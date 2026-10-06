'use client';
import { Fragment, useEffect, useRef } from 'react';
import { MaskReveal } from './MaskReveal';

const words = (text) =>
  text.split(' ').map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      {i > 0 && ' '}
      <span className="weight-word">
        {[...word].map((char, j) => (
          <span className="weight-letter" key={j}>
            {char}
          </span>
        ))}
      </span>
    </Fragment>
  ));

/* Contact headline: letter weight swells toward a mouse pointer. Mouse on a
   fine pointer only, and never under reduced motion. */
export function VariableContact() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const media = matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)');
    const letters = [...el.querySelectorAll('.weight-letter')];
    let frame = 0;
    let centers = [];
    const reset = () => {
      cancelAnimationFrame(frame);
      letters.forEach((letter) => letter.style.removeProperty('--weight'));
    };
    const enter = () => {
      centers = letters.map((letter) => {
        const r = letter.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    const move = (e) => {
      if (!media.matches || e.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        letters.forEach((letter, i) => {
          const c = centers[i];
          if (!c) return;
          const distance = Math.hypot(e.clientX - c.x, e.clientY - c.y);
          letter.style.setProperty('--weight', Math.round(600 + 200 * Math.max(0, 1 - distance / 160)));
        });
      });
    };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    media.addEventListener('change', reset);
    const visibility = () => {
      if (document.hidden) reset();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      reset();
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
      media.removeEventListener('change', reset);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return (
    <p
      ref={ref}
      className="display max-w-[16ch] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.035em]"
    >
      <span className="sr-only">Let&apos;s build something great together.</span>
      <span aria-hidden="true">
        <MaskReveal delay={0.1}>{words("Let's build something")}</MaskReveal>
        <MaskReveal delay={0.22}>
          <em>{words('great')}</em> {words('together.')}
        </MaskReveal>
      </span>
    </p>
  );
}
