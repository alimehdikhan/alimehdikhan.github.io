# Portfolio design and motion

The content in `data/resume.js`, section order, navigation labels, contact endpoint, and résumé links are unchanged. The site still uses Next.js 13.5.6 with `output: 'export'`.

## Preview

```sh
npm run build
node scripts/serve-preview.cjs
```

Open http://127.0.0.1:4173. The preview serves `out/`, including gzip compression for HTML, JavaScript, CSS, and SVG.

## Design

- Apple system typography throughout: San Francisco on Apple platforms, native sans-serif fallbacks elsewhere. No proprietary Apple font files are redistributed.
- Compact floating navigation island, existing dark/light toggle, 96px desktop and 64px phone section spacing.
- Original portrait colours, responsive WebP copies, and a brief hover ripple. The original PNG is retained.
- Content is visible in static HTML. Heading wipes start at 85% of viewport height and last 500ms; other reveals last 420ms.
- The skills marquee sits between About and Skills. Scroll velocity increases its speed; hover, focus, and reduced motion stop it. Its separate pause icon has been removed; clicking the strip or pressing Enter/Space while focused toggles persistent pause.
- Projects use full-width case studies with the title and primary action first, 16px overview text, a restrained technology list, and a separate results footer. On mobile, names and links appear before the artwork. Project selectors sit above the gallery and work as native anchors without JavaScript. Desktop galleries have scroll-linked horizontal travel; keyboard focus brings the focused project into view. Hover previews stay in the artwork area, clear of the descriptions.
- Pinning requires a fine pointer, at least 1100px width and 820px height, and enough room for all content. Smaller/shorter viewports, enlarged content, no JavaScript, and reduced motion use stacked projects.
- Custom SVG artwork depicts speech and imaging volumes; it is illustrative, not an invented application screenshot. Regenerate it with `node scripts/generate-project-art.cjs`. Hover depth and floating title previews are disabled with reduced motion.
- Contact lettering responds to pointer proximity through font weight. Focus underlines and the existing confirmed submission success state remain accessible.

## Motion implementation

New npm dependencies are `gsap` (ScrollTrigger and SplitText included) and `lenis`. Existing Framer Motion remains for controls and navigation.

`ClientEffects.js` lazy-loads WebGL through `next/dynamic` with `ssr: false`, after first paint. Touch devices and reduced-motion users do not load the canvases. Canvas DPR is capped at 2. The trail stops after pointer inactivity; canvas, marquee, and smooth-scroll loops pause when the tab is hidden.

`fluidTrail.js` adapts Pavel Dobryakov's [WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation). Its MIT notice is retained in the source and `public/fluid-simulation-LICENSE.txt`. The integration removes the demo UI, analytics, random bursts, external texture requests, and touch handlers. Low-performance or unavailable WebGL falls back to a Canvas 2D ribbon.

Final trail tuning: 34% layer opacity, 0.18 bloom intensity, 0.07 splat radius, and 3.5 density dissipation. It is behind the content, never above headings or the portrait. Colours are amber, teal, and violet.

## Verification

The UI UX Pro Max review checklist informed the project gallery follow-up: 48px controls with press feedback, relative text sizes, 16px mobile body text, visible focus and selection states, and keyboard activation that moves focus into the chosen project. Pinning is re-measured after resize and removed when enlarged content no longer fits. Pointer previews cache their bounds, and artwork reset tweens only run after an actual hover movement.

The static export, four requested widths (375, 768, 1280, 1920), dark/light themes, JavaScript-disabled content, reduced motion, mobile navigation/Escape, project keyboard focus, and local mocked form success/validation have been checked. Form tests intercept the request and do not send a message.

Mobile Lighthouse reports are written locally to `.cache/lighthouse-mobile.json`. Scores depend on the host and should be rechecked on the deployed GitHub Pages build. On this Windows host, Lighthouse writes the report but its Chrome temporary-directory cleanup can fail with EPERM; the report remains readable.
