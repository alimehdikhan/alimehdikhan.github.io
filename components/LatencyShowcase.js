'use client';

import { useEffect, useRef, useState } from 'react';

/* Why EfficientNet-B2: model time for one 224 px image in ONNX Runtime, 4
   threads, on a 2015 Core i5 throttled to about 0.8 GHz (the project's own
   benchmark; ConvNeXt-Tiny varied between runs, so it shows as a range).
   Log scale, so 12 ms and 600 ms both read. */
const ROWS = [
  { name: 'ConvNeXt-Tiny', from: 150, to: 600, label: '150–600 ms' },
  { name: 'ResNet-50', to: 48, label: '48 ms' },
  { name: 'EfficientNet-B2', to: 19, label: '19 ms', chosen: true },
  { name: 'EfficientNet-B0', to: 12, label: '12 ms' },
];
const LO = Math.log10(8);
const HI = Math.log10(800);
const x = (ms) => ((Math.log10(ms) - LO) / (HI - LO)) * 100;

/* The Skin Lesion Classifier card's demo. The bars run in once on first
   sight and the chosen one is called out; the server HTML and reduced
   motion show the finished chart. */
export function LatencyShowcase() {
  const root = useRef(null);
  /* static: finished (server HTML, reduced motion, already in view);
     armed: bars collapsed, waiting to be seen; played: running in */
  const [state, setState] = useState('static');

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return undefined;
    setState('armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        requestAnimationFrame(() => setState('played'));
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (state !== 'played') return undefined;
    const t = setTimeout(() => setState('static'), 2200);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <div
      ref={root}
      data-state={state}
      className="latency flex h-full flex-col justify-between gap-6 bg-[linear-gradient(160deg,#151a11,#080908_72%)] p-6 text-white sm:p-8"
    >
      <div>
        <p className="text-[13px] text-white/60">Model time per image, on a CPU</p>
        <p className="mt-1 text-xl leading-tight font-semibold tracking-[-0.02em]">Why EfficientNet-B2</p>
      </div>

      <ul className="space-y-3.5" aria-label="Model time per image by backbone">
        {ROWS.map((row, i) => {
          const start = row.from ? x(row.from) : 0;
          return (
            <li key={row.name} className="grid grid-cols-[7.5rem_minmax(0,1fr)_4.75rem] items-center gap-3 text-[13px] sm:grid-cols-[8.5rem_minmax(0,1fr)_5rem]" style={{ '--i': i }}>
              <span className={row.chosen ? 'font-semibold text-[#d5f66b]' : 'text-white/70'}>{row.name}</span>
              <span className="relative h-2 rounded-full bg-white/[0.07]" aria-hidden="true">
                <span
                  className={`lat-bar absolute inset-y-0 rounded-full ${
                    row.chosen
                      ? 'bg-[#d5f66b]'
                      : row.from
                        ? 'bg-[linear-gradient(90deg,rgb(255_255_255/0.12),rgb(255_255_255/0.4),rgb(255_255_255/0.12))]'
                        : 'bg-white/35'
                  }`}
                  style={{ left: `${start}%`, width: `${x(row.to) - start}%` }}
                />
              </span>
              <span className={`lat-value text-right tabular-nums ${row.chosen ? 'font-semibold text-[#d5f66b]' : 'text-white/70'}`}>{row.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/55">
        <span className="lat-chosen inline-flex items-center gap-1.5 rounded-full bg-[#d5f66b]/12 px-2.5 py-1 font-medium text-[#d5f66b]">
          <span className="size-1.5 rounded-full bg-[#d5f66b]" aria-hidden="true" />
          Chosen: fast enough to serve without a GPU
        </span>
        <span>ONNX Runtime, 4 threads, 2015 Core i5. Log scale.</span>
      </div>
    </div>
  );
}
