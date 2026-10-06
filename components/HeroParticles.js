'use client';

import { useEffect, useRef } from 'react';

/* Three depth layers: far particles are small, dim, slow and barely move
   with the cursor; near ones are larger, brighter, faster and drift further
   (parallax). */
const LAYERS = [
  { depth: 0.25, size: [0.7, 1.2], alpha: 0.38, share: 0.45, spin: 0.55 },
  { depth: 0.6, size: [1, 1.7], alpha: 0.58, share: 0.35, spin: 0.8 },
  { depth: 1, size: [1.4, 2.4], alpha: 0.85, share: 0.2, spin: 1 },
];
const PARALLAX = 22; // px at depth 1, cursor at the stage edge
const REPEL = 90; // px radius of the cursor's gentle push
const TILT = 0.8; // the vortex is seen at an angle: vertical squash
const DPR_MAX = 1.5;
/* entrance, in ms after mount: the vortex fades in while spinning fast,
   then settles to its resting speed (coordinated with the hero sequence) */
const FADE_AT = 350;
const FADE_FOR = 1200;
const SPIN_UP = 3;
const SPIN_SETTLE = 1100;

function readGlow() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--glow').trim();
  return v ? v.split(/\s+/).join(',') : '213,246,107';
}

/* Interactive lime particle vortex behind the portrait: particles orbit the
   centre in three depth layers, faster toward the middle, breathing slightly
   in and out. The light follows a mouse cursor (and wanders on its own
   otherwise); the vortex centre leans toward the cursor by depth and
   particles near it are gently pushed aside. Canvas 2D: no WebGL needed.
   Pauses offscreen and in hidden tabs; fewer particles, 30fps and no cursor
   on touch screens; a single still frame under reduced motion. */
export function HeroParticles({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const count = fine ? 140 : 50;
    const frameGap = fine ? 0 : 1000 / 30;

    let w = 0;
    let h = 0;
    let glow = readGlow();
    let frame = 0;
    let last = 0;
    let visible = false;
    let clock = 0; // ms of animation run so far
    let t = Math.random() * 100;
    /* cursor relative to the canvas centre, -1..1, eased toward its target */
    const cur = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999, active: false };
    const light = { x: 0.5, y: 0.45 };

    const particles = [];
    LAYERS.forEach((layer) => {
      const n = Math.round(count * layer.share);
      for (let i = 0; i < n; i += 1) {
        /* share of the half-size: the portrait disc covers ~0.67, so most
           orbits sit in the band around it */
        const r = 0.6 + Math.pow(Math.random(), 0.9) * 0.38;
        particles.push({
          a: Math.random() * Math.PI * 2,
          r,
          size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
          alpha: layer.alpha * (0.6 + Math.random() * 0.4),
          d: layer.depth,
          /* angular speed: faster near the centre, faster for near layers */
          w: (0.00018 + Math.random() * 0.0001) * layer.spin * (0.7 / r),
          phase: Math.random() * Math.PI * 2,
          ox: 0,
          oy: 0,
        });
      }
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, DPR_MAX);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (dt) => {
      clock += dt;
      t += dt * 0.001;
      const fade = reduce ? 1 : Math.min(1, Math.max(0, (clock - FADE_AT) / FADE_FOR));
      const spin = reduce ? 1 : 1 + SPIN_UP * Math.exp(-clock / SPIN_SETTLE);
      cur.x += (cur.tx - cur.x) * 0.06;
      cur.y += (cur.ty - cur.y) * 0.06;
      ctx.clearRect(0, 0, w, h);
      if (fade <= 0) return;

      /* the light: follows the cursor, or wanders when there is none */
      const lxT = cur.active ? 0.5 + cur.tx * 0.42 : 0.5 + 0.28 * Math.cos(t * 0.23);
      const lyT = cur.active ? 0.5 + cur.ty * 0.42 : 0.45 + 0.22 * Math.sin(t * 0.31);
      light.x += (lxT - light.x) * 0.05;
      light.y += (lyT - light.y) * 0.05;
      const lx = w * light.x;
      const ly = h * light.y;
      const lr = Math.max(w, h) * 0.42;
      const glowFill = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
      glowFill.addColorStop(0, `rgba(${glow},${0.16 * fade})`);
      glowFill.addColorStop(1, `rgba(${glow},0)`);
      ctx.fillStyle = glowFill;
      ctx.fillRect(0, 0, w, h);

      const half = Math.min(w, h) / 2;
      ctx.fillStyle = `rgb(${glow})`;
      for (const p of particles) {
        p.a += p.w * dt * spin;
        const breathe = 1 + Math.sin(t * 0.6 + p.phase) * 0.04;
        const cx = w / 2 - cur.x * PARALLAX * p.d;
        const cy = h / 2 - cur.y * PARALLAX * p.d;
        let x = cx + Math.cos(p.a) * p.r * half * breathe;
        let y = cy + Math.sin(p.a) * p.r * half * breathe * TILT;

        /* gentle push away from the cursor, easing back once it leaves */
        const dx = x - cur.px;
        const dy = y - cur.py;
        const dist = Math.hypot(dx, dy);
        let tx = 0;
        let ty = 0;
        if (dist < REPEL && dist > 0.01) {
          const f = (1 - dist / REPEL) * 18 * p.d;
          tx = (dx / dist) * f;
          ty = (dy / dist) * f;
        }
        p.ox += (tx - p.ox) * 0.08;
        p.oy += (ty - p.oy) * 0.08;
        x += p.ox;
        y += p.oy;

        /* particles on the near half of the ring and under the light glow brighter */
        const front = 0.75 + Math.sin(p.a) * 0.25;
        const lit = Math.max(0, 1 - Math.hypot(x - lx, y - ly) / lr);
        ctx.globalAlpha = Math.min(1, p.alpha * front * (0.55 + lit * 0.9) * fade);
        ctx.beginPath();
        ctx.arc(x, y, p.size * (0.85 + front * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(now - last, 50) : 16;
      if (dt >= frameGap) {
        last = now;
        draw(dt);
      }
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce || frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    if (reduce) draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    /* follow the theme: particle colour comes from --glow */
    const mo = new MutationObserver(() => {
      glow = readGlow();
      if (reduce) draw(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const hero = document.getElementById('hero');
    const onMove = (e) => {
      if (!fine || reduce || e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      cur.active = true;
      cur.px = e.clientX - rect.left;
      cur.py = e.clientY - rect.top;
      cur.tx = Math.max(-1, Math.min(1, (cur.px - rect.width / 2) / (rect.width / 2)));
      cur.ty = Math.max(-1, Math.min(1, (cur.py - rect.height / 2) / (rect.height / 2)));
    };
    const onLeave = () => {
      cur.active = false;
      cur.tx = 0;
      cur.ty = 0;
      cur.px = -9999;
      cur.py = -9999;
    };
    hero?.addEventListener('pointermove', onMove, { passive: true });
    hero?.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      hero?.removeEventListener('pointermove', onMove);
      hero?.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
