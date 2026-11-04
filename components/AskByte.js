'use client';

import { Chat } from '@/components/ui/icons';
import { Button } from './ui/button';

/* opens Byte's chat (ChatWidget listens for byte:open) */
export function AskByte({ label = 'Ask Byte something else', variant = 'outline' }) {
  return (
    <Button variant={variant} onClick={() => window.dispatchEvent(new Event('byte:open'))}>
      <Chat aria-hidden="true" />
      {label}
    </Button>
  );
}
