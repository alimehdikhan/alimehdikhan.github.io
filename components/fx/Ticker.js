'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { SkillLogo } from '../Skills';

/* Tech-stack marquee. Scroll velocity speeds it up; hover and focus hold it;
   clicking the strip (or Enter/Space while focused) toggles a persistent
   pause. Reduced motion leaves it still. */
export function Ticker({ items }) {
  const track = useRef(null);
  const root = useRef(null);
  const pause = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0, x = 0, width = 1, visible = false, velocity = 0, lastScroll = scrollY, lastTime = performance.now();
    const measure = () => { width = track.current.scrollWidth / 2; };
    const render = (time) => {
      frame = 0;
      if (document.hidden || !visible || media.matches) return;
      const dt = Math.min(time - last || 16, 40);
      last = time;
      velocity *= Math.exp(-dt / 220);
      if (!pause.current) {
        x = (x - dt * 0.025 * (1 + Math.min(velocity / 900, 4))) % width;
        track.current.style.transform = `translate3d(${x}px,0,0)`;
      }
      frame = requestAnimationFrame(render);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (media.matches) { track.current.style.transform = 'none'; return; }
      if (!document.hidden && visible) { last = 0; frame = requestAnimationFrame(render); }
    };
    const scroll = () => {
      const now = performance.now();
      velocity = (Math.abs(scrollY - lastScroll) / Math.max(now - lastTime, 16)) * 1000;
      lastScroll = scrollY;
      lastTime = now;
    };
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    measure();
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    io.observe(root.current);
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', sync);
    media.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', sync);
      media.removeEventListener('change', sync);
    };
  }, []);

  const toggle = () => {
    pause.current = !paused;
    setPaused(!paused);
  };

  return (
    /* The strip pauses on hover; clicking it toggles a persistent pause for
       pointer users. Keyboard and assistive tech get a real toggle button,
       shown on hover or focus (and while paused). */
    <div
      ref={root}
      onClick={toggle}
      onPointerEnter={() => { pause.current = true; }}
      onPointerLeave={() => { pause.current = paused; }}
      className="group relative cursor-pointer"
    >
      <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div ref={track} className="flex w-max gap-2 will-change-transform" aria-hidden="true">
          {[...items, ...items].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[15px] font-medium whitespace-nowrap shadow-soft"
            >
              <SkillLogo name={item} size={16} />
              {item}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Pause tech stack marquee"
        aria-pressed={paused}
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        onFocus={() => { pause.current = true; }}
        onBlur={() => { pause.current = paused; }}
        className={`absolute top-1/2 right-4 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-card shadow-soft transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 ${paused ? 'opacity-100' : 'opacity-0'}`}
      >
        {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
