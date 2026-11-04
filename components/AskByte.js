'use client';

import { Chat } from '@/components/ui/icons';
import { Button } from './ui/button';

/* opens Byte's chat (ChatWidget listens for byte:open) */
export function AskByte() {
  return (
    <Button variant="outline" onClick={() => window.dispatchEvent(new Event('byte:open'))}>
      <Chat aria-hidden="true" />
      Ask Byte something else
    </Button>
  );
}
