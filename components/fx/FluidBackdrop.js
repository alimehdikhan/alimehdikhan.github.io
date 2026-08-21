'use client';

import { useEffect, useRef } from 'react';

/* WebGL dye simulation (self-contained, no CDN).
   Advection-only solver: a curl-noise velocity field carries dye across a
   ping-ponged texture, with the pointer injecting both colour and momentum.
   Cheaper than a full pressure solve and visually close for a background. */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const SIM = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uDye;
uniform float uTime, uDt, uAspect, uSplat, uFlow;
uniform vec2 uPtr, uPtrVel;
uniform vec3 uColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.03; a *= 0.5; }
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

  col *= 0.986;
  col -= 0.0035;
  col += uColor * fall * uSplat;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

const DRAW = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uDye;
uniform vec2 uTexel;
uniform float uBloom;

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

  gl_FragColor = vec4(c, 1.0);
}
`;

const PALETTE = [
  [0.48, 0.35, 1.0],
  [0.22, 0.83, 0.9],
  [0.96, 0.72, 0.25],
  [0.72, 0.4, 0.95],
];

export function FluidBackdrop() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = (navigator.hardwareConcurrency || 4) <= 4;

    const cleanups = [];
    let disposed = false;

    const fallback = () => {
      canvas.style.display = 'none';
      wrap.classList.add('backdrop-fallback');
      cleanups.push(() => {
        canvas.style.display = '';
        wrap.classList.remove('backdrop-fallback');
      });
    };

    const initGL = () => {
      const opts = { alpha: false, depth: false, stencil: false, antialias: false };
      const gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
      if (!gl) throw new Error('no webgl');

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

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

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

      let simW;
      let simH;
      let A;
      let B;
      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(2, Math.floor(canvas.clientWidth * dpr));
        canvas.height = Math.max(2, Math.floor(canvas.clientHeight * dpr));
        const cap = coarse || lowPower ? 512 : 900;
        const scale = Math.min(1, cap / Math.max(canvas.width, canvas.height));
        simW = Math.max(2, Math.floor(canvas.width * scale));
        simH = Math.max(2, Math.floor(canvas.height * scale));
        if (A) {
          gl.deleteTexture(A.tex);
          gl.deleteFramebuffer(A.fb);
        }
        if (B) {
          gl.deleteTexture(B.tex);
          gl.deleteFramebuffer(B.fb);
        }
        A = fbo(simW, simH);
        B = fbo(simW, simH);
      }
      resize();

      const u = {};
      ['uDye', 'uTime', 'uDt', 'uAspect', 'uSplat', 'uFlow', 'uPtr', 'uPtrVel', 'uColor'].forEach(
        (n) => {
          u[n] = gl.getUniformLocation(pSim, n);
        }
      );
      const d = {
        uDye: gl.getUniformLocation(pDraw, 'uDye'),
        uTexel: gl.getUniformLocation(pDraw, 'uTexel'),
        uBloom: gl.getUniformLocation(pDraw, 'uBloom'),
      };

      /* pointer / autopilot */
      const ptr = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, vx: 0, vy: 0 };
      let lastInput = -9999;
      let auto = true;
      let running = true;
      let burst = 0;
      let rt;
      let rafId;

      const onMove = (e) => {
        ptr.x = e.clientX / window.innerWidth;
        ptr.y = 1 - e.clientY / window.innerHeight;
        lastInput = performance.now();
        auto = false;
      };
      const onDown = () => {
        burst = 1.0;
      };
      const onResize = () => {
        clearTimeout(rt);
        rt = setTimeout(resize, 200);
      };
      const onVis = () => {
        running = !document.hidden;
        if (running) last = performance.now();
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVis);

      const t0 = performance.now();
      let last = t0;

      function frame(now) {
        if (disposed) return;
        rafId = requestAnimationFrame(frame);
        if (!running) return;

        /* rAF timestamps can precede the performance.now() captured at init,
           so clamp — a negative t makes the palette index go out of bounds. */
        const dt = Math.min(Math.max((now - last) / 1000, 0), 0.033);
        last = now;
        const t = Math.max((now - t0) / 1000, 0);

        if (now - lastInput > 2600) auto = true;
        if (auto) {
          ptr.x = 0.5 + 0.3 * Math.sin(t * 0.31) + 0.12 * Math.sin(t * 0.83);
          ptr.y = 0.5 + 0.26 * Math.cos(t * 0.27) + 0.1 * Math.cos(t * 0.71);
        }

        ptr.vx = (ptr.x - ptr.px) / Math.max(dt, 0.001);
        ptr.vy = (ptr.y - ptr.py) / Math.max(dt, 0.001);
        ptr.px = ptr.x;
        ptr.py = ptr.y;

        const speed = Math.min(Math.sqrt(ptr.vx * ptr.vx + ptr.vy * ptr.vy), 3.0);
        const amt = Math.min(speed * 0.85, 1.1) * (auto ? 0.55 : 1.0) + burst;
        burst *= 0.9;

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
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, A.tex);
        gl.uniform1i(u.uDye, 0);
        gl.uniform1f(u.uTime, t);
        gl.uniform1f(u.uDt, dt);
        gl.uniform1f(u.uAspect, canvas.width / canvas.height);
        gl.uniform1f(u.uSplat, amt * 0.16);
        gl.uniform1f(u.uFlow, 0.016);
        gl.uniform2f(u.uPtr, ptr.x, ptr.y);
        gl.uniform2f(u.uPtrVel, ptr.vx * 0.5, ptr.vy * 0.5);
        gl.uniform3f(u.uColor, col[0], col[1], col[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        const tmp = A;
        A = B;
        B = tmp;

        /* display pass */
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(pDraw);
        gl.bindTexture(gl.TEXTURE_2D, A.tex);
        gl.uniform1i(d.uDye, 0);
        gl.uniform2f(d.uTexel, 1 / simW, 1 / simH);
        gl.uniform1f(d.uBloom, coarse || lowPower ? 0.35 : 0.9);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      rafId = requestAnimationFrame(frame);

      cleanups.push(() => {
        cancelAnimationFrame(rafId);
        clearTimeout(rt);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVis);
        if (A) {
          gl.deleteTexture(A.tex);
          gl.deleteFramebuffer(A.fb);
        }
        if (B) {
          gl.deleteTexture(B.tex);
          gl.deleteFramebuffer(B.fb);
        }
        gl.deleteBuffer(buf);
        gl.deleteProgram(pSim);
        gl.deleteProgram(pDraw);
        /* NOTE: no loseContext() here — StrictMode remounts reuse the same
           canvas, and a lost context can never be re-acquired from it. */
      });
    };

    if (reduce) {
      fallback();
    } else {
      try {
        initGL();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('sim:', e.message);
        fallback();
      }
    }

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
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
