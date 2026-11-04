import {
  CanvasTexture,
  CapsuleGeometry,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  Timer,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* Byte in 3D: the chat robot as a small three.js scene. ChatWidget imports
   this once the page is idle, keeps one renderer for the visit and moves its
   canvas in and out of the launcher. Every part is a primitive, so there is
   no model to download.

   The look: a big rounded head on a small bean of a body (big heads read as
   friendly), a glass face screen whose eyes glow and catch the light, lime
   headphone rings, a heart that beats on the chest and a hover jet below,
   which is why it floats.

   Moods match the drawn twin in Robot.js:
     idle   floats, blinks, glances about, watches a mouse pointer
     wave   the right arm comes up and wags
     think  looks up and aside, antenna flickers
     talk   mouth moves, head nods
     happy  eyes turn to arcs, little bounces (also on hover)
   On top of a mood, for a moment: express('wink' | 'love' | 'surprised'),
   emit('heart' | 'z' | 'spark'), pointAt(dx, dy), spin(), hop(); a little
   show to catch an eye, act(name) with a name from ACTS; and setSleep(true)
   dozes off, eyes shut and z's rising, until it is woken.
   Reduced motion: still poses only, drawn on demand, no particles. */

const LIME = '#d5f66b';
/* porcelain on the dark page, graphite on the light one */
const SHELL = { dark: '#eceee8', light: '#2f3330' };
const TALL = 2.13; // feet to the top of the antenna bulb, in scene units
const REST = 0.3; // arms hang a little out from the body
const HEAD_Y = 0.62; // the neck joint, which the head turns about
const EYES_Y = 0.6;
const FRONT = 0.566; // just proud of the face screen
const EYE_X = 0.25;
const SINK = 2.2; // how far Byte ducks to hide below the canvas edge

/* the shows Byte puts on to catch a visitor's eye, and how long each runs:
     dance    bobs and sways, arms swinging, sparkles
     peek     ducks below the edge, peeps over it looking about, pops up
     stretch  arms up, a yawn
     idea     the antenna flares, a hop, sparkles
     wave     a wave
     scan     a good look left, then right
     love     heart eyes and hearts
     spin     a full turn, sparkles
     jump     a hop */
export const ACTS = { dance: 2.6, peek: 2.8, stretch: 2.2, idea: 1.6, wave: 2.2, scan: 2.4, love: 1.8, spin: 1.2, jump: 0.8 };

const smooth = (x) => x * x * (3 - 2 * x);
/* hands the main thread back between the heavy steps of setting up */
const breathe = () => new Promise((resolve) => setTimeout(resolve, 0));

/* a soft round spot, for glows and the floor shadow */
function spot(rgb, alpha) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${rgb}, ${alpha})`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/* the heart on the chest: the classic two-lobed curve, point down */
function heart() {
  const h = new Shape();
  h.moveTo(5, 5);
  h.bezierCurveTo(5, 5, 4, 0, 0, 0);
  h.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  h.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
  h.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  h.bezierCurveTo(16, 7, 16, 0, 10, 0);
  h.bezierCurveTo(7, 0, 5, 5, 5, 5);
  const geometry = new ShapeGeometry(h, 10);
  geometry.center();
  geometry.rotateZ(Math.PI);
  geometry.scale(0.0068, 0.0068, 1);
  return geometry;
}

/* the little things Byte gives off: hearts, sleepy z's, sparkles */
function glyph(kind) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = LIME;
  g.beginPath();
  if (kind === 'heart') {
    g.moveTo(32, 54);
    g.bezierCurveTo(6, 36, 8, 12, 22, 12);
    g.bezierCurveTo(29, 12, 32, 17, 32, 21);
    g.bezierCurveTo(32, 17, 35, 12, 42, 12);
    g.bezierCurveTo(56, 12, 58, 36, 32, 54);
  } else if (kind === 'z') {
    g.font = '800 46px system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('z', 32, 34);
  } else {
    g.moveTo(32, 4);
    g.quadraticCurveTo(36, 28, 60, 32);
    g.quadraticCurveTo(36, 36, 32, 60);
    g.quadraticCurveTo(28, 36, 4, 32);
    g.quadraticCurveTo(28, 28, 32, 4);
  }
  g.fill();
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/* width and height are the canvas's CSS size; the robot fills `fit` pixels
   of that height with its feet `foot` pixels above the bottom edge.
   Asynchronous: the set-up pauses between its heavy steps and compiles the
   shaders in the background, so the page never freezes for it. */
export async function createRobot({ width, height, fit, foot, dark = true, reduce = false, onLost }) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = NeutralToneMapping;
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('aria-hidden', 'true');

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  scene.environmentIntensity = 0.65;
  room.dispose?.();
  pmrem.dispose();
  await breathe();

  const view = (TALL * height) / fit;
  const centre = view / 2 - (foot / height) * view;
  const camera = new PerspectiveCamera(30, width / height, 0.1, 40);
  camera.position.set(0, centre + 0.25, view / (2 * Math.tan(MathUtils.degToRad(15))));
  camera.lookAt(0, centre, 0);

  const key = new DirectionalLight('#ffffff', 1.8);
  key.position.set(2.5, 4, 5);
  /* a lime rim from behind ties it to the page */
  const rim = new DirectionalLight(LIME, 2.6);
  rim.position.set(-3, 2.5, -4);
  scene.add(key, rim);

  const shell = new MeshPhysicalMaterial({ color: dark ? SHELL.dark : SHELL.light, roughness: 0.34, metalness: 0.04, clearcoat: 1, clearcoatRoughness: 0.18 });
  const trim = new MeshPhysicalMaterial({ color: '#1b1e1c', roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const glass = new MeshPhysicalMaterial({ color: '#040505', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 });
  /* lime parts glow: unlit and untouched by tone mapping, so they stay #d5f66b */
  const glow = new MeshBasicMaterial({ color: LIME, toneMapped: false });
  const blush = new MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.32, depthWrite: false, toneMapped: false });
  const sparkle = new MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
  const glare = new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.28, depthWrite: false, toneMapped: false });
  const hands = new MeshStandardMaterial({ color: LIME, roughness: 0.38 });
  const limeSpot = spot('213, 246, 107', 0.9);
  const halo = (size, opacity) => {
    const sprite = new Sprite(new SpriteMaterial({ map: limeSpot, transparent: true, opacity, depthWrite: false, toneMapped: false }));
    sprite.scale.setScalar(size);
    return sprite;
  };

  const rig = new Group(); // float, hop, sway and turn
  const squash = new Group(); // squash and stretch, about the feet
  rig.add(squash);
  scene.add(rig);

  const shadow = new Mesh(
    new CircleGeometry(0.55, 32),
    new MeshBasicMaterial({ map: spot('0, 0, 0', 0.55), transparent: true, depthWrite: false, toneMapped: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  /* body: a soft bean with a beating heart, on a hover jet */
  const body = new Mesh(new RoundedBoxGeometry(0.7, 0.52, 0.56, 6, 0.24), shell);
  body.position.y = 0.36;
  const chest = new Mesh(heart(), glow);
  chest.position.set(0, 0.37, 0.284);
  const nozzle = new Mesh(new CylinderGeometry(0.13, 0.09, 0.07, 24), trim);
  nozzle.position.y = 0.1;
  const jet = halo(0.42, 0.7);
  jet.position.y = 0.03;
  const collar = new Mesh(new CylinderGeometry(0.2, 0.25, 0.08, 28), trim);
  collar.position.y = HEAD_Y;
  squash.add(body, chest, nozzle, jet, collar);

  const limb = new CapsuleGeometry(0.065, 0.14, 4, 12);
  const palm = new SphereGeometry(0.085, 20, 14);
  const arm = (side) => {
    const shoulder = new Group();
    shoulder.position.set(0.37 * side, 0.5, 0);
    const upper = new Mesh(limb, shell);
    upper.position.y = -0.13;
    const hand = new Mesh(palm, hands);
    hand.position.y = -0.27;
    shoulder.add(upper, hand);
    shoulder.rotation.z = REST * side;
    squash.add(shoulder);
    return shoulder;
  };
  const armL = arm(-1);
  const armR = arm(1);

  /* head: shell, glass screen with a soft inner glow and a glint of glare */
  const head = new Group();
  head.position.y = HEAD_Y;
  squash.add(head);
  const skull = new Mesh(new RoundedBoxGeometry(1.5, 1.12, 1.04, 6, 0.36), shell);
  skull.position.y = 0.56;
  const screen = new Mesh(new RoundedBoxGeometry(1.2, 0.82, 0.4, 5, 0.2), glass);
  screen.position.set(0, 0.56, 0.36);
  const backlight = new Mesh(
    new PlaneGeometry(1.06, 0.68),
    new MeshBasicMaterial({ map: spot('213, 246, 107', 0.08), transparent: true, depthWrite: false, toneMapped: false })
  );
  backlight.position.set(0, 0.56, FRONT - 0.004);
  const streak = new Mesh(new CapsuleGeometry(0.018, 0.2, 4, 8), glare);
  streak.position.set(-0.38, 0.84, FRONT);
  streak.rotation.z = -1.15;
  const dot = new Mesh(new CircleGeometry(0.018, 12), glare);
  dot.position.set(-0.5, 0.74, FRONT);
  head.add(skull, screen, backlight, streak, dot);

  /* eyes: glowing pills with a white catchlight; arcs for joy and winks */
  const eyes = new Group();
  eyes.position.set(0, EYES_Y, FRONT);
  const pill = new CapsuleGeometry(0.085, 0.13, 4, 18);
  const glint = new CircleGeometry(0.04, 16);
  const arc = new TorusGeometry(0.1, 0.028, 8, 24, Math.PI);
  const pills = [-EYE_X, EYE_X].map((x) => {
    const m = new Mesh(pill, glow);
    m.position.x = x;
    m.scale.z = 0.3;
    const g = new Mesh(glint, sparkle);
    g.position.set(0.03, 0.07, 0.1);
    m.add(g);
    return m;
  });
  const arcs = [-EYE_X, EYE_X].map((x) => {
    const m = new Mesh(arc, glow);
    m.position.set(x, -0.04, 0);
    m.scale.z = 0.5;
    m.visible = false;
    return m;
  });
  const eyeGlow = [-EYE_X, EYE_X].map((x) => {
    const g = halo(0.46, 0.22);
    g.position.set(x, 0, -0.003);
    return g;
  });
  /* the other faces: shut and sleepy, round with surprise, hearts */
  const sleepy = [-EYE_X, EYE_X].map((x) => {
    const m = new Mesh(arc, glow);
    m.position.set(x, 0.02, 0);
    m.rotation.z = Math.PI;
    m.scale.z = 0.5;
    m.visible = false;
    return m;
  });
  const disc = new CircleGeometry(0.105, 28);
  const rounds = [-EYE_X, EYE_X].map((x) => {
    const m = new Mesh(disc, glow);
    m.position.set(x, 0.01, 0.012);
    const g = new Mesh(glint, sparkle);
    g.position.set(0.035, 0.045, 0.002);
    m.add(g);
    m.visible = false;
    return m;
  });
  const loveGeo = heart();
  loveGeo.scale(1.6, 1.6, 1);
  const hearts = [-EYE_X, EYE_X].map((x) => {
    const m = new Mesh(loveGeo, glow);
    m.position.set(x, 0, 0.012);
    m.visible = false;
    return m;
  });
  eyes.add(...eyeGlow, ...pills, ...arcs, ...sleepy, ...rounds, ...hearts);

  const smile = new Mesh(new TorusGeometry(0.075, 0.022, 8, 20, Math.PI), glow);
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.38, FRONT);
  smile.scale.z = 0.5;
  const mouth = new Mesh(new SphereGeometry(0.065, 20, 12), glow);
  mouth.position.set(0, 0.35, FRONT);
  mouth.scale.set(1.3, 0.6, 0.35);
  mouth.visible = false;
  const gasp = new Mesh(new TorusGeometry(0.05, 0.018, 8, 24), glow);
  gasp.position.set(0, 0.34, FRONT);
  gasp.scale.z = 0.5;
  gasp.visible = false;
  head.add(eyes, smile, mouth, gasp);

  const cheek = new CircleGeometry(0.05, 24);
  for (const x of [-0.38, 0.38]) {
    const c = new Mesh(cheek, blush);
    c.position.set(x, 0.42, FRONT - 0.002);
    c.scale.x = 1.5;
    head.add(c);
  }

  /* headphone ears: dark cups ringed in lime */
  const cup = new CylinderGeometry(0.19, 0.19, 0.12, 28);
  const ring = new TorusGeometry(0.15, 0.03, 12, 32);
  for (const side of [-1, 1]) {
    const c = new Mesh(cup, trim);
    c.rotation.z = Math.PI / 2;
    c.position.set(0.79 * side, 0.56, 0);
    const r = new Mesh(ring, glow);
    r.rotation.y = (Math.PI / 2) * side;
    r.position.set(0.852 * side, 0.56, 0);
    head.add(c, r);
  }

  const base = new Mesh(new CylinderGeometry(0.07, 0.09, 0.05, 20), trim);
  base.position.y = 1.13;
  const stalk = new Mesh(new CylinderGeometry(0.018, 0.026, 0.24, 12), trim);
  stalk.position.y = 1.26;
  const bulb = new Mesh(new SphereGeometry(0.085, 20, 14), glow);
  bulb.position.y = 1.42;
  const bulbGlow = halo(0.55, 0.6);
  bulbGlow.position.y = 1.42;
  head.add(base, stalk, bulb, bulbGlow);

  const GLYPHS = { heart: glyph('heart'), z: glyph('z'), spark: glyph('spark') };
  const motes = Array.from({ length: 8 }, () => {
    const sprite = new Sprite(new SpriteMaterial({ map: GLYPHS.heart, transparent: true, depthWrite: false, toneMapped: false }));
    sprite.visible = false;
    rig.add(sprite);
    return { sprite, born: -1 };
  });

  /* ───── motion ───── */

  const timer = new Timer();
  timer.connect(document); // the clock stops while the tab is hidden
  const look = { x: 0, y: 0 };
  const aim = { x: 0, y: 0 };
  const s = {
    mood: 'idle',
    reduce,
    hover: 0,
    hoverTo: 0,
    press: -1,
    expr: null,
    exprUntil: -1,
    hop: -1,
    arrive: -1,
    blink: -1,
    nextBlink: 1.2,
    double: false,
    pointerAt: -10,
    nextGlance: 0,
    wave: 0,
    phase: 0,
    frame: 0,
    sleep: false,
    doze: 0,
    nextZ: 0,
    point: 0,
    pointUntil: -1,
    pointAngle: 0,
    pointAim: { x: 0, y: 0 },
    act: null,
    actAt: 0,
  };
  /* touch screens draw every other frame: the motion is slow, the battery isn't */
  const lowPower = window.matchMedia('(pointer: coarse)').matches;

  /* the act in progress, as nudges to the pose: extra height and sway,
     arm angles, a face, the antenna's flare, where to look, how far to sink */
  function acting(t) {
    const A = { y: 0, sway: 0, tilt: 0, armL: null, armR: null, stretch: 0, face: null, bulb: 0, aim: null, wave: 0, sink: 0 };
    if (!s.act) return A;
    const p = (t - s.actAt) / ACTS[s.act];
    if (p >= 1 || p < 0) {
      s.act = null;
      return A;
    }
    const env = Math.sin(p * Math.PI);
    const beat = t * 9;
    switch (s.act) {
      case 'dance':
        A.y = Math.abs(Math.sin(beat)) * 0.09 * env;
        A.sway = Math.sin(beat) * 0.15 * env;
        A.tilt = Math.sin(beat + 1) * 0.18 * env;
        A.armL = -REST - (0.6 + 0.6 * Math.sin(beat)) * env;
        A.armR = REST + (0.6 + 0.6 * Math.sin(beat + Math.PI)) * env;
        A.face = 'joy';
        break;
      case 'peek':
        /* down out of sight, up just enough for the eyes, a look round, then pop */
        A.sink =
          p < 0.2 ? smooth(p / 0.2) : p < 0.36 ? 1 : p < 0.48 ? 1 - 0.48 * smooth((p - 0.36) / 0.12) : p < 0.76 ? 0.52 : 0.52 * (1 - smooth((p - 0.76) / 0.24));
        if (p > 0.48 && p < 0.76) A.aim = { x: Math.sin((p - 0.48) * 22) * 0.8, y: -0.1 };
        if (p >= 0.76) A.face = 'surprised';
        break;
      case 'stretch':
        A.armL = -REST - 2.35 * env;
        A.armR = REST + 2.35 * env;
        A.stretch = env;
        if (p > 0.2 && p < 0.8) A.face = 'yawn';
        break;
      case 'idea':
        A.bulb = env;
        A.face = 'joy';
        A.aim = { x: 0, y: -0.7 };
        break;
      case 'wave':
        A.wave = Math.min(1, env * 4);
        A.face = 'joy';
        break;
      case 'scan':
        A.aim = { x: p < 0.33 ? -0.9 : p < 0.66 ? 0.9 : 0, y: -0.1 };
        break;
      default:
        break;
    }
    return A;
  }

  function pose(t, dt) {
    const { mood } = s;
    const still = s.reduce;
    const ease = (from, to, lambda) => (still ? to : MathUtils.damp(from, to, lambda, dt));
    const A = acting(t);

    /* where to look: at the act's spot, up and aside while thinking, at the
       reader while talking, at a moving mouse, or a glance about now and then */
    const pointing = t < s.pointUntil;
    if (pointing) {
      aim.x = s.pointAim.x;
      aim.y = s.pointAim.y;
    } else if (s.sleep) {
      aim.x = 0;
      aim.y = 0.3;
    } else if (A.aim) {
      aim.x = A.aim.x;
      aim.y = A.aim.y;
    } else if (mood === 'think') {
      aim.x = 0.45;
      aim.y = -0.6;
    } else if (still) {
      aim.x = aim.y = 0;
    } else if (t - s.pointerAt > 3 && t > s.nextGlance) {
      const ahead = mood !== 'idle' || Math.random() < 0.35;
      aim.x = ahead ? 0 : MathUtils.randFloat(-0.7, 0.7);
      aim.y = ahead ? 0 : MathUtils.randFloat(-0.35, 0.25);
      s.nextGlance = t + MathUtils.randFloat(1.8, 4.5);
    }
    look.x = ease(look.x, aim.x, 5);
    look.y = ease(look.y, aim.y, 5);
    s.wave = ease(s.wave, Math.max(mood === 'wave' ? 1 : 0, A.wave), 9);
    s.hover = ease(s.hover, s.hoverTo, 12);
    s.doze = ease(s.doze, s.sleep ? 1 : 0, s.sleep ? 1.5 : 10);
    s.point = ease(s.point, pointing ? 1 : 0, 8);
    s.phase += dt * (mood === 'think' ? 9 : 2.4);

    /* asleep, the float slows and sinks */
    const bob = still ? 0 : Math.sin(t * (1.8 - 0.9 * s.doze));
    let y = bob * (0.06 - 0.03 * s.doze) + s.hover * 0.05 - 0.04 * s.doze + A.y - A.sink * SINK;
    let sx = 1;
    let sy = 1 + 0.06 * A.stretch;
    let spin = 0;

    if (s.hop >= 0) {
      const p = (t - s.hop) / 0.75;
      if (p >= 1) s.hop = -1;
      else {
        const air = p > 0.12 && p < 0.82 ? Math.sin(((p - 0.12) / 0.7) * Math.PI) : 0;
        const crouch = p <= 0.12 ? Math.sin((p / 0.12) * Math.PI) : p >= 0.82 ? 0.8 * Math.sin(((p - 0.82) / 0.18) * Math.PI) : 0;
        y += air * 0.42;
        sy *= 1 - crouch * 0.12 + air * 0.05;
        sx *= 1 + crouch * 0.08 - air * 0.03;
      }
    }
    if (s.press >= 0) {
      const p = (t - s.press) / 0.22;
      if (p >= 1) s.press = -1;
      else {
        const k = Math.sin(p * Math.PI);
        sy *= 1 - 0.1 * k;
        sx *= 1 + 0.07 * k;
      }
    }
    /* one full turn on arrival or a spin, overshooting a touch (ease-out-back) */
    if (s.arrive >= 0) {
      const p = Math.min(1, (t - s.arrive) / 1.1);
      const q = p - 1;
      spin = -Math.PI * 2 * (1 - (1 + 2.70158 * q * q * q + 1.70158 * q * q));
      if (p >= 1) s.arrive = -1;
    }
    if (mood === 'happy' && !still) y += Math.abs(Math.sin(t * 9)) * 0.05;

    rig.position.y = y;
    rig.rotation.set(0, look.x * 0.12 + spin, (still ? 0 : Math.sin(t * 1.25) * 0.03) + A.sway);
    const grow = 1 + s.hover * 0.05;
    squash.scale.set(sx * grow, sy * grow, sx * grow);
    /* the floor shadow and the jet follow the robot up, and fade as it ducks out of sight */
    const lift = Math.max(0, y);
    shadow.scale.setScalar(1 - lift * 0.7);
    shadow.material.opacity = Math.min(1, 1 - lift * 1.2) * (1 - A.sink);
    jet.material.opacity = (0.45 + 0.3 * (still ? 0.5 : (bob + 1) / 2) + (s.hop >= 0 ? 0.25 : 0)) * (1 - A.sink);
    jet.scale.setScalar(0.38 + 0.06 * (still ? 0.5 : (bob + 1) / 2));

    const wag = still ? 0 : Math.sin(t * 12) * 0.38;
    armR.rotation.z = A.armR ?? MathUtils.lerp(REST, 2.55 + wag, s.wave);
    armL.rotation.z = A.armL ?? MathUtils.lerp(-REST - (still ? 0 : Math.sin(t * 1.8 + 1) * 0.05), s.pointAngle, s.point);

    const nod = mood === 'talk' && !still ? Math.sin(t * 7) * 0.035 : 0;
    const tilt = (mood === 'think' ? 0.12 : 0) + (still ? 0 : s.wave * Math.sin(t * 6) * 0.06) + A.tilt;
    head.rotation.set(look.y * 0.3 + nod + 0.22 * s.doze, look.x * 0.5, tilt + 0.1 * s.doze);
    eyes.position.x = look.x * 0.05;
    eyes.position.y = EYES_Y - look.y * 0.035;

    if (!still && t >= s.nextBlink) {
      s.blink = t;
      s.double = !s.double && Math.random() < 0.2;
      s.nextBlink = t + (s.double ? 0.3 : MathUtils.randFloat(2.2, 5.6));
    }
    const b = s.blink >= 0 ? (t - s.blink) / 0.15 : 1;
    const lid = b < 1 ? 1 - 0.88 * Math.sin(b * Math.PI) : 1;

    /* which face: a passing expression, the act's, sleep, then the mood's
       own (a press's wink gives way to a happy mood) */
    const expr = t < s.exprUntil && !(s.expr === 'wink' && mood === 'happy') ? s.expr : null;
    const face = expr || A.face || (s.doze > 0.5 ? 'sleep' : mood === 'happy' || (mood === 'idle' && s.hover > 0.5) ? 'joy' : 'open');
    pills.forEach((m, i) => {
      m.scale.y = lid;
      m.visible = face === 'open' || (face === 'wink' && i === 1);
    });
    arcs.forEach((m, i) => (m.visible = face === 'joy' || (face === 'wink' && i === 0)));
    sleepy.forEach((m) => (m.visible = face === 'sleep' || face === 'yawn'));
    rounds.forEach((m) => {
      m.scale.y = lid;
      m.visible = face === 'surprised';
    });
    hearts.forEach((m) => {
      m.visible = face === 'love';
      m.scale.setScalar(1 + (still ? 0 : 0.12 * Math.max(0, Math.sin(t * 9))));
    });
    gasp.visible = face === 'surprised' || face === 'yawn';
    gasp.scale.set(face === 'yawn' ? 1.3 : 1, face === 'yawn' ? 1.5 : 1, 0.5);
    mouth.visible = mood === 'talk' && face !== 'sleep' && !gasp.visible;
    smile.visible = !mouth.visible && !gasp.visible;
    const small = face === 'sleep' ? 0.6 : 1;
    smile.scale.set(small, small, 0.5);
    if (mouth.visible) mouth.scale.y = still ? 0.7 : 0.3 + 0.7 * Math.abs(Math.sin(t * 15 + Math.sin(t * 4.3) * 2));
    if (s.doze > 0.8 && !still && t > s.nextZ) {
      emit('z');
      s.nextZ = t + 1.5;
    }

    for (const m of motes) {
      if (m.born < 0) continue;
      const age = t - m.born;
      const k = age / m.life;
      if (k >= 1) {
        m.born = -1;
        m.sprite.visible = false;
        continue;
      }
      m.sprite.visible = age >= 0;
      if (age < 0) continue;
      const sway = m.kind === 'z' ? Math.sin(age * 3) * 0.06 : 0;
      m.sprite.position.set(m.x + m.vx * age + sway, m.y + m.vy * age, 0.35);
      m.sprite.material.opacity = Math.min(1, k * 6) * (1 - k);
      m.sprite.scale.setScalar(m.size * (0.6 + 0.6 * Math.min(1, k * 3)));
    }

    const pulse = still ? 0.6 : 0.5 + 0.5 * Math.sin(s.phase);
    bulbGlow.material.opacity = Math.max((0.3 + 0.5 * pulse) * (1 - 0.7 * s.doze), A.bulb);
    bulb.scale.setScalar(1 + 0.08 * pulse + 0.6 * A.bulb);
    bulbGlow.scale.setScalar(0.55 * (1 + 0.8 * A.bulb));
    /* lub-dub: two quick beats a second */
    const beat = still ? 0 : Math.max(0, Math.sin(t * 6.3)) ** 12 + 0.6 * Math.max(0, Math.sin(t * 6.3 - 0.9)) ** 12;
    chest.scale.setScalar(1 + 0.22 * beat);
  }

  function emit(kind, count = 1) {
    if (s.reduce) return;
    const start = timer.getElapsed();
    for (let i = 0; i < count; i++) {
      const m = motes.find((q) => q.born < 0) ?? motes.reduce((a, q) => (q.born < a.born ? q : a));
      m.kind = kind;
      m.sprite.material.map = GLYPHS[kind];
      m.born = start + i * 0.16;
      m.life = kind === 'z' ? 2.4 : 1.4;
      m.x = kind === 'z' ? 0.42 : MathUtils.randFloat(-0.45, 0.45);
      m.y = HEAD_Y + (kind === 'z' ? 1.05 : 0.9);
      m.vx = kind === 'z' ? 0.16 : MathUtils.randFloat(-0.25, 0.25);
      m.vy = kind === 'z' ? 0.32 : MathUtils.randFloat(0.45, 0.7);
      m.size = kind === 'z' ? 0.26 : 0.22;
    }
  }

  const draw = (dt) => {
    pose(timer.getElapsed(), dt);
    renderer.render(scene, camera);
  };
  const frame = (time) => {
    if (lowPower && s.frame++ % 2) return;
    timer.update(time);
    draw(Math.min(timer.getDelta(), 0.1));
  };
  const once = () => {
    timer.update();
    draw(0);
  };

  /* the eyes and head follow a mouse; the launcher is fixed, so its box only
     changes with the window */
  let box = null;
  const onResize = () => (box = null);
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !canvas.isConnected) return;
    box ??= canvas.getBoundingClientRect();
    aim.x = Math.tanh((e.clientX - (box.left + box.width / 2)) / 260);
    aim.y = Math.tanh((e.clientY - (box.top + box.height * 0.4)) / 260);
    s.pointerAt = timer.getElapsed();
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('resize', onResize);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    onLost?.();
  });

  /* compile the shaders now, off the main thread where the browser can
     (KHR_parallel_shader_compile), not on first sight */
  await breathe();
  await renderer.compileAsync(scene, camera);
  once();

  let active = false;
  const run = () => renderer.setAnimationLoop(active && !s.reduce ? frame : null);
  const now = () => timer.getElapsed();
  const refresh = () => active && s.reduce && once();

  return {
    canvas,
    setActive(on) {
      active = on;
      box = null;
      run();
      if (on) once();
    },
    setMood(mood) {
      s.mood = mood;
      refresh();
    },
    setHover(on) {
      s.hoverTo = on ? 1 : 0;
      refresh();
    },
    setTheme(isDark) {
      shell.color.set(isDark ? SHELL.dark : SHELL.light);
      if (active) once();
    },
    setReduce(on) {
      s.reduce = on;
      run();
      if (active) once();
    },
    press() {
      s.expr = 'wink';
      s.exprUntil = now() + 0.7;
      if (!s.reduce) s.press = now();
      refresh();
    },
    express(name, seconds = 1.2) {
      s.expr = name;
      s.exprUntil = now() + seconds;
      refresh();
    },
    emit,
    setSleep(on) {
      s.sleep = on;
      s.nextZ = now() + 0.8;
      refresh();
    },
    /* point the left arm, and the eyes, at a spot on the page (CSS pixels
       from the launcher's centre). Byte sits right of the content, so the
       arm only swings out to the left and up. */
    pointAt(dx, dy, seconds = 2.6) {
      /* the hanging arm, turned by a, points along (sin a, -cos a) */
      let a = Math.atan2(dx, dy);
      if (a > 0) a -= Math.PI * 2;
      s.pointAngle = MathUtils.clamp(a, -Math.PI, -REST);
      s.pointAim = { x: Math.tanh(dx / 260), y: Math.tanh(dy / 260) };
      s.pointUntil = now() + seconds;
      refresh();
    },
    spin() {
      if (!s.reduce) s.arrive = now();
    },
    /* one of ACTS; skipped under reduced motion or while another plays */
    act(name) {
      if (s.reduce || !ACTS[name] || s.act || s.sleep) return false;
      const at = now();
      s.act = name;
      s.actAt = at;
      if (name === 'spin') {
        s.arrive = at;
        emit('spark', 3);
      }
      if (name === 'jump') s.hop = at;
      if (name === 'idea') {
        s.hop = at;
        emit('spark', 4);
      }
      if (name === 'love') {
        s.expr = 'love';
        s.exprUntil = at + ACTS.love;
        emit('heart', 4);
      }
      if (name === 'dance') emit('spark', 2);
      return true;
    },
    hop() {
      if (!s.reduce) s.hop = now();
    },
    arrive() {
      if (!s.reduce) s.arrive = now();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      timer.dispose();
      const owned = new Set();
      scene.traverse((o) => {
        if (o.isMesh) owned.add(o.geometry);
        if (o.isMesh || o.isSprite) {
          owned.add(o.material);
          if (o.material.map) owned.add(o.material.map);
        }
      });
      owned.forEach((r) => r.dispose());
      scene.environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
