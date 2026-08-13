import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full border-b border-border-visible bg-transparent px-3 py-2 font-mono text-body text-text-primary transition-colors file:border-0 file:bg-transparent file:text-body-sm file:font-medium placeholder:text-text-disabled focus-visible:outline-none focus-visible:border-text-primary disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
