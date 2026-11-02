'use client';

import { useEffect, useRef } from 'react';

const SPRING = 0.08; // share of the gap to its target a dot closes each frame
const DAMPING = 0.78; // share of its velocity a dot keeps each frame

/* Dot-matrix name. The text is fitted to the canvas, rasterised off-screen
   and sampled on a tight grid; every inked cell becomes a small white dot
   with a home position. The cursor (or a finger) clears a hole: dots whose
   home falls inside the radius are pushed out to its rim, and spring back
   when it moves on. The loop runs only while the canvas is on screen
   (IntersectionObserver) and something is moving. Under reduced motion the
   dots are drawn once, still. */
export function ParticleWord({ text }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const fallback = useRef(null);

  useEffect(() => {
    const box = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!box || !ctx) return undefined;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let disposed = false;
    let ready = false;
    let visible = false;
    let settled = true;
    let frame = 0;
    let pointer = null;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let dot = 2;
    let radius = 80;
    let n = 0;
    let hx;
    let hy;
    let x;
    let y;
    let vx;
    let vy;

    const build = () => {
      W = box.clientWidth;
      H = box.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);

      const narrow = W < 640;
      const gap = narrow ? 3 : 4;
      dot = narrow ? 1.5 : 2;
      radius = Math.max(28, Math.min(80, W * 0.07));

      /* fit the word to the box: measure at 100px, then scale to the
         tighter of the width and height limits */
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const o = off.getContext('2d', { willReadFrequently: true });
      const family = getComputedStyle(box).fontFamily;
      const setFont = (px) => {
        o.font = `700 ${px}px ${family}`;
        if ('letterSpacing' in o) o.letterSpacing = `${-0.03 * px}px`;
      };
      setFont(100);
      const probe = o.measureText(text);
      const probeH = probe.actualBoundingBoxAscent + probe.actualBoundingBoxDescent;
      const size = Math.min(((W * 0.96) / probe.width) * 100, ((H * 0.78) / probeH) * 100);
      setFont(size);
      const m = o.measureText(text);
      const asc = m.actualBoundingBoxAscent;
      o.fillText(text, (W - m.width) / 2, (H - (asc + m.actualBoundingBoxDescent)) / 2 + asc);
      const data = o.getImageData(0, 0, W, H).data;

      const pts = [];
      for (let yy = gap >> 1; yy < H; yy += gap) {
        for (let xx = gap >> 1; xx < W; xx += gap) if (data[(yy * W + xx) * 4 + 3] > 128) pts.push(xx, yy);
      }
      n = pts.length / 2;
      hx = new Float32Array(n);
      hy = new Float32Array(n);
      x = new Float32Array(n);
      y = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        hx[i] = x[i] = pts[i * 2];
        hy[i] = y[i] = pts[i * 2 + 1];
      }
      settled = true;
      ready = true;
      if (fallback.current) fallback.current.style.visibility = 'hidden';
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      const half = dot / 2;
      for (let i = 0; i < n; i++) ctx.fillRect(x[i] - half, y[i] - half, dot, dot);
    };

    const step = () => {
      const r2 = radius * radius;
      let moving = false;
      for (let i = 0; i < n; i++) {
        let tx = hx[i];
        let ty = hy[i];
        if (pointer) {
          const dx = hx[i] - pointer.x;
          const dy = hy[i] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            /* out to the rim, a little further the closer to the centre,
               so the displaced dots spread into a soft ring */
            const d = Math.sqrt(d2) || 0.001;
            const out = radius + (radius - d) * 0.35;
            tx = pointer.x + (dx / d) * out;
            ty = pointer.y + (dy / d) * out;
          }
        }
        vx[i] = (vx[i] + (tx - x[i]) * SPRING) * DAMPING;
        vy[i] = (vy[i] + (ty - y[i]) * SPRING) * DAMPING;
        x[i] += vx[i];
        y[i] += vy[i];
        if (!moving && (Math.abs(vx[i]) > 0.01 || Math.abs(vy[i]) > 0.01 || Math.abs(tx - x[i]) > 0.05 || Math.abs(ty - y[i]) > 0.05)) {
          moving = true;
        }
      }
      return moving;
    };

    function tick() {
      frame = 0;
      const moving = step();
      if (!moving) {
        /* at rest (around a still cursor, or home); home snaps exactly so
           the idle frame is crisp. The next move wakes the loop again. */
        if (!pointer) {
          x.set(hx);
          y.set(hy);
        }
        settled = true;
      }
      draw();
      if (moving) wake();
    }
    function wake() {
      settled = false;
      if (!frame && !disposed && ready && visible && !reduced) frame = requestAnimationFrame(tick);
    }
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const local = (e) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e) => {
      pointer = local(e);
      wake();
    };
    const onRelease = (e) => {
      if (e.type === 'pointerup' && e.pointerType === 'mouse') return;
      pointer = null;
      wake();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) pause();
      else if (!settled || pointer) wake();
    });
    const ro = new ResizeObserver(() => {
      if (!ready) return;
      pointer = null;
      pause();
      build();
      draw();
    });
    /* a zoom or a move to another screen changes the pixel ratio only */
    const onWindowResize = () => {
      if (ready && Math.min(window.devicePixelRatio || 1, 2) !== dpr) {
        build();
        draw();
      }
    };

    document.fonts.ready.then(() => {
      if (disposed) return;
      build();
      draw();
      ro.observe(box);
      io.observe(box);
      window.addEventListener('resize', onWindowResize);
      if (reduced) return;
      cv.addEventListener('pointermove', onMove);
      cv.addEventListener('pointerdown', onMove);
      cv.addEventListener('pointerup', onRelease);
      cv.addEventListener('pointerleave', onRelease);
      cv.addEventListener('pointercancel', onRelease);
    });

    return () => {
      disposed = true;
      pause();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', onWindowResize);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerdown', onMove);
      cv.removeEventListener('pointerup', onRelease);
      cv.removeEventListener('pointerleave', onRelease);
      cv.removeEventListener('pointercancel', onRelease);
      fallback.current?.style.removeProperty('visibility');
    };
  }, [text]);

  return (
    <div ref={wrap} aria-hidden="true" className="relative aspect-[4/1] w-full overflow-hidden select-none sm:aspect-[5/1]">
      {/* shown until the canvas draws, and when JS is off */}
      <p
        ref={fallback}
        className="absolute inset-0 grid place-items-center text-[clamp(2rem,13vw,18rem)] leading-none font-bold tracking-[-0.03em] whitespace-nowrap text-white/15"
      >
        {text}
      </p>
      {/* pan-y keeps vertical scrolling; a horizontal drag moves the hole */}
      <canvas ref={canvas} className="absolute inset-0 size-full touch-pan-y" />
    </div>
  );
}
