'use client';

import { useEffect, useRef } from 'react';

/* WebGL dye simulation (self-contained, no CDN).
   Advection-only solver: a curl-noise velocity field carries dye across a
   ping-ponged texture, with the pointer injecting both colour and momentum.
   Cheaper than a full pressure solve and visually close for a background.

   Runtime shape:
   - the display buffer is capped at DPR 1 / 1600px on the long side (the dye
     is blurry and bilinearly upsampled, so more pixels add nothing) and the
     sim texture at 900 / 640 / 512 depending on a measured quality tier;
   - the tier only ever steps down (one step per 2 s, from the median of the
     last 60 raw frame intervals) and bails to the CSS gradient when frames
     stay above 60 ms; `failIfMajorPerformanceCaveat` catches software GL up
     front. `localStorage.sim = 'force'` disables both (dev escape hatch);
   - the light-theme look lives in the DRAW shader (uTint / uLight) so the
     canvas stays an opaque single-pass layer instead of a CSS-filtered one;
   - resizes keep the dye: small sim-size changes reuse the textures, large
     ones copy the old field across, and the backing store is re-presented
     synchronously so no black frame is ever composited;
   - the loop pauses while the tab is hidden or the mobile menu is open
     (`html.menu-open`), survives context loss, and follows
     prefers-reduced-motion at runtime. The pre-warm under `html.is-loading`
     keeps running so the preloader curtain lifts on live dye. */

const PRECISION = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/* sin-free hash: stable on mobile GPUs where sin() of a large argument
   loses precision (the sample position grows with uTime). */
const HASH = `
float hash(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

const SIM = `${PRECISION}
varying vec2 vUv;
uniform sampler2D uDye;
uniform float uTime, uDt, uAspect, uSplat, uFlow, uOct;
uniform vec2 uPtr, uPtrVel;
uniform vec3 uColor;
${HASH}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){
    if (float(i) >= uOct) break;
    v += a * vnoise(p); p *= 2.03; a *= 0.5;
  }
  return v;
}
vec2 curl(vec2 p){
  float e = 0.012;
  float a = fbm(p + vec2(0.0, e));
  float b = fbm(p - vec2(0.0, e));
  float c = fbm(p + vec2(e, 0.0));
  float d = fbm(p - vec2(e, 0.0));
  return vec2(a - b, d - c) / (2.0 * e);
}

void main(){
  vec2 asp = vec2(uAspect, 1.0);
  vec2 p = vUv * asp;

  vec2 vel = curl(p * 2.2 + vec2(uTime * 0.045, uTime * 0.03)) * uFlow;

  vec2 d = (vUv - uPtr) * asp;
  float fall = exp(-dot(d, d) / 0.010);
  vel += uPtrVel * fall * 1.15;
  vel += vec2(-d.y, d.x) * fall * 0.55;

  vec2 src = vUv - vel * uDt;
  vec3 col = texture2D(uDye, src).rgb;

  /* time-normalised decay / splat: identical to the old per-frame constants
     at 60 Hz (0.846 = -ln(0.986) * 60, 0.21 = 0.0035 * 60). The subtractive
     term keeps a 1-LSB floor so 8-bit residue still clears at 120 Hz. */
  col *= exp(-0.846 * uDt);
  col -= max(0.21 * uDt, 0.0035);
  col += uColor * fall * uSplat * (uDt * 60.0);

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

const DRAW = `${PRECISION}
varying vec2 vUv;
uniform sampler2D uDye;
uniform vec2 uTexel;
uniform float uBloom, uLight;
uniform mat3 uTint;
${HASH}
void main(){
  vec3 c = texture2D(uDye, vUv).rgb;

  vec3 b = vec3(0.0);
  b += texture2D(uDye, vUv + uTexel * 3.0).rgb;
  b += texture2D(uDye, vUv - uTexel * 3.0).rgb;
  b += texture2D(uDye, vUv + vec2(uTexel.x, -uTexel.y) * 3.0).rgb;
  b += texture2D(uDye, vUv - vec2(uTexel.x, -uTexel.y) * 3.0).rgb;
  c += b * 0.25 * uBloom;

  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 lft = texture2D(uDye, vUv - vec2(uTexel.x, 0.0)).rgb;
  vec3 dwn = texture2D(uDye, vUv - vec2(0.0, uTexel.y)).rgb;
  float shade = 1.0 + (lum - dot(lft + dwn, vec3(0.15, 0.29, 0.06))) * 0.5;
  c *= clamp(shade, 0.85, 1.25);

  c = c / (1.0 + c) * 1.75;

  vec2 q = vUv - 0.5;
  c *= 1.0 - dot(q, q) * 0.55;

  /* Light theme: the former CSS chain invert(1) hue-rotate(195deg)
     saturate(1.5) brightness(1.04) at opacity .42 over #f3f1ec, folded into
     one matrix so the canvas stays opaque. Clamp first: the canvas would
     have clamped before the CSS filter saw it. */
  if (uLight > 0.5) {
    c = uTint * (1.0 - clamp(c, 0.0, 1.0));
    c = mix(vec3(0.953, 0.945, 0.925), clamp(c, 0.0, 1.0), 0.42);
  }

  /* +-0.5 LSB dither hides 8-bit banding in the slow gradients */
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

  gl_FragColor = vec4(c, 1.0);
}
`;

const COPY = `${PRECISION}
varying vec2 vUv;
uniform sampler2D uDye;
void main(){ gl_FragColor = texture2D(uDye, vUv); }
`;

const PALETTE = [
  [0.48, 0.35, 1.0],
  [0.22, 0.83, 0.9],
  [0.96, 0.72, 0.25],
  [0.72, 0.4, 0.95],
];

/* Quality ladder: only ever descends. `display` scales the (already DPR-1)
   backing store, `sim` caps the dye texture's long side, `oct` is the fbm
   octave count. Coarse pointers start on tier 2 as a hint. */
const TIERS = [
  { display: 1, sim: 900, bloom: 0.9, oct: 4 },
  { display: 1, sim: 640, bloom: 0.55, oct: 4 },
  { display: 1, sim: 512, bloom: 0.35, oct: 3 },
  { display: 0.75, sim: 512, bloom: 0.35, oct: 3 },
];
const COARSE_TIER = 2;
const RING = 60;
const FRAME_MIN = 1000 / 72;

/* Filter Effects spec colour matrices (row-major, applied left to right as
   the CSS chain is): M = brightness(b) * saturate(s) * hueRotate(deg).
   Returned column-major for uniformMatrix3fv. Invert is applied in-shader
   (1 - c) before this matrix. */
function tintMatrix(deg, s, b) {
  const r = (deg * Math.PI) / 180;
  const cs = Math.cos(r);
  const sn = Math.sin(r);
  const H = [
    [0.213 + cs * 0.787 - sn * 0.213, 0.715 - cs * 0.715 - sn * 0.715, 0.072 - cs * 0.072 + sn * 0.928],
    [0.213 - cs * 0.213 + sn * 0.143, 0.715 + cs * 0.285 + sn * 0.14, 0.072 - cs * 0.072 - sn * 0.283],
    [0.213 - cs * 0.213 - sn * 0.787, 0.715 - cs * 0.715 + sn * 0.715, 0.072 + cs * 0.928 + sn * 0.072],
  ];
  const S = [
    [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s],
    [0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s],
    [0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s],
  ];
  const M = [];
  for (let i = 0; i < 3; i += 1) {
    M.push([]);
    for (let j = 0; j < 3; j += 1) {
      M[i].push(b * (S[i][0] * H[0][j] + S[i][1] * H[1][j] + S[i][2] * H[2][j]));
    }
  }
  return new Float32Array([
    M[0][0], M[1][0], M[2][0],
    M[0][1], M[1][1], M[2][1],
    M[0][2], M[1][2], M[2][2],
  ]);
}
const TINT = tintMatrix(195, 1.5, 1.04);

export function FluidBackdrop() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const html = document.documentElement;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let force = false;
    try {
      force = window.localStorage.getItem('sim') === 'force';
    } catch (e) {
      /* storage blocked: no escape hatch */
    }

    let bailed = false;
    let session = null;
    /* persists across context re-inits so a restored context does not
       climb back up the ladder */
    const quality = { tier: coarse ? COARSE_TIER : 0 };

    const fallback = () => {
      canvas.style.display = 'none';
      wrap.classList.add('backdrop-fallback');
    };
    const restore = () => {
      canvas.style.display = '';
      wrap.classList.remove('backdrop-fallback');
    };
    const stop = () => {
      if (session) {
        session.dispose();
        session = null;
      }
    };
    const warn = (msg) => {
      // eslint-disable-next-line no-console
      console.warn('sim:', msg);
    };
    const bail = (why) => {
      bailed = true;
      stop();
      fallback();
      warn(why);
    };

    /* Everything tied to one GL context lives in here so it can be re-run
       after webglcontextrestored or when reduced-motion is switched off. */
    function createSession() {
      const opts = {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: !force,
      };
      const gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
      if (!gl) throw new Error('no webgl');
      if (gl.isContextLost()) throw new Error('context lost');

      function sh(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      }
      function prog(vs, fs) {
        const p = gl.createProgram();
        gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
        gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
        gl.bindAttribLocation(p, 0, 'aPos');
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
        return p;
      }

      const pSim = prog(VERT, SIM);
      const pDraw = prog(VERT, DRAW);
      const pCopy = prog(VERT, COPY);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);

      const u = {};
      ['uDye', 'uTime', 'uDt', 'uAspect', 'uSplat', 'uFlow', 'uOct', 'uPtr', 'uPtrVel', 'uColor'].forEach(
        (n) => {
          u[n] = gl.getUniformLocation(pSim, n);
        }
      );
      const d = {};
      ['uDye', 'uTexel', 'uBloom', 'uLight', 'uTint'].forEach((n) => {
        d[n] = gl.getUniformLocation(pDraw, n);
      });
      const cDye = gl.getUniformLocation(pCopy, 'uDye');

      /* constant uniforms, set once per program (values persist per program) */
      gl.useProgram(pSim);
      gl.uniform1i(u.uDye, 0);
      gl.uniform1f(u.uFlow, 0.016);
      gl.useProgram(pDraw);
      gl.uniform1i(d.uDye, 0);
      gl.uniformMatrix3fv(d.uTint, false, TINT);
      gl.useProgram(pCopy);
      gl.uniform1i(cDye, 0);

      function fbo(w, h) {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        const f = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return { tex: t, fb: f, w, h };
      }
      function del(target) {
        gl.deleteTexture(target.tex);
        gl.deleteFramebuffer(target.fb);
      }

      let simW = 0;
      let simH = 0;
      let A = null;
      let B = null;
      let cw = 1;
      let ch = 1;

      /* draw the current dye to the canvas (also used to re-present after a
         backing-store change or theme flip while the loop is paused) */
      function present() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(pDraw);
        gl.bindTexture(gl.TEXTURE_2D, A.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      function blit(src, dst) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
        gl.viewport(0, 0, dst.w, dst.h);
        gl.useProgram(pCopy);
        gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      function resize() {
        cw = canvas.clientWidth || window.innerWidth || 1;
        ch = canvas.clientHeight || window.innerHeight || 1;
        const tier = TIERS[quality.tier];
        /* display: DPR capped at 1, long side capped at 1600, tier scale */
        const s = Math.min(Math.min(window.devicePixelRatio || 1, 1) * tier.display, 1600 / Math.max(cw, ch));
        const W = Math.max(2, Math.floor(cw * s));
        const H = Math.max(2, Math.floor(ch * s));
        const ss = Math.min(1, tier.sim / Math.max(W, H));
        const nw = Math.max(2, Math.floor(W * ss));
        const nh = Math.max(2, Math.floor(H * ss));

        const first = !A;
        const sameCanvas = canvas.width === W && canvas.height === H;
        /* the sim lives in UV space, so a few percent of stretch is invisible
           and not worth losing the accumulated dye over */
        const keep = !first && Math.abs(nw - simW) / simW < 0.15 && Math.abs(nh - simH) / simH < 0.15;
        if (sameCanvas && keep) return;

        if (!sameCanvas) {
          canvas.width = W;
          canvas.height = H;
        }
        if (!keep) {
          const nA = fbo(nw, nh);
          const nB = fbo(nw, nh);
          if (!first) {
            blit(A, nA);
            del(A);
            del(B);
          }
          A = nA;
          B = nB;
          simW = nw;
          simH = nh;
          gl.useProgram(pDraw);
          gl.uniform2f(d.uTexel, 1 / simW, 1 / simH);
        }
        gl.useProgram(pSim);
        gl.uniform1f(u.uAspect, W / H);
        /* setting canvas.width cleared the drawing buffer: re-present before
           the compositor can show that black frame */
        if (!sameCanvas && !first) present();
      }

      function applyTier() {
        const tier = TIERS[quality.tier];
        gl.useProgram(pSim);
        gl.uniform1f(u.uOct, tier.oct);
        gl.useProgram(pDraw);
        gl.uniform1f(d.uBloom, tier.bloom);
        canvas.dataset.simTier = String(quality.tier);
        resize();
      }

      /* pointer / autopilot */
      const ptr = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, vx: 0, vy: 0 };
      let userX = 0.5;
      let userY = 0.5;
      let lastCX = NaN;
      let lastCY = NaN;
      let lastInput = -1e9;
      let burst = 0;
      let scrollV = 0;
      let lastScrollY = window.scrollY || 0;

      /* loop state */
      let alive = true;
      let running = true;
      let loaded = false;
      let measureFrom = Infinity;
      let rafId = 0;
      let rt = 0;
      const t0 = performance.now();
      let last = t0;
      let lastRaf = t0;
      let lastDraw = -1e9;

      /* adaptive quality: median of the last RING raw rAF intervals */
      const ring = new Float32Array(RING);
      let ringN = 0;
      let ringI = 0;
      let ringSum = 0;
      let lastStep = -1e9;
      let slowSince = 0;

      function resetRing() {
        ring.fill(0);
        ringN = 0;
        ringI = 0;
        ringSum = 0;
        slowSince = 0;
      }
      function median() {
        const s = Array.prototype.slice.call(ring, 0, ringN).sort((a, b) => a - b);
        return s[ringN >> 1];
      }
      function adapt(now, raw) {
        ringSum += raw - ring[ringI];
        ring[ringI] = raw;
        ringI = (ringI + 1) % RING;
        if (ringN < RING) ringN += 1;
        /* decide on a full ring, or sooner once the samples span 2 s */
        if (ringN < RING && ringSum < 2000) return;
        const med = median();
        if (med > 60 && !force) {
          if (!slowSince) slowSince = now;
          if (now - slowSince > 2000) {
            bail('frames above 60 ms for 2 s, using the gradient');
            return;
          }
        } else {
          slowSince = 0;
        }
        if (med > 22 && quality.tier < TIERS.length - 1 && now - lastStep > 2000) {
          quality.tier += 1;
          lastStep = now;
          resetRing();
          applyTier();
        }
      }

      const onMove = (e) => {
        /* Chrome re-dispatches a pointermove after scroll with the pointer
           unmoved: same client coords, so it must not count as input */
        if (e.clientX === lastCX && e.clientY === lastCY) return;
        lastCX = e.clientX;
        lastCY = e.clientY;
        userX = e.clientX / cw;
        userY = 1 - e.clientY / ch;
        lastInput = performance.now();
      };
      const onDown = (e) => {
        lastCX = e.clientX;
        lastCY = e.clientY;
        userX = e.clientX / cw;
        userY = 1 - e.clientY / ch;
        /* touch: pointerdown precedes the first pointermove, so seed the
           eased pointer here (px/py too, so it is a burst, not a velocity
           spike) */
        ptr.x = userX;
        ptr.px = userX;
        ptr.y = userY;
        ptr.py = userY;
        lastInput = performance.now();
        burst = 1.0;
      };
      const onScroll = () => {
        const y = window.scrollY || 0;
        scrollV += (y - lastScrollY) / ch;
        lastScrollY = y;
      };
      const onResize = () => {
        clearTimeout(rt);
        rt = setTimeout(resize, 150);
      };
      /* one run gate: hidden tab or open mobile menu pauses the loop; the
         preloader (html.is-loading) does not, so the field pre-warms */
      const gate = () => {
        if (!loaded && !html.classList.contains('is-loading')) {
          loaded = true;
          /* let the hero choreography settle before judging frame times */
          measureFrom = performance.now() + 1500;
        }
        const was = running;
        running = !document.hidden && !html.classList.contains('menu-open');
        if (running && !was) {
          const n = performance.now();
          last = n;
          lastRaf = n;
        }
      };
      const theme = () => {
        gl.useProgram(pDraw);
        gl.uniform1f(d.uLight, html.getAttribute('data-theme') === 'light' ? 1 : 0);
        if (A) present();
      };
      const mo = new MutationObserver((muts) => {
        for (let i = 0; i < muts.length; i += 1) {
          if (muts[i].attributeName === 'data-theme') theme();
          else gate();
        }
      });

      theme();
      gate();
      applyTier();

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      if (!coarse) window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', gate);
      mo.observe(html, { attributes: true, attributeFilter: ['class', 'data-theme'] });

      function frame(now) {
        if (!alive) return;
        rafId = requestAnimationFrame(frame);
        if (!running) return;

        /* raw rAF cadence (including frames the cap below skips) is what
           the rest of the page feels, so that is what the tier is judged on */
        const raw = now - lastRaf;
        lastRaf = now;
        if (now >= measureFrom && raw > 0 && raw < 1000) {
          adapt(now, raw);
          if (!alive) return;
        }

        /* ~72 Hz cap: 60 on 120 Hz panels, 72 on 144, untouched on 60 */
        if (now - lastDraw < FRAME_MIN) return;
        lastDraw = now;

        /* rAF timestamps can precede the performance.now() captured at init,
           so clamp — a negative t makes the palette index go out of bounds. */
        const dt = Math.min(Math.max((now - last) / 1000, 0), 0.033);
        last = now;
        const t = Math.max((now - t0) / 1000, 0);

        /* target = user position blended toward the autopilot path by
           idleness (0 -> 1 over 2.6 s), then eased; velocity comes from the
           eased pointer so it is bounded by construction and never snaps */
        const idle = Math.min(Math.max((now - lastInput) / 2600, 0), 1);
        const ax = 0.5 + 0.3 * Math.sin(t * 0.31) + 0.12 * Math.sin(t * 0.83);
        const ay = 0.5 + 0.26 * Math.cos(t * 0.27) + 0.1 * Math.cos(t * 0.71);
        const tx = userX + (ax - userX) * idle;
        const ty = userY + (ay - userY) * idle;
        const k = 1 - Math.exp(-dt * 6);
        ptr.x += (tx - ptr.x) * k;
        ptr.y += (ty - ptr.y) * k;

        const inv = 1 / Math.max(dt, 0.001);
        ptr.vx = (ptr.x - ptr.px) * inv;
        ptr.vy = (ptr.y - ptr.py) * inv;
        ptr.px = ptr.x;
        ptr.py = ptr.y;

        /* scroll momentum: a flick gives the field a brief vertical drift */
        if (scrollV !== 0) {
          ptr.vy += Math.max(-2, Math.min(2, scrollV * inv)) * 0.25;
          scrollV *= Math.pow(0.6, dt * 60);
          if (Math.abs(scrollV) < 1e-4) scrollV = 0;
        }

        const vm = Math.sqrt(ptr.vx * ptr.vx + ptr.vy * ptr.vy);
        if (vm > 3) {
          ptr.vx *= 3 / vm;
          ptr.vy *= 3 / vm;
        }
        const speed = Math.min(vm, 3);
        /* autopilot weight 0.55 blended by idleness; floor keeps the field
           from starving while the mouse is parked */
        const amt = Math.max(Math.min(speed * 0.85, 1.1) * (1 - 0.45 * idle) + burst, 0.05);
        burst *= Math.pow(0.9, dt * 60);

        const ph = (t * 0.09) % 1;
        const i0 = Math.floor(ph * PALETTE.length) % PALETTE.length;
        const i1 = (i0 + 1) % PALETTE.length;
        const f = (ph * PALETTE.length) % 1;
        const col = [
          PALETTE[i0][0] + (PALETTE[i1][0] - PALETTE[i0][0]) * f,
          PALETTE[i0][1] + (PALETTE[i1][1] - PALETTE[i0][1]) * f,
          PALETTE[i0][2] + (PALETTE[i1][2] - PALETTE[i0][2]) * f,
        ];

        /* sim pass: A -> B */
        gl.bindFramebuffer(gl.FRAMEBUFFER, B.fb);
        gl.viewport(0, 0, simW, simH);
        gl.useProgram(pSim);
        gl.bindTexture(gl.TEXTURE_2D, A.tex);
        gl.uniform1f(u.uTime, t);
        gl.uniform1f(u.uDt, dt);
        gl.uniform1f(u.uSplat, amt * 0.16);
        gl.uniform2f(u.uPtr, ptr.x, ptr.y);
        gl.uniform2f(u.uPtrVel, ptr.vx * 0.5, ptr.vy * 0.5);
        gl.uniform3f(u.uColor, col[0], col[1], col[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        const tmp = A;
        A = B;
        B = tmp;

        /* display pass */
        present();
      }
      rafId = requestAnimationFrame(frame);

      return {
        dispose() {
          alive = false;
          cancelAnimationFrame(rafId);
          clearTimeout(rt);
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerdown', onDown);
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onResize);
          document.removeEventListener('visibilitychange', gate);
          mo.disconnect();
          delete canvas.dataset.simTier;
          if (A) del(A);
          if (B) del(B);
          gl.deleteBuffer(buf);
          gl.deleteProgram(pSim);
          gl.deleteProgram(pDraw);
          gl.deleteProgram(pCopy);
          /* NOTE: no loseContext() here — StrictMode remounts reuse the same
             canvas, and a lost context can never be re-acquired from it. */
        },
      };
    }

    const start = () => {
      stop();
      if (mq.matches || bailed) {
        fallback();
        return;
      }
      restore();
      try {
        session = createSession();
      } catch (e) {
        warn(e.message);
        fallback();
      }
    };

    /* context loss: stop issuing GL calls and show the gradient; on restore
       the whole session is rebuilt on the same canvas */
    const onLost = (e) => {
      e.preventDefault();
      stop();
      fallback();
    };
    const onRestored = () => start();
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    /* prefers-reduced-motion can change mid-session */
    const onPref = () => start();
    if (mq.addEventListener) mq.addEventListener('change', onPref);
    else mq.addListener(onPref);

    start();

    return () => {
      stop();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (mq.removeEventListener) mq.removeEventListener('change', onPref);
      else mq.removeListener(onPref);
      restore();
    };
  }, []);

  return (
    <div className="backdrop" ref={wrapRef} aria-hidden="true" role="presentation">
      <canvas id="sim" ref={canvasRef} />
      <div className="scrim" />
      <div className="lines" />
      <div className="grain" />
    </div>
  );
}
