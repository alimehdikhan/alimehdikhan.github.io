'use client';

import { useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, BadgeCheck, Expand, X } from '@/components/ui/icons';
import { Button } from './ui/button';
import { IconTile } from './ui/icon-tile';
import { SpotlightCard } from './ui/aceternity/spotlight-card';
import { CardContainer } from './ui/aceternity/3d-card';
import { Reveal } from './fx/Reveal';
import { DUR, EASE, EASE_FADE, EASE_IN_OUT, SPRING } from './fx/motion';
import { cn } from '@/lib/utils';

/* Issuer marks are the self-hosted brand SVGs; issuers without a published
   logo (Deloitte via Forage) get a duotone seal. */
const ISSUER_LOGOS = {
  'Google Cloud Skill Badge': { file: 'googlecloud' },
  freeCodeCamp: { file: 'freecodecamp', invert: true },
  /* a wordmark, so it sits on its own white plate instead of a square tile */
  GRAStech: { plate: '/assets/logos/grastech.webp', width: 400, height: 86 },
};

function IssuerLogo({ issuer, size = 'sm' }) {
  const logo = ISSUER_LOGOS[issuer];
  if (logo?.plate) {
    return (
      <span
        aria-hidden="true"
        className={cn('inline-flex shrink-0 items-center rounded-lg bg-white ring-1 ring-black/10', size === 'lg' ? 'h-12 px-3.5' : 'h-9 px-2.5')}
      >
        <img src={logo.plate} alt="" width={logo.width} height={logo.height} className={size === 'lg' ? 'h-5 w-auto' : 'h-3.5 w-auto'} loading="lazy" decoding="async" />
      </span>
    );
  }
  const px = size === 'lg' ? 28 : 18;
  return (
    <IconTile size={size} aria-hidden="true">
      {logo ? (
        <img className={logo.invert ? 'inv-dark' : undefined} src={`/assets/icons/tech/${logo.file}.svg`} alt="" width={px} height={px} loading="lazy" decoding="async" />
      ) : (
        <BadgeCheck style={{ width: px, height: px }} />
      )}
    </IconTile>
  );
}

/* Hover choreography, driven from the card so the scan, the light sweep and
   the expand chip move as one. The lift lives on a wrapper, not on the
   shared-layout image, so the lightbox morph starts from where the scan
   actually sits. Motion skips all of it for a touch or a pen. */
const SCAN = {
  rest: { y: 0, scale: 1, transition: { type: 'spring', ...SPRING.ui } },
  hover: { y: -6, scale: 1.035, transition: { type: 'spring', ...SPRING.ui } },
};
const SHEEN = {
  rest: { x: '-120%', transition: { duration: 0 } },
  hover: { x: '120%', transition: { duration: 1.1, ease: EASE_IN_OUT } },
};
const CHIP = {
  rest: { opacity: 0, scale: 0.85, transition: { duration: DUR.fast, ease: EASE_FADE } },
  hover: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE } },
};
const MORPH = { type: 'spring', stiffness: 220, damping: 30, mass: 0.9 };

/* the matte behind a scan: a faint dot grid and a lime bloom from below */
function Matte() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--foreground)_16%,transparent)_1px,transparent_1.5px)] [background-size:16px_16px] [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_110%,rgb(var(--glow)/0.16),transparent_70%)]"
      />
    </>
  );
}

/* the frame keeps an exact 3:2 in every engine: its 8px gap lives on a
   wrapper (Safari counts a margin into an aspect-ratio box that a flex
   column stretches, making it taller than 3:2) */
const FRAME = 'relative grid aspect-[3/2] w-full place-items-center overflow-hidden rounded-[1.15rem] bg-secondary/60';

function CertificateCard({ cert, onOpen }) {
  const { scan, featured } = cert;
  return (
    /* the featured certificate spans the row: the scan on the left, its
       details beside it */
    <CardContainer maxTilt={featured ? 3 : 5} containerClassName={featured ? 'sm:col-span-2' : undefined}>
      <SpotlightCard as="article" interactive borderGlow className="h-full bg-card">
        <motion.div
          initial="rest"
          whileHover="hover"
          className={cn('flex h-full flex-col', featured && 'md:grid md:grid-cols-[1.25fr_1fr] md:items-center')}
        >
          <div className="p-2">
            {scan ? (
              <button
                type="button"
                onClick={(e) => onOpen(cert, e.currentTarget)}
                aria-label={`View the ${cert.title} certificate full size`}
                className={`${FRAME} group/scan cursor-zoom-in outline-none transition-transform duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.985] motion-reduce:active:scale-100`}
              >
                <Matte />
                {/* the scan's box is inset from the frame rather than sized from
                    its content, so its height never depends on the image and the
                    scan always fits whole, whenever it loads */}
                <motion.div variants={SCAN} className="absolute inset-5 flex items-center justify-center sm:inset-7">
                  <motion.img
                    layoutId={`cert-${cert.image}`}
                    transition={MORPH}
                    src={scan.src}
                    width={scan.width}
                    height={scan.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-auto max-h-full w-auto max-w-full rounded-md [filter:drop-shadow(0_18px_24px_rgb(0_0_0/0.35))]"
                  />
                </motion.div>
                <motion.span
                  variants={SHEEN}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_38%,rgb(var(--glow)/0.22)_50%,transparent_62%)]"
                />
                <motion.span variants={CHIP} aria-hidden="true" className="absolute top-3 right-3 group-focus-visible/scan:!opacity-100">
                  <IconTile size="sm" icon={Expand} />
                </motion.span>
              </button>
            ) : (
              <div className={FRAME}>
                <Matte />
                <IssuerLogo issuer={cert.issuer} size="lg" />
              </div>
            )}
          </div>

          <div className={cn('flex flex-1 flex-col px-5 pt-4 pb-5 sm:px-6 sm:pb-6', featured && 'md:px-8 md:py-8 md:pl-6')}>
            <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
              <IssuerLogo issuer={cert.issuer} />
              {/* a wordmark plate already reads as the name */}
              <span className={ISSUER_LOGOS[cert.issuer]?.plate ? 'sr-only' : undefined}>{cert.issuer}</span>
            </div>
            <h3
              className={cn(
                'mt-3 text-[18px] leading-snug font-semibold tracking-[-0.015em] md:text-[20px]',
                featured && 'md:text-[26px] md:leading-tight md:tracking-[-0.02em]'
              )}
            >
              {cert.title}
            </h3>
            {cert.detail && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{cert.detail}</p>}
            <div className={cn('mt-auto flex items-center justify-between gap-3 pt-5', featured && 'md:mt-6 md:pt-0')}>
              <span className="rounded-full bg-secondary px-3 py-1 text-[13px] font-medium tabular-nums">{cert.date}</span>
              {cert.verify && (
                <a
                  href={cert.verify}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${cert.title} (opens in a new tab)`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-link underline-offset-4 outline-none transition-opacity duration-150 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40 active:opacity-60"
                >
                  Verify
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </SpotlightCard>
    </CardContainer>
  );
}

/* Credential grid plus a shared-element lightbox: the scan lifts out of its
   card into a full-size view and settles back on close. Radix supplies the
   modal behaviour (focus trap, Escape, scroll lock); Motion owns the morph. */
export function CertificateGallery({ items }) {
  const [openSlug, setOpenSlug] = useState(null);
  const trigger = useRef(null);
  const active = items.find((c) => c.scan && c.image === openSlug);

  const open = (cert, el) => {
    trigger.current = el;
    setOpenSlug(cert.image);
  };
  const close = () => setOpenSlug(null);

  return (
    <>
      <Reveal stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:gap-6">
        {items.map((cert) => (
          <CertificateCard key={cert.title} cert={cert} onOpen={open} />
        ))}
      </Reveal>

      <DialogPrimitive.Root open={Boolean(active)} onOpenChange={(next) => !next && close()}>
        <AnimatePresence>
          {active && (
            <DialogPrimitive.Portal forceMount key="certificate">
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: DUR.fast, ease: EASE_FADE } }}
                  transition={{ duration: DUR.slow, ease: EASE_FADE }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content
                asChild
                forceMount
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                  trigger.current?.focus({ preventScroll: true });
                }}
              >
                {/* a phone turned sideways to read a landscape certificate is
                    short, not narrow: the frame and caption tighten so the
                    scan grows instead of shrinking */}
                <div
                  className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 p-4 outline-none sm:gap-5 sm:p-8 [@media(max-height:500px)]:gap-3 [@media(max-height:500px)]:py-3"
                  onClick={(e) => e.target === e.currentTarget && close()}
                >
                  <motion.img
                    layoutId={`cert-${active.image}`}
                    transition={MORPH}
                    src={active.scan.src}
                    width={active.scan.width}
                    height={active.scan.height}
                    alt={`${active.title} certificate from ${active.issuer}`}
                    className="h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full rounded-xl shadow-[0_40px_90px_-30px_rgb(0_0_0/0.8)] [@media(max-height:500px)]:max-h-[calc(100dvh-7.5rem)]"
                  />

                  <motion.div
                    className="flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-border bg-card/90 px-5 py-4 text-card-foreground shadow-lift [@media(max-height:500px)]:py-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: DUR.slow, ease: EASE } }}
                    exit={{ opacity: 0, y: 10, transition: { duration: DUR.fast, ease: EASE_FADE } }}
                  >
                    <div className="min-w-0">
                      <DialogPrimitive.Title className="text-[17px] leading-snug font-semibold tracking-[-0.015em]">
                        {active.title}
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                        {active.issuer} · {active.date}
                      </DialogPrimitive.Description>
                    </div>
                    {active.verify && (
                      <Button asChild size="sm">
                        <a href={active.verify} target="_blank" rel="noopener noreferrer">
                          Verify credential
                          <ArrowUpRight />
                        </a>
                      </Button>
                    )}
                  </motion.div>

                  <motion.div
                    className="absolute top-4 right-4 sm:top-6 sm:right-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.12, duration: DUR.base, ease: EASE } }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: DUR.fast } }}
                  >
                    <DialogPrimitive.Close asChild>
                      <Button variant="glass" size="icon" aria-label="Close certificate">
                        <X />
                      </Button>
                    </DialogPrimitive.Close>
                  </motion.div>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </>
  );
}
