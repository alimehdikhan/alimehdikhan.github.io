'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Check,
  Code,
  Copy,
  CornerDownLeft,
  Download,
  GithubMark,
  Home,
  Layers,
  LinkedinMark,
  Mail,
  Moon,
  Play,
  Pulse,
  Search,
  Send,
  Star,
  Sun,
  User,
} from '@/components/ui/icons';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { scrollToHash } from './fx/scrollTo';
import { revealSection } from './fx/revealSection';
import { switchTheme } from './fx/themeSwitch';
import { trackClick } from './fx/trackClick';
import { trackResumeDownload } from './fx/trackDownload';
import { SPRING } from './fx/motion';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

const REPO_URL = `https://github.com/${RESUME.starRepo.path}`;
const DEMO_URL = RESUME.projects.find((p) => p.github === REPO_URL)?.demo;
const activeSpring = { type: 'spring', ...SPRING.ui };

const openTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

/* each row: what it says, other words it answers to, and what it does */
const SECTIONS = [
  { id: 'hero', label: 'Home', Icon: Home, keys: 'top start intro hello' },
  { id: 'about', label: 'About', Icon: User, keys: 'bio summary who' },
  { id: 'skills', label: 'Skills', Icon: Layers, keys: 'stack tech tools languages' },
  { id: 'experience', label: 'Experience', Icon: Briefcase, keys: 'work jobs imapro grastech internship' },
  { id: 'projects', label: 'Projects', Icon: Code, keys: 'work vocaly cancer built' },
  { id: 'certifications', label: 'Certifications', Icon: BadgeCheck, keys: 'certificates google deloitte freecodecamp' },
  { id: 'opensource', label: 'GitHub activity', Icon: Pulse, keys: 'code repositories commits contributions open source' },
  { id: 'contact', label: 'Contact', Icon: Mail, keys: 'hire message reach talk' },
].map((s) => ({ ...s, after: true, run: () => travel(`#${s.id}`) }));

/* glide to a section once the dialog has let go of the page */
function travel(hash) {
  if (scrollToHash(hash)) return;
  document.getElementById(hash.slice(1))?.scrollIntoView();
  revealSection(hash);
}

function download() {
  const a = document.createElement('a');
  a.href = RESUME.resumePath;
  a.download = RESUME.resumeDownloadName;
  a.click();
  trackResumeDownload('command palette');
}

const match = (item, terms) => {
  const hay = `${item.label} ${item.keys ?? ''} ${item.hint ?? ''}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
};

/* The ⌘K palette: type to filter the page's sections and the things a
   visitor most often wants (copy the email, get the résumé, star Vocaly,
   switch theme), then Enter. Arrow keys move, a mouse hovers, the lime
   marker glides to the active row. A combobox over a listbox for screen
   readers; jumps run after the dialog closes so focus and scroll are free. */
export function CommandMenu({ open, onOpenChange }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const list = useRef(null);
  const after = useRef(null);
  const closing = useRef(0);
  const isDark = resolvedTheme === 'dark';

  const actions = useMemo(
    () => [
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: RESUME.email,
        Icon: Copy,
        keys: 'mail contact clipboard',
        stay: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(RESUME.email);
            setCopied(true);
            closing.current = setTimeout(() => onOpenChange(false), 900);
          } catch {
            window.location.href = `mailto:${RESUME.email}`;
          }
        },
      },
      { id: 'resume', label: 'Download résumé', hint: 'PDF', Icon: Download, keys: 'cv resume pdf', run: download },
      {
        id: 'theme',
        label: isDark ? 'Switch to light theme' : 'Switch to dark theme',
        Icon: isDark ? Sun : Moon,
        keys: 'theme dark light mode appearance',
        after: true,
        run: () => switchTheme(isDark ? 'light' : 'dark', setTheme),
      },
      {
        id: 'star',
        label: 'Star Vocaly AI on GitHub',
        Icon: Star,
        keys: 'support open source repo',
        external: true,
        run: () => {
          trackClick('star-palette');
          openTab(REPO_URL);
        },
      },
      DEMO_URL && { id: 'demo', label: 'Try Vocaly AI live', Icon: Play, keys: 'demo pronunciation app', external: true, run: () => openTab(DEMO_URL) },
      { id: 'github', label: 'GitHub profile', Icon: GithubMark, keys: 'code repositories', external: true, run: () => openTab(RESUME.github) },
      { id: 'linkedin', label: 'LinkedIn profile', Icon: LinkedinMark, keys: 'connect network', external: true, run: () => openTab(RESUME.linkedin) },
      { id: 'email', label: 'Write an email', Icon: Send, keys: 'mail message hire', run: () => (window.location.href = `mailto:${RESUME.email}`) },
    ].filter(Boolean),
    [isDark, onOpenChange, setTheme]
  );

  const groups = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return [
      { name: 'Jump to', items: SECTIONS.filter((i) => match(i, terms)) },
      { name: 'Actions', items: actions.filter((i) => match(i, terms)) },
    ].filter((g) => g.items.length);
  }, [query, actions]);
  const flat = groups.flatMap((g) => g.items);
  const current = flat[Math.min(active, flat.length - 1)];

  /* a fresh palette each time it opens */
  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActive(0);
    setCopied(false);
    return () => clearTimeout(closing.current);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  /* keep the keyboard's row in view */
  useEffect(() => {
    if (!current) return;
    list.current?.querySelector(`[data-id="${current.id}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [current]);

  const choose = (item) => {
    if (!item) return;
    if (item.stay) {
      item.run();
      return;
    }
    if (item.after) after.current = item;
    else item.run();
    onOpenChange(false);
  };

  const onKeyDown = (e) => {
    if (!flat.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((a) => (a + step + flat.length) % flat.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(current);
    }
  };

  let row = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby="cmd-hint"
        onCloseAutoFocus={() => {
          const item = after.current;
          after.current = null;
          if (item) requestAnimationFrame(() => item.run());
        }}
        className="top-3 max-h-[calc(100dvh-1.5rem)] translate-y-0 gap-0 overflow-hidden rounded-[1.75rem] bg-popover/95 p-0 backdrop-blur-xl sm:top-[12vh] sm:max-h-[76vh] sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Quick actions</DialogTitle>
        <DialogDescription id="cmd-hint" className="sr-only">
          Type to filter sections and actions, use the arrow keys to choose, and press Enter.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="size-[18px] text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search sections and actions…"
            aria-label="Search sections and actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-autocomplete="list"
            aria-activedescendant={current ? `cmd-${current.id}` : undefined}
            autoComplete="off"
            spellCheck="false"
            className="h-16 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded-md border border-border-strong px-1.5 py-0.5 font-sans text-[11px] text-muted-foreground pointer-fine:inline">esc</kbd>
        </div>

        <motion.div
          ref={list}
          id="cmd-list"
          role="listbox"
          aria-label="Results"
          className="min-h-0 overflow-y-auto overscroll-contain p-2 sm:max-h-[min(26rem,60vh)]"
          initial="hidden"
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: 0.014 } } }}
        >
          {groups.map((group) => (
            <div key={group.name} role="group" aria-labelledby={`cmd-group-${group.name}`}>
              <p id={`cmd-group-${group.name}`} className="px-3 pt-3 pb-1.5 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {group.name}
              </p>
              {group.items.map((item) => {
                row += 1;
                const index = row;
                const on = current?.id === item.id;
                const done = item.id === 'copy-email' && copied;
                const Icon = done ? Check : item.Icon;
                return (
                  <motion.div
                    key={item.id}
                    id={`cmd-${item.id}`}
                    data-id={item.id}
                    role="option"
                    aria-selected={on}
                    onPointerMove={() => active !== index && setActive(index)}
                    onClick={() => choose(item)}
                    variants={{ hidden: { opacity: 0, y: 4 }, shown: { opacity: 1, y: 0 } }}
                    className="relative isolate flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-[15px] select-none"
                  >
                    {on && <motion.span layoutId="cmd-active" transition={activeSpring} className="absolute inset-0 -z-10 rounded-2xl bg-secondary" />}
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-xl transition-colors duration-150',
                        on || done ? 'bg-primary text-primary-foreground [--icon-accent:currentColor] [--icon-accent-opacity:0.25]' : 'bg-secondary text-muted-foreground'
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{done ? 'Copied to clipboard' : item.label}</span>
                    {item.hint && !done && <span className="hidden truncate text-[13px] text-muted-foreground sm:block">{item.hint}</span>}
                    {item.external && <ArrowUpRight className="size-3.5 text-muted-foreground" />}
                    <CornerDownLeft className={cn('size-3.5 text-muted-foreground transition-opacity', on ? 'opacity-100' : 'opacity-0')} />
                  </motion.div>
                );
              })}
            </div>
          ))}
          {!flat.length && (
            <p className="px-3 py-10 text-center text-[15px] text-muted-foreground">
              Nothing matches &ldquo;{query}&rdquo;. Try <span className="text-foreground">projects</span> or <span className="text-foreground">résumé</span>.
            </p>
          )}
        </motion.div>

        <div className="hidden items-center gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground pointer-fine:flex">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-border-strong px-1.5 py-0.5 font-sans">↑</kbd>
            <kbd className="rounded-md border border-border-strong px-1.5 py-0.5 font-sans">↓</kbd>
            to move
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-border-strong px-1.5 py-0.5 font-sans">↵</kbd>
            to open
          </span>
          <span className="ml-auto">
            {RESUME.name.split(' ')[0]}&apos;s portfolio
          </span>
        </div>
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? 'Email address copied to clipboard' : ''}
        </span>
      </DialogContent>
    </Dialog>
  );
}
