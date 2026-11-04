'use client';

import { useEffect, useRef, useState } from 'react';

/* the exchange recruiters have with Byte most, answered the way it answers */
const QUESTION = 'Is Ali open to work, and how soon could he join?';
const ANSWER = 'Yes: entry-level software and AI/ML roles, in India or abroad, and he can join immediately.';

/* The Byte card's demo: the robot itself beside a short chat that plays once
   on first sight (the question, Byte thinking, its answer). The server HTML
   and reduced motion show the finished exchange. Hovering the card makes
   Byte hop (globals.css, "Projects"). */
export function ByteShowcase() {
  const root = useRef(null);
  /* static: the whole exchange; armed: empty, waiting to be seen;
     asking, typing: the sequence on its way */
  const [state, setState] = useState('static');

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return undefined;
    setState('armed');
    const timers = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timers.push(setTimeout(() => setState('asking'), 150));
        timers.push(setTimeout(() => setState('typing'), 850));
        timers.push(setTimeout(() => setState('static'), 2050));
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={root}
      data-state={state}
      className="byte-demo relative grid h-full grid-cols-[0.75fr_1.25fr] items-center gap-3 overflow-hidden bg-[linear-gradient(160deg,#161c10,#070807_72%)] p-5 text-white sm:gap-5 sm:p-8"
    >
      <div className="absolute top-1/2 left-[18%] size-[62%] -translate-x-1/3 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(213_246_107/0.2),transparent)]" aria-hidden="true" />
      <span className="byte-hop relative block">
        <img
          src="/assets/images/byte.webp"
          alt="Byte, a small white robot with a glowing lime face"
          width="720"
          height="720"
          className="animate-float h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </span>

      <div className="relative flex flex-col gap-2.5 text-[13px] leading-snug sm:text-sm" aria-label="A sample exchange with Byte">
        <p className="bd-q self-end rounded-2xl rounded-br-md bg-[#d5f66b] px-3.5 py-2.5 font-medium text-[#090a0a]">{QUESTION}</p>
        {/* the answer keeps its space while Byte "types", so nothing jumps */}
        <div className="relative self-start">
          <p className="bd-a rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-2.5 text-white/90">{ANSWER}</p>
          <span className="bd-dots absolute top-0 left-0 rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-3" aria-hidden="true">
            <span className="robot-dots flex h-2 items-center gap-1">
              <span className="size-1.5 rounded-full bg-white/70" />
              <span className="size-1.5 rounded-full bg-white/70" />
              <span className="size-1.5 rounded-full bg-white/70" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
