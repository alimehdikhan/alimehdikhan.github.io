'use client';

import { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

const EASE = [0.16, 1, 0.3, 1];

/* the sequence, in seconds after the message is confirmed sent */
const T = {
  flood: 0.95, // ink circle grows out of the send button and fills the card
  badge: 0.3, // check badge pops in
  ring: 0.38, // ring strokes around the badge
  check: 0.85, // checkmark draws
  waves: 0.6, // shockwave rings
  burst: 0.62, // particle explosion
  words: 0.95, // headline words rise
  copy: 1.45, // supporting line
  action: 1.75, // "send another" button
};

/* dark tokens inside the overlay (it sits in the lime panel's token scope),
   so buttons, highlights and focus rings read as lime on ink */
const INK_TOKENS = {
  '--foreground': '#f2f2ea',
  '--muted-foreground': '#a0a4a0',
  '--primary': '#d5f66b',
  '--primary-hover': '#e0fb86',
  '--primary-foreground': '#090a0a',
  '--ring': '#d5f66b',
  '--glow': '213 246 107',
  '--em': '#d5f66b',
  '--border': '#2b2e2b',
};

/* Canvas confetti: one explosive burst from the check badge with gravity,
   drag and spin, mixing lime, cream and grey circles and slivers. Runs
   once (~2.2s) and stops; never under reduced motion. */
function Burst({ anchorRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* the burst leaves from the centre of the check badge */
    const a = anchorRef.current?.getBoundingClientRect();
    const origin = a ? { x: a.left - rect.left + a.width / 2, y: a.top - rect.top + a.height / 2 } : { x: rect.width / 2, y: rect.height / 2 - 70 };

    const colors = ['#d5f66b', '#d5f66b', '#d5f66b', '#e8fb9e', '#f2f2ea', '#a0a4a0'];
    const count = fine ? 130 : 70;
    const parts = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      return {
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        size: 2 + Math.random() * 4,
        sliver: Math.random() < 0.45,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.4,
        color: colors[(Math.random() * colors.length) | 0],
        life: 0,
        max: 70 + Math.random() * 60,
      };
    });

    let frame = 0;
    let last = 0;
    const tick = (now) => {
      const step = last ? Math.min((now - last) / 16.7, 2.5) : 1;
      last = now;
      ctx.clearRect(0, 0, rect.width, rect.height);
      let alive = 0;
      for (const p of parts) {
        p.life += step;
        if (p.life > p.max) continue;
        alive += 1;
        p.vx *= Math.pow(0.975, step);
        p.vy = p.vy * Math.pow(0.975, step) + 0.22 * step;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.rot += p.spin * step;
        const fade = 1 - Math.max(0, (p.life - p.max * 0.6) / (p.max * 0.4));
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.sliver) ctx.fillRect(-p.size, -p.size * 0.35, p.size * 2, p.size * 0.7);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (alive) frame = requestAnimationFrame(tick);
    };
    const start = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, T.burst * 1000);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(frame);
    };
  }, [anchorRef]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}

function Badge({ reduce, badgeRef }) {
  return (
    <motion.div
      ref={badgeRef}
      className="relative size-28 md:size-32"
      initial={reduce ? false : { scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: T.badge, type: 'spring', stiffness: 260, damping: 16 }}
    >
      {/* breathing lime glow */}
      <motion.span
        aria-hidden="true"
        className="absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgb(213_246_107/0.45),transparent)] blur-md"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 0.6 } : { opacity: [0, 0.9, 0.55, 0.85, 0.55] }}
        transition={reduce ? { duration: 0 } : { delay: T.ring, duration: 4, times: [0, 0.15, 0.5, 0.75, 1], repeat: Infinity, repeatType: 'mirror' }}
      />
      {/* shockwaves */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-[#d5f66b]"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2.8], opacity: [0.85, 0] }}
            transition={{ delay: T.waves + i * 0.16, duration: 1.1, ease: EASE }}
          />
        ))}
      <svg viewBox="0 0 120 120" className="relative size-full" aria-hidden="true">
        <circle cx="60" cy="60" r="54" fill="#111311" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#d5f66b"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ rotate: -90, transformOrigin: '50% 50%' }}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: T.ring, duration: 0.7, ease: EASE }}
        />
        <motion.path
          d="M38 62 L53 77 L84 45"
          fill="none"
          stroke="#d5f66b"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            delay: T.check,
            duration: 0.45,
            ease: [0.65, 0, 0.35, 1],
            opacity: { delay: T.check, duration: 0.01 },
          }}
        />
      </svg>
    </motion.div>
  );
}

const WORDS = [
  { text: 'Thank' },
  { text: 'you' },
  { text: 'for' },
  { text: 'reaching', em: true },
  { text: 'out!', em: true },
];

/* Full-card success scene, portaled into the form card. The ink layer
   floods out of the send button (clip-path circle from `origin`), then the
   badge, shockwaves, confetti and headline play in sequence. "Send another
   message" collapses it back into the button. */
export function ContactSuccess({ open, container, origin, reduce, onReset, onClosed }) {
  const heading = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (open) heading.current?.focus({ preventScroll: true });
  }, [open]);

  if (!container) return null;

  const w = container.offsetWidth;
  const h = container.offsetHeight;
  const ox = origin?.x ?? w / 2;
  const oy = origin?.y ?? h / 2;
  const radius = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) + 24;
  const closed = `circle(0px at ${ox}px ${oy}px)`;
  const full = `circle(${radius}px at ${ox}px ${oy}px)`;

  return createPortal(
    <AnimatePresence onExitComplete={onClosed}>
      {open && (
        <motion.div
          key="sent"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-[inherit] bg-[#090a0a] px-6 py-10 text-center text-[#f2f2ea]"
          style={INK_TOKENS}
          initial={reduce ? { opacity: 0 } : { clipPath: closed }}
          animate={reduce ? { opacity: 1 } : { clipPath: full }}
          exit={reduce ? { opacity: 0 } : { clipPath: closed, transition: { duration: 0.6, ease: [0.7, 0, 0.84, 0] } }}
          transition={reduce ? { duration: 0.2 } : { duration: T.flood, ease: EASE }}
        >
          {/* faint grid and lime bloom behind the scene */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgb(242_242_234/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(242_242_234/0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(closest-side,black,transparent)]"
          />
          {!reduce && <Burst anchorRef={badgeRef} />}

          <div className="relative flex flex-col items-center">
            <Badge reduce={reduce} badgeRef={badgeRef} />

            <h3
              ref={heading}
              tabIndex={-1}
              className="display mt-8 max-w-[16ch] text-[clamp(1.9rem,4.4vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.03em] outline-none"
            >
              {WORDS.map((word, i) => (
                <Fragment key={word.text}>
                  {i > 0 && ' '}
                  <span className="inline-block overflow-hidden pr-[0.08em] pb-[0.08em] align-top">
                    <motion.span
                      className="inline-block"
                      initial={reduce ? false : { y: '110%' }}
                      animate={{ y: '0%' }}
                      transition={{ delay: T.words + i * 0.07, duration: 0.8, ease: EASE }}
                    >
                      {word.em ? <em>{word.text}</em> : word.text}
                    </motion.span>
                  </span>
                </Fragment>
              ))}
            </h3>

            <motion.p
              className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-[#a0a4a0] md:text-base"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: T.copy, duration: 0.6, ease: EASE }}
            >
              Message sent. Your note is in my inbox — I&apos;ll get back to you soon.
            </motion.p>

            <motion.div
              className="mt-8"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: T.action, duration: 0.6, ease: EASE }}
            >
              <Button type="button" size="lg" onClick={onReset}>
                <RotateCcw aria-hidden="true" />
                Send another message
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    container
  );
}
