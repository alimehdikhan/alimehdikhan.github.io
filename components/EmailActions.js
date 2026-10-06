'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';

/* The contact section's primary actions: write an email, or copy the
   address. Copying confirms on the button and to screen readers; if the
   clipboard is unavailable it falls back to opening the mail app. */
export function EmailActions({ email }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <Magnetic>
        <Button asChild size="lg">
          <a href={`mailto:${email}`}>
            <Mail aria-hidden="true" />
            {email}
          </a>
        </Button>
      </Magnetic>
      <Button type="button" variant="outline" size="lg" onClick={copy} aria-label="Copy email address">
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span className="min-w-[3.25rem] text-left">{copied ? 'Copied' : 'Copy'}</span>
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </div>
  );
}
