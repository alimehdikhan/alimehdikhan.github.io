'use client';

import { useEffect, useRef, useState } from 'react';

/* The Vocaly AI README's own demo: a synthetic voice reads "I think this is
   the third time" but says "furd", and the app marks "third" as Worth
   checking because /θ/ came out as /f/. Sounds are General American IPA.
   The hero's Vocaly tile shows the same sentence. */
export const WORDS = [
  { word: 'I', sounds: ['aɪ'] },
  { word: 'think', sounds: ['θ', 'ɪ', 'ŋ', 'k'] },
  { word: 'this', sounds: ['ð', 'ɪ', 's'] },
  { word: 'is', sounds: ['ɪ', 'z'] },
  { word: 'the', sounds: ['ð', 'ə'] },
  { word: 'third', sounds: ['θ', 'ɝ', 'd'], slip: { at: 0, heard: 'f' } },
  { word: 'time', sounds: ['t', 'aɪ', 'm'] },
];
const FLAGGED = WORDS.findIndex((w) => w.slip);

/* agreement with expert raters (Pearson r) on the 500-recording
   speechocean762 test split, from the README's accuracy table */
const SCORES = [
  { name: 'Overall score', before: 0.507, now: 0.697 },
  { name: 'Sentence accuracy', before: 0.514, now: 0.651 },
  { name: 'Word accuracy', before: 0.422, now: 0.555 },
  { name: 'Fluency', before: -0.084, now: 0.627 },
];
const MIN = -0.1;
const MAX = 1;
const at = (v) => ((v - MIN) / (MAX - MIN)) * 100;
const fmt = (v) => v.toFixed(2).replace('-', '−');

/* Product showcase for the Vocaly AI card: the real logo, the README's demo
   transcript with a word inspector, and the scoring accuracy as a dumbbell
   chart. It plays once on first sight (words score in, the slip is flagged,
   the dots travel from before to now); the server HTML and reduced motion
   show the finished state. */
export function VocalyShowcase({ logo }) {
  const root = useRef(null);
  /* static: finished and visible (server HTML, reduced motion, above the
     fold); armed: hidden, waiting to be seen; played: running the sequence */
  const [state, setState] = useState('static');
  const [active, setActive] = useState(FLAGGED);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return undefined;
    setState('armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        /* one frame in the armed state first, so the transitions have a start */
        requestAnimationFrame(() => setState('played'));
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* once the dots have landed, settle into the finished state so the
     entrance delays no longer slow a press down */
  useEffect(() => {
    if (state !== 'played') return undefined;
    const t = setTimeout(() => setState('static'), 2000);
    return () => clearTimeout(t);
  }, [state]);

  const current = WORDS[active];

  return (
    <div
      ref={root}
      data-state={state}
      className="vocaly-demo relative flex h-full flex-col gap-8 bg-[linear-gradient(160deg,#121733,#07080f_72%)] p-6 text-white sm:p-8 lg:justify-between lg:gap-10 lg:p-10"
    >
      <img src={logo.src} alt="" width={logo.width} height={logo.height} className="h-auto w-[132px] sm:w-[150px]" loading="lazy" decoding="async" />

      <figure className="flex flex-col gap-4">
        <figcaption className="text-[13px] text-white/70">
          The demo from the README: a synthetic voice says <span className="text-white">&ldquo;furd&rdquo;</span>. Tap a word to inspect it.
        </figcaption>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Transcript">
          {WORDS.map((w, i) => (
            <button
              key={w.word}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              style={{ '--i': i }}
              className={`v-word ${w.slip ? 'v-slip' : ''} rounded-lg px-2 py-1 text-lg leading-tight font-medium tracking-[-0.01em] outline-none focus-visible:ring-2 focus-visible:ring-[#8cc2ff] sm:text-xl ${
                active === i ? 'bg-white/[0.12]' : 'hover:bg-white/[0.06]'
              }`}
            >
              {w.word}
            </button>
          ))}
        </div>

        <div className="v-inspect border-t border-white/10 pt-4" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-[15px] font-semibold">
              {current.word} <span className="font-normal text-white/60">/{current.sounds.join('')}/</span>
            </p>
            <p className="inline-flex items-center gap-2 text-[13px] font-medium">
              <span aria-hidden="true" className={`size-2 rounded-full ${current.slip ? 'bg-[#f5b544]' : 'bg-[#8cc2ff]'}`} />
              {current.slip ? 'Worth checking' : 'All sounds clean'}
            </p>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Sounds">
            {current.sounds.map((s, k) => {
              const slipped = current.slip?.at === k;
              return (
                <li
                  key={`${current.word}-${k}`}
                  className={`rounded-md px-2 py-1 font-mono text-[13px] ${slipped ? 'bg-[#f5b544]/15 text-[#f9cf7f]' : 'bg-white/[0.07] text-white/80'}`}
                >
                  {s}
                  {slipped && <span className="text-white/60"> → {current.slip.heard}</span>}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[13px] text-white/60">
            {current.slip
              ? `/θ/ came out as /f/. Saying “${current.word}” on its own settles it.`
              : 'Every sound in this word matched the target.'}
          </p>
        </div>
      </figure>

      <figure className="flex flex-col gap-4">
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <span className="text-[15px] font-semibold">Agreement with expert raters</span>
          <span className="flex items-center gap-4 text-[13px] text-white/70" aria-hidden="true">
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2 rounded-full bg-[#4a6db0]" />
              Words only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2 rounded-full bg-[#8cc2ff]" />
              Words and sounds
            </span>
          </span>
        </figcaption>

        <ul className="flex flex-col gap-3" aria-hidden="true">
          {SCORES.map((s, i) => (
            <li key={s.name} className="group grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 text-[13px] sm:grid-cols-[8.5rem_1fr_auto]">
              <span className="truncate text-white/70 transition-colors group-hover:text-white">{s.name}</span>
              <span className="relative h-4">
                {/* recessive guides at 0, 0.5 and 1 */}
                {[0, 0.5, 1].map((g) => (
                  <i key={g} className="absolute inset-y-0 w-px bg-white/10" style={{ left: `${at(g)}%` }} />
                ))}
                <i
                  className="v-bar absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#8cc2ff]/50 transition-[height] group-hover:h-[3px]"
                  style={{ left: `${at(s.before)}%`, width: `${at(s.now) - at(s.before)}%`, '--i': i }}
                />
                <i
                  className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4a6db0] ring-2 ring-[#0d1020]"
                  style={{ left: `${at(s.before)}%` }}
                />
                <span className="v-move absolute inset-0" style={{ '--d': `${at(s.now) - at(s.before)}%`, '--i': i }}>
                  <i
                    className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8cc2ff] ring-2 ring-[#0d1020]"
                    style={{ left: `${at(s.now)}%` }}
                  />
                </span>
              </span>
              <span className="text-white/60 tabular-nums transition-colors group-hover:text-white">
                {fmt(s.before)} → <span className="font-semibold text-white">{fmt(s.now)}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-white/60">Pearson r against trained annotators, 500 test recordings from speechocean762.</p>

        <table className="sr-only">
          <caption>Agreement with expert raters (Pearson r), before and after adding the sound model</caption>
          <thead>
            <tr>
              <th scope="col">Measure</th>
              <th scope="col">Words only</th>
              <th scope="col">Words and sounds</th>
            </tr>
          </thead>
          <tbody>
            {SCORES.map((s) => (
              <tr key={s.name}>
                <th scope="row">{s.name}</th>
                <td>{fmt(s.before)}</td>
                <td>{fmt(s.now)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </div>
  );
}
