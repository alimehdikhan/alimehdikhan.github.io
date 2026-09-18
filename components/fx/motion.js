/* Motion tokens — the one vocabulary every animation on the page shares.
   Movement uses EASE (expo-out, mirrors the CSS `--ease` curve); opacity uses
   EASE_FADE (fast-out) so a block is legible early while its rise is still
   travelling. Springs are grouped by job so magnets, pills and the cursor
   ring feel like siblings rather than six different products. */

export const EASE = [0.19, 1, 0.22, 1];
export const EASE_FADE = [0.2, 0, 0, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];
/* back-compat alias: this was mis-named after CSS `ease`; it is the fade curve */
export const EASE_CSS = EASE_FADE;

export const DUR = { fast: 0.2, base: 0.3, slow: 0.45, rise: 0.45 };

export const SPRING = {
  /* magnets and small UI: ζ≈1.1, settles in ~250ms without overshoot */
  snappy: { stiffness: 300, damping: 30, mass: 0.6 },
  /* pill, toast, icon swaps: ζ≈0.87, one soft settle */
  ui: { stiffness: 260, damping: 28 },
  /* cursor ring: critically damped trail */
  trail: { stiffness: 160, damping: 26, mass: 1 },
  /* smoothing for scroll-linked values (parallax, progress hairline) */
  scroll: { stiffness: 120, damping: 24, mass: 0.4 },
};

/* shared magnet: both MagneticButton and the contact pill pull by this much */
export const MAG = { strength: 0.22, spring: SPRING.snappy };

export const STAGGER = { item: 0.06, cell: 0.03, link: 0.035 };

/* Reveal trigger: 160px lead above (upward scroll / hash landings), and the
   block's top must be 48px inside the viewport below, so the rise is seen. */
export const VIEWPORT = { once: true, amount: 0, margin: '0px 0px -15% 0px' };

/* block reveal: fast fade, slow visible rise */
export const BLOCK_T = {
  opacity: { duration: DUR.base, ease: EASE_FADE },
  y: { duration: DUR.rise, ease: EASE },
};

/* per-item variant for staggered children of a <Reveal stagger>; no `delay`
   here so the parent's staggerChildren orchestrates the timing */
export const ITEM = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: DUR.base, ease: EASE_FADE },
      y: { duration: DUR.slow, ease: EASE },
    },
  },
};

export const INSTANT = { duration: 0 };
