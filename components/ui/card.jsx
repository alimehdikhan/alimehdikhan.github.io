import * as React from 'react';
import { cn } from '@/lib/utils';

/* shadcn/ui Card: a white rounded surface with a hairline border and a soft
   shadow. `interactive` adds the small hover lift. */
const Card = React.forwardRef(function Card({ className, interactive = false, as: Tag = 'div', ...props }, ref) {
  return (
    <Tag
      ref={ref}
      data-slot="card"
      className={cn(
        'rounded-3xl border border-border bg-card text-card-foreground shadow-soft',
        interactive && 'hover-lift',
        className
      )}
      {...props}
    />
  );
});

function CardHeader({ className, ...props }) {
  return <div data-slot="card-header" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function CardTitle({ className, as: Tag = 'h3', ...props }) {
  return (
    <Tag data-slot="card-title" className={cn('text-xl leading-tight font-semibold tracking-[-0.02em]', className)} {...props} />
  );
}

function CardDescription({ className, ...props }) {
  return <p data-slot="card-description" className={cn('text-muted-foreground', className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
