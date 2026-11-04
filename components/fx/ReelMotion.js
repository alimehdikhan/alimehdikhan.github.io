'use client';

import { useEffect } from 'react';
import { loadGsap } from './gsap';
import { HOLD, MOVE } from './reel';

/* The project reel's motion (Projects.js has the scenes, globals.css
   "Projects: the project reel" the layout).

   Wide screens with motion on: the CSS pins the view for the section's
   extra height, and one scrubbed value, the reel's time, drives everything
   from there. The track slides a scene at a time (each holds still for a
   beat first); the frame of the scene arriving swings from turned to flat,
   and turns away as it leaves; the outlined words drift slower than the
   scenes; the light crossfades to each project's colour; the rail fills. A
   scene's title flips up letter by letter and its numbers count up the
   first time it arrives, and a light sweeps across its frame as it lands.
   The frame on show leans a little toward the mouse. Stopping between two
   scenes settles on the nearer one, and the rail's names and keyboard focus
   scroll the reel to a scene.

   Narrower or shorter screens: the stacked scenes rise in as they are
   reached, and their frames tip up flat. Reduced motion: nothing moves. */

const WIDE = '(scripting: enabled) and (min-width: 1024px) and (min-height: 700px)';
const MOTION = '(prefers-reduced-motion: no-preference)';

const count = (el, v) => {
  el.textContent = v.toFixed(Number(el.dataset.decimals) || 0);
};

export function ReelMotion() {
  useEffect(() => {
    let disposed = false;
    let mm;
    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (disposed) return;
        const section = document.getElementById('projects');
        const pin = section?.querySelector('.reel-pin');
        if (!pin) return;
        const parts = [...section.querySelectorAll('.reel-scene')].map((scene) => ({
          scene,
          chars: scene.querySelectorAll('.reel-char'),
          fades: scene.querySelectorAll('[data-reel-fade]'),
          counters: [...scene.querySelectorAll('[data-count]')],
          stage: scene.querySelector('.reel-stage'),
          frame: scene.querySelector('.reel-frame'),
          word: scene.querySelector('.reel-word'),
        }));
        const settle = () => parts.forEach((p) => p.counters.forEach((el) => count(el, Number(el.dataset.count))));

        mm = gsap.matchMedia();
        mm.add({ wide: WIDE, motion: MOTION }, (ctx) => {
          const { wide, motion } = ctx.conditions;
          if (!motion) return undefined;

          /* A scene's copy waits out of sight until it arrives. The server
             HTML shows everything, so this only hides what is off screen. */
          const hide = (part) => {
            gsap.set(part.chars, { yPercent: 135, rotate: 8, transformOrigin: '0% 100%' });
            gsap.set(part.fades, { opacity: 0, y: 22 });
            part.counters.forEach((el) => count(el, Number(el.dataset.from)));
          };
          ctx.add('arrive', (part, withStage) => {
            const tl = gsap.timeline();
            tl.to(part.chars, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.03 }, 0);
            tl.to(part.fades, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.2);
            if (withStage) {
              tl.to(part.stage, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, 0.1);
              tl.call(() => part.frame.setAttribute('data-lit', ''), null, 0.35);
            }
            part.counters.forEach((el) => {
              const n = { v: Number(el.dataset.from) };
              tl.to(n, { v: Number(el.dataset.count), duration: 1.4, ease: 'power2.out', onUpdate: () => count(el, n.v) }, 0.35);
            });
          });

          if (!wide) {
            ctx.add('tip', (part) => {
              gsap.to(part.frame, { rotateX: 0, y: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'expo.out' });
              gsap.delayedCall(0.3, () => part.frame.setAttribute('data-lit', ''));
            });
            const below = (el, f) => el.getBoundingClientRect().top > window.innerHeight * f;
            parts.forEach((part) => {
              if (below(part.scene, 0.8)) {
                hide(part);
                ScrollTrigger.create({ trigger: part.scene, start: 'top 80%', once: true, onEnter: () => ctx.arrive(part) });
              }
              if (below(part.stage, 0.88)) {
                gsap.set(part.frame, { rotateX: 16, y: 40, scale: 0.94, opacity: 0, transformOrigin: '50% 0%' });
                ScrollTrigger.create({ trigger: part.stage, start: 'top 88%', once: true, onEnter: () => ctx.tip(part) });
              }
            });
            return () => {
              parts.forEach((p) => p.frame.removeAttribute('data-lit'));
              settle();
            };
          }

          const view = pin.querySelector('.reel-view');
          const track = view.querySelector('.reel-track');
          const glows = [...view.querySelectorAll('.reel-glow')];
          const fill = view.querySelector('.reel-fill');
          const stops = [...view.querySelectorAll('.reel-stop')];
          const labels = [...view.querySelectorAll('[data-reel-go]')];
          const hint = view.querySelector('.reel-hint');
          const n = parts.length;
          const length = n * HOLD + (n - 1) * MOVE;
          const glide = gsap.parseEase('sine.inOut');
          const moveStart = (k) => HOLD + k * (HOLD + MOVE);
          const centre = (i) => i * (HOLD + MOVE) + HOLD / 2;
          /* where the reel is at time t: 0 on the first scene, 1 on the
             second, and so on, in between while one slides in */
          const place = (t) => {
            for (let k = 0; k < n - 1; k += 1) {
              const a = moveStart(k);
              if (t < a) return k;
              if (t < a + MOVE) return k + glide((t - a) / MOVE);
            }
            return n - 1;
          };

          const reel = { t: 0 };
          /* nothing arrives until the starting point is known (below) */
          const seen = parts.map(() => true);
          const lit = parts.map(() => true);
          let current = 0;

          /* the frame on show leans a little toward the mouse */
          gsap.set(
            parts.map((p) => p.stage),
            { transformPerspective: 1600 },
          );
          const lean = parts.map((p) => ({
            y: gsap.quickTo(p.stage, 'rotationY', { duration: 0.9, ease: 'power3' }),
            x: gsap.quickTo(p.stage, 'rotationX', { duration: 0.9, ease: 'power3' }),
          }));
          const rest = (i) => {
            lean[i]?.y(0);
            lean[i]?.x(0);
          };

          const render = () => {
            const p = place(reel.t);
            track.style.transform = `translate3d(${(-p * 100).toFixed(3)}%, 0, 0)`;
            parts.forEach((part, i) => {
              const d = p - i;
              const c = Math.max(-1, Math.min(1, d));
              /* turned toward the centre on the way in, away on the way out */
              part.frame.style.transform = `rotateY(${(c < 0 ? c * 30 : c * 24).toFixed(2)}deg) scale(${(1 - Math.abs(c) * 0.14).toFixed(4)})`;
              part.word.style.transform = `translate3d(${(d * 22).toFixed(3)}%, 0, 0)`;
              if (glows[i]) glows[i].style.opacity = Math.max(0, 1 - Math.abs(d)).toFixed(3);
              if (!seen[i] && i > 0 && Math.abs(d) < 0.7) {
                seen[i] = true;
                ctx.arrive(part);
              }
              if (!lit[i] && i > 0 && Math.abs(d) < 0.12) {
                lit[i] = true;
                part.frame.setAttribute('data-lit', '');
              }
            });
            fill.style.transform = `scaleX(${(n > 1 ? p / (n - 1) : 1).toFixed(4)})`;
            stops.forEach((s, i) => s.toggleAttribute('data-on', p > i - 0.05));
            hint?.toggleAttribute('data-gone', p > 0.04);
            const now = Math.round(p);
            if (now !== current) {
              rest(current);
              current = now;
              labels.forEach((b, i) => (i === now ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
            }
          };

          /* stopping partway through a slide settles on the nearer scene */
          const snapTo = (v) => {
            const t = v * length;
            for (let k = 0; k < n - 1; k += 1) {
              const a = moveStart(k);
              if (t > a && t < a + MOVE) return ((t - a) / MOVE < 0.5 ? a : a + MOVE) / length;
            }
            return v;
          };

          const tween = gsap.to(reel, {
            t: length,
            duration: length,
            ease: 'none',
            onUpdate: render,
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.7,
              /* no inertia: where the visitor stops is where they meant to be */
              snap: { snapTo, inertia: false, duration: { min: 0.25, max: 0.8 }, delay: 0.15, ease: 'power2.inOut' },
            },
          });
          const st = tween.scrollTrigger;
          tween.progress(st.progress);
          render();

          /* hide whatever has not arrived yet, so it can */
          const p0 = place(reel.t);
          parts.forEach((part, i) => {
            const shown = i === 0 ? pin.getBoundingClientRect().top < window.innerHeight * 0.75 : p0 > i - 0.7;
            if (shown) return;
            seen[i] = false;
            lit[i] = false;
            hide(part);
            if (i === 0) gsap.set(part.stage, { opacity: 0, y: 56 });
          });
          if (!seen[0]) {
            ScrollTrigger.create({
              trigger: pin,
              start: 'top 75%',
              once: true,
              onEnter: () => {
                seen[0] = true;
                ctx.arrive(parts[0], true);
              },
            });
          }

          const go = (i) => {
            const top = st.start + (centre(i) / length) * (st.end - st.start);
            window.scrollTo({ top, behavior: 'smooth' });
          };
          const onGo = (e) => go(Number(e.detail));
          /* tabbing into a scene that is off to the side brings it in */
          const onFocus = (e) => {
            const scene = e.target.closest?.('.reel-scene');
            if (scene && Math.round(place(reel.t)) !== Number(scene.dataset.index)) go(Number(scene.dataset.index));
          };
          const onPointer = (e) => {
            if (e.pointerType !== 'mouse') return;
            const r = parts[current].stage.getBoundingClientRect();
            lean[current].y(gsap.utils.clamp(-7, 7, ((e.clientX - r.left - r.width / 2) / window.innerWidth) * 16));
            lean[current].x(gsap.utils.clamp(-6, 6, (-(e.clientY - r.top - r.height / 2) / window.innerHeight) * 12));
          };
          const onLeave = () => rest(current);
          window.addEventListener('reel:go', onGo);
          section.addEventListener('focusin', onFocus);
          if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
            section.addEventListener('pointermove', onPointer, { passive: true });
            section.addEventListener('pointerleave', onLeave);
          }

          return () => {
            window.removeEventListener('reel:go', onGo);
            section.removeEventListener('focusin', onFocus);
            section.removeEventListener('pointermove', onPointer);
            section.removeEventListener('pointerleave', onLeave);
            parts.forEach((p) => p.frame.removeAttribute('data-lit'));
            [track, fill, ...parts.flatMap((p) => [p.frame, p.word])].forEach((el) => {
              if (el) el.style.transform = '';
            });
            glows.forEach((g) => (g.style.opacity = ''));
            stops.forEach((s) => s.removeAttribute('data-on'));
            hint?.removeAttribute('data-gone');
            labels.forEach((b, i) => (i === 0 ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
            settle();
          };
        });
      })
      .catch(() => document.getElementById('projects')?.classList.add('reel-off'));
    return () => {
      disposed = true;
      mm?.revert();
    };
  }, []);
  return null;
}
