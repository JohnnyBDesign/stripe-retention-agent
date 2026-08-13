import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-nav text-[11px] uppercase tracking-[0.1em] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-sm',
  {
    variants: {
      variant: {
        default: 'bg-white text-canvas hover:bg-white/90',
        secondary: 'bg-transparent text-white hover:bg-white/10 border border-white/20',
        ghost: 'hover:bg-white/10 text-white',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-white/20 bg-transparent hover:bg-white/10 text-white hover:border-white/40',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-9 px-4 text-[10px]',
        lg: 'h-12 px-8 text-[12px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
