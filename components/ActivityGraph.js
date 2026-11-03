'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { ArrowUpRight } from '@/components/ui/icons';
import { Card } from './ui/card';
import { Reveal } from './fx/Reveal';
import { cn } from '@/lib/utils';

/* empty, then four shades of the lime, the busiest with a glow */
const SHADE = [
  'bg-foreground/[0.07]',
  'bg-[rgb(var(--glow)/0.3)]',
  'bg-[rgb(var(--glow)/0.52)]',
  'bg-[rgb(var(--glow)/0.78)]',
  'bg-primary shadow-[0_0_8px_rgb(var(--glow)/0.55)]',
];
const CELL = 'block size-[11px] rounded-[3px] sm:size-3';

const day = (date, opts) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });

/* The contribution calendar, newest week at the right edge. On first sight
   the cells light up in a wave from the oldest corner and the total counts
   up; hover or tap a day for its count. The grid is a picture (hidden from
   screen readers); the figures above it say the same in words. Server HTML
   and reduced motion show it finished. */
export function ActivityGraph({ weeks, total, best, activeDays, profile }) {
  const root = useRef(null);
  const grid = useRef(null);
  const count = useRef(null);
  const [state, setState] = useState('static');
  const [tip, setTip] = useState(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return undefined;
    setState('armed');
    if (count.current) count.current.textContent = '0';
    let counting;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        /* one frame armed first, so the transitions have somewhere to start */
        requestAnimationFrame(() => setState('played'));
        counting = animate(0, total, {
          duration: 1.4,
          delay: 0.15,
          ease: [0.33, 1, 0.68, 1],
          onUpdate: (v) => {
            if (count.current) count.current.textContent = Math.round(v).toLocaleString('en-US');
          },
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      counting?.stop();
      if (count.current) count.current.textContent = total.toLocaleString('en-US');
    };
  }, [total]);

  /* one tooltip for the whole grid, placed over whichever day is under the
     pointer (a mouse hovering, or a finger tapping) */
  const point = (e) => {
    const cell = e.target.closest?.('[data-date]');
    if (!cell || !grid.current) {
      setTip(null);
      return;
    }
    const box = grid.current.getBoundingClientRect();
    const r = cell.getBoundingClientRect();
    const n = Number(cell.dataset.count);
    setTip({
      x: Math.min(Math.max(r.left + r.width / 2 - box.left, 84), box.width - 84),
      y: r.top - box.top,
      text: `${n ? n.toLocaleString('en-US') : 'No'} contribution${n === 1 ? '' : 's'} · ${day(cell.dataset.date, { weekday: 'short', day: 'numeric', month: 'short' })}`,
    });
  };

  return (
    <Reveal className="mt-4 lg:mt-6">
      <Card ref={root} data-state={state} className="p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-14">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">Contribution activity</h3>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span ref={count} className="text-5xl font-semibold tracking-[-0.045em] tabular-nums md:text-6xl">
                {total.toLocaleString('en-US')}
              </span>
              <span className="text-muted-foreground">contributions on GitHub in the last year</span>
            </p>
            <ul className="mt-5 flex flex-wrap gap-2 text-[13px]">
              <li className="rounded-full bg-secondary px-3 py-1.5">
                <span className="font-semibold tabular-nums">{best.count}</span> on the busiest day, {day(best.date, { day: 'numeric', month: 'long' })}
              </li>
              <li className="rounded-full bg-secondary px-3 py-1.5">
                <span className="font-semibold tabular-nums">{activeDays}</span> active days
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <div ref={grid} className="relative" onPointerMove={point} onPointerDown={point} onPointerLeave={() => setTip(null)}>
              {/* newest week on the right; older weeks fall off the left edge when the screen is narrow */}
              <div aria-hidden="true" className="flex justify-end overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_9%)]">
                <div className="flex gap-[3px]">
                  {weeks.map((week, w) => (
                    <div key={w} className="relative flex shrink-0 flex-col gap-[3px] pt-5">
                      {/* the newest month's label hangs left, so it never runs off the edge */}
                      {week.label && (
                        <span className={cn('absolute top-0 text-[11px] leading-none text-muted-foreground', w === weeks.length - 1 ? 'right-0' : 'left-0')}>
                          {week.label}
                        </span>
                      )}
                      {Array.from({ length: 7 }, (_, d) => {
                        const cell = week.days[d];
                        return cell ? (
                          <i
                            key={d}
                            data-date={cell[0]}
                            data-count={cell[1]}
                            style={{ '--d': w + d }}
                            className={cn(
                              CELL,
                              SHADE[cell[2]],
                              'transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] [transition-delay:calc(var(--d)*16ms)] in-data-[state=armed]:scale-[0.3] in-data-[state=armed]:opacity-0'
                            )}
                          />
                        ) : (
                          <i key={d} className={CELL} />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              {tip && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-background shadow-lift"
                  style={{ left: tip.x, top: tip.y }}
                >
                  {tip.text}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5" aria-hidden="true">
                Less
                {SHADE.map((shade) => (
                  <i key={shade} className={cn(CELL, shade)} />
                ))}
                More
              </span>
              <a
                href={profile}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-1 font-medium text-foreground"
              >
                See it on GitHub
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}
