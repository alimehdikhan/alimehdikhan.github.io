import { cn } from '@/lib/utils';

const SIZES = {
  sm: { box: 'size-9 rounded-xl', icon: '[&>svg]:size-[18px]' },
  md: { box: 'size-11 rounded-2xl', icon: '[&>svg]:size-[22px]' },
  lg: { box: 'size-14 rounded-[1.15rem]', icon: '[&>svg]:size-7' },
};

/* Glass tile behind an icon, logo or monogram: gradient face, hairline ring,
   bright top edge and a lime bloom that wakes on hover (all in globals.css).
   Icons inside are drawn entirely in the accent (lime on dark, olive on
   light, ink on the lime panel), with the soft duotone layer as a lighter
   wash of the same colour. Pass an icon component, or children for a logo. */
export function IconTile({ icon: Icon, size = 'md', className, children, ...props }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <span className={cn('icon-tile text-link', s.box, s.icon, className)} {...props}>
      {Icon ? <Icon /> : children}
    </span>
  );
}
