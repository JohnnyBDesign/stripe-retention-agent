import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-text-display text-black hover:bg-text-primary border-none',
        secondary: 'bg-transparent border border-border-visible text-text-primary hover:border-text-primary',
        ghost: 'bg-transparent border-none text-text-secondary hover:text-text-primary',
        destructive: 'bg-transparent border border-accent text-accent hover:border-text-display hover:text-text-display',
      },
      size: {
        default: 'h-[44px] px-6 py-3',
        sm: 'h-9 px-4',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
      shape: {
        pill: 'rounded-pill',
        technical: 'rounded-technical',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      shape: 'pill',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
