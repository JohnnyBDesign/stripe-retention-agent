import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center font-mono text-caption uppercase tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-border-visible text-text-secondary bg-transparent',
        active: 'border border-text-display text-text-display bg-transparent',
        success: 'border border-success text-success bg-transparent',
        warning: 'border border-warning text-warning bg-transparent',
        error: 'border border-accent text-accent bg-transparent',
      },
      shape: {
        pill: 'rounded-pill',
        technical: 'rounded-technical',
      },
      size: {
        default: 'px-3 py-1',
        sm: 'px-2 py-0.5 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      shape: 'pill',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, shape, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
