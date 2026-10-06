import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* shadcn/ui Button, as simple pills: a lime primary with a soft glow, a
   quiet outlined secondary, and a ghost for icon buttons. */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-medium tracking-[-0.01em] outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out select-none touch-manipulation active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'glow-lime bg-primary text-primary-foreground hover:bg-primary-hover',
        outline: 'border border-border-strong bg-transparent text-foreground hover:border-foreground/30 hover:bg-foreground/[0.04]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
        ghost: 'text-foreground hover:bg-foreground/[0.06]',
        link: 'text-link underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-8 px-4 text-[13px]',
        lg: 'h-12 px-7 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(function Button({ className, variant, size, asChild = false, ...props }, ref) {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref} data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
});

export { Button, buttonVariants };
