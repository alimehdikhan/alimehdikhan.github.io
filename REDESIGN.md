# Portfolio design and motion

The content in `data/resume.js`, section order, navigation labels, contact endpoint, and résumé links are unchanged. The site still uses Next.js 13.5.6 with `output: 'export'`.

## Preview

```sh
npm run dev                      # live development at http://localhost:3000
npm run build                    # static export to out/
node scripts/serve-preview.cjs   # serves out/ at http://127.0.0.1:4173
```

## Stack

- **Tailwind CSS v4** for all styling. Design tokens are CSS variables in `styles/globals.css`, exposed to Tailwind through `@theme inline`. `.theme-lime` is a local token scope: everything inside the contact panel renders as ink on lime without per-component overrides.
- **shadcn/ui** (`components.json`, JS) primitives in `components/ui/`: `button`, `card`, `input`, `textarea`, `label`, `dialog`, plus `magnetic` and `directional-card`.
- **Aceternity UI**, adapted, in `components/ui/aceternity/`: `spotlight-card` (cursor-following highlight and border glow) and `3d-card` (project tilt).
- **Motion** for interface motion: portrait tilt, parallax and badge entrance, expanding entrance rings, masked heading reveals, scroll reveals, magnetic buttons, card highlights, directional hover, nav underline, menu, toast, counters, anchor travel.
- **GSAP ScrollTrigger** (`components/fx/gsap.js`, loaded on demand once the browser is idle) for the three scroll-linked sequences: projects, timeline rail, contact panel. GSAP and Motion never animate the same element; each sequence file lists which layer it owns.
- **Canvas 2D** for the hero particle vortex. Three.js was not needed: depth-layered particles give the parallax at a fraction of the cost.
- Native scrolling throughout (no smooth-scroll library, no CSS `scroll-behavior`); deep links land instantly.

## Design (Apple-inspired layout, black and lime)

- Type: `-apple-system, BlinkMacSystemFont, "SF Pro Display", Manrope, "Segoe UI", sans-serif`; Instrument Serif italic for highlighted words. Body 17px; headings semibold with tight tracking.
- Colour: dark by default (ground `#090A0A`, lime `#D5F66B`, text `#F2F2EA`, muted `#A0A4A0`, borders `#2B2E2B`). The light theme uses white / `#F5F5F7` with lime fills and olive `#4A6300` for lime-as-text and focus rings.
- Layout: 8px grid, 1200px content width, sections 64 / 96 / 112px apart on phone / tablet / desktop.
- Each section has its own composition and its own effect:
  - **Hero**: split introduction and portrait stage.
  - **About**: bento of stat cards (2×2 on phones) with the cursor-following highlight.
  - **Skills**: 2×2 category cards.
  - **Experience**: timeline whose rail draws with scroll and whose nodes pop as it reaches them.
  - **Projects**: two-column cards that stack in 3D on desktop.
  - **Certifications**: a single list with a directional lime wash per row.
  - **GitHub**: text, stats and a terminal.
  - **Contact**: a lime panel that expands into view.

## Choreography

- **Hero entrance** (CSS keyframes, so it starts on first paint; the portrait is the LCP element):
  1. The headline words rise out of their masks.
  2. The copy follows in a stagger.
  3. The portrait swings forward in depth.
  4. Three lime rings expand from the disc (Motion).
  5. The particle vortex fades in spinning fast, then settles.
  6. The badges slide in one by one and start floating.
- **Hero interaction**: the stage tilts up to 5° on a soft spring while the glow, rings, portrait and badges drift by their own depths. The vortex light and a light patch on the disc follow the cursor. The vortex centre leans toward the cursor by depth and nearby particles are pushed aside.
- **Section headings**: the title rises out of a masked line on a spring after its eyebrow fades in. Content blocks use a 16px upward fade, and the timeline cards slide in from the side.
- **Projects (desktop, when every card fits under the nav)**:
  - Cards are sticky and stack.
  - The incoming card tilts up out of perspective as it rises, while the outgoing one tips back, scales to 90% and dims (scrubbed to the same scroll range).
  - Each card's artwork wipes in and its details stagger up on arrival.
  - Phones, short screens and reduced motion get a normal vertical list.
- **Contact**: the panel expands from a narrow rounded window to full size (scrubbed), and its content fades in over the last part so no half-clipped text shows. The headline lines then mask in.
- **Removed as distracting**: the Aceternity beam behind the headline, the rotating orbit rings and the halo pulse.

## UX conventions

- Navigation: six section links, no Home link (the logo returns to the top). No link is highlighted while the hero or the GitHub section is in view, and the bar turns 90% opaque on scroll so its links stay readable over the lime panel.
- Headings: section titles are h2. Card labels ("Summary", "Core Focus Areas", "Awards & Honors", stat names, skill groups) share one small caps label style; subsections inside a card are h4.
- Project cards scan top-down: number and category, title, a highlighted Results callout, the Live Demo / Code actions, then overview, implementation and the technology list.
- Hover feedback only where something is clickable: buttons, links, contact rows and project cards. Static cards and skill pills do not move. The certification rows' directional wash is a reading highlight.
- Controls: every button is the shadcn Button (pill; icon buttons round and 40px). Object icons lead the label (Download, Code, Mail, Copy, Send); arrows trail it (↗ opens a new tab, ↓ jumps within the page). Decorative icon tiles are rounded squares. Mail links never open a new tab.
- Spacing: the hero only fills the viewport on large screens (capped at 960px), so the portrait follows the calls to action on phones; the tech marquee sits in the existing gap between sections without extra margin.

## Interaction, feedback and accessibility

- Primary buttons are magnetic (up to 8px, mouse only) with press feedback.
- Contact puts the main actions first: an email button and a copy button that confirms "Copied" (announced via a live region).
- Contact form, sending (`components/SendButton.js`): a light sweeps through the button, the paper plane flies in place and the label's dots pulse; a progress bar runs along the card's top edge and the fields lock (read-only and dimmed) so nothing changes mid-send. Focus stays on the button.
- Contact form, success (`components/ContactSuccess.js`), about two seconds:
  1. An ink circle floods out of the Send button and fills the whole card.
  2. A lime ring draws and the check badge springs in, then the checkmark strokes in.
  3. Three shockwave rings pulse out and about 130 confetti pieces (70 on phones) burst from the badge with gravity, drag and spin.
  4. "Thank you for *reaching out!*" rises word by word, followed by "Message sent. Your note is in my inbox — I'll get back to you soon."
  5. "Send another message" collapses the scene back into the button and returns focus to the Name field.
  The scene stays until dismissed, the form behind it is `inert`, and focus moves to the headline so it is announced. Reduced motion: a plain fade, no burst, rings or word animation.
- Sending is guarded synchronously against repeat submits (Enter, Enter, click sends one request). A failure keeps everything typed and shows the error toast, which is now used only for errors.
- The tech marquee pauses on hover. A real toggle button (shown on hover, focus or while paused) pauses it for keyboard users, and clicking the strip still toggles.
- Touch devices get no cursor effects. Reduced motion disables the entrance, reveals, masks, tilt, parallax, magnetic pull, vortex animation (one still frame), stacking, scrubbed sequences, card lifts, the marquee and animated anchor travel.
- Offscreen: the vortex stops drawing and the hero's CSS loops pause; ScrollTrigger sequences only move on scroll.
- Keyboard: 38 tab stops in logical order, all with a visible focus indicator; skip link; the mobile menu dialog traps focus, closes on Escape and returns focus to its trigger.

## Verification (local, this machine)

- Links: all 17 unique destinations checked (in-page anchors exist, résumé PDF and GitHub / Hugging Face / Maps return 200; LinkedIn answers scripts with its 999 bot response). Every new-tab link has `noopener`.
- Form (submissions intercepted, nothing sent): validation messages and focus on the first invalid field, no request while invalid, spinner with disabled/`aria-busy` while sending, success toast with cleared fields and the right payload, error toast that keeps the input, dismissible toasts; copy-email confirms and fills the clipboard.
- Contrast: Lighthouse accessibility 100 (mobile and desktop); axe on the fully revealed page in dark and light themes reports only the dimmed card stacked behind the active project (intentional, restored on scroll).

- `npm run build` passes; GSAP is split into its own chunks.
- Headless Chrome screenshots at 1440×900 (dark and light) and 390×844, plus a reduced-motion pass, with no console errors. Frame pacing while scrolling through the project sequence averaged 10ms with no frames over 34ms.
- Mobile Lighthouse on the static export, six runs: accessibility 100, best practices 100, SEO 100. Performance had a median of about 80, ranging 77–85 with two outliers (55, 57) where hydration fell late in the trace. Observed LCP was 0.7–0.85s on most runs.
