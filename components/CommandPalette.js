'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Search } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

/* the palette's code arrives on first use; for a keyboard and mouse it is
   fetched ahead, once the page is idle, so ⌘K opens at once */
const load = () => import('./CommandMenu');
const CommandMenu = dynamic(() => load().then((m) => m.CommandMenu), { ssr: false });

/* ⌘K (Ctrl+K elsewhere) anywhere on the page, or this button in the bar */
export function CommandPalette({ className }) {
  const [open, setOpen] = useState(false);
  /* mounted from the first open on, so later opens animate in and out */
  const [used, setUsed] = useState(false);
  const [mod, setMod] = useState('⌘');

  useEffect(() => {
    const platform = navigator.userAgentData?.platform || navigator.platform || '';
    if (!/mac|iphone|ipad/i.test(platform)) setMod('Ctrl');

    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setUsed(true);
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);

    let task = 0;
    const idle = 'requestIdleCallback' in window;
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      task = idle ? window.requestIdleCallback(() => load(), { timeout: 4000 }) : setTimeout(load, 2500);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      if (idle) window.cancelIdleCallback(task);
      else clearTimeout(task);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setUsed(true);
          setOpen(true);
        }}
        onPointerEnter={load}
        aria-label="Search sections and actions"
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          'h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/60 pr-1.5 pl-3 text-[13px] text-muted-foreground transition-[color,border-color,transform] duration-200 outline-none select-none hover:border-border-strong hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.97] motion-reduce:active:scale-100',
          className
        )}
      >
        <Search className="size-4" />
        <span className="hidden xl:inline">Search</span>
        <kbd className="rounded-full bg-background px-2 py-0.5 font-sans text-[11px] font-medium text-foreground/80">
          {mod} K
        </kbd>
      </button>
      {used && <CommandMenu open={open} onOpenChange={setOpen} />}
    </>
  );
}
