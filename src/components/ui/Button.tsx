// =============================================================================
// BUTTON COMPONENT - DOTT. BERNARDO GIAMMETTA
// Componente button riutilizzabile con varianti e size
// Usa Class Variance Authority per gestire le varianti
// =============================================================================

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// =============================================================================
// BUTTON VARIANTS
// Definizione delle varianti di stile usando CVA
// =============================================================================

const buttonVariants = cva(
  // Base styles comuni a tutte le varianti
  `inline-flex items-center justify-center gap-2 
   font-medium transition-all duration-300
   focus:outline-none focus:ring-2 focus:ring-offset-2
   disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`,
  {
    variants: {
      // Varianti di colore/stile
      variant: {
        primary: `
          bg-sage-400 text-white
          hover:bg-sage-500 hover:shadow-glow hover:-translate-y-0.5
          focus:ring-sage-400
          active:translate-y-0
        `,
        secondary: `
          bg-white text-sage-700 border-2 border-sage-200
          hover:border-sage-400 hover:bg-sage-50 hover:-translate-y-0.5
          focus:ring-sage-400
        `,
        ghost: `
          text-sage-700
          hover:bg-sage-100
          focus:ring-sage-400
        `,
        outline: `
          border-2 border-sage-400 text-sage-700 bg-transparent
          hover:bg-sage-400 hover:text-white hover:-translate-y-0.5
          focus:ring-sage-400
        `,
        danger: `
          bg-red-500 text-white
          hover:bg-red-600 hover:-translate-y-0.5
          focus:ring-red-500
        `,
        success: `
          bg-green-500 text-white
          hover:bg-green-600 hover:-translate-y-0.5
          focus:ring-green-500
        `,
        link: `
          text-sage-600 underline-offset-4
          hover:underline hover:text-sage-700
          focus:ring-sage-400
          p-0 h-auto
        `,
      },
      // Dimensioni
      size: {
        sm: 'px-4 py-2 text-sm rounded-full',
        md: 'px-6 py-3 text-base rounded-full',
        lg: 'px-8 py-4 text-lg rounded-full',
        xl: 'px-10 py-5 text-xl rounded-full',
        icon: 'p-2 rounded-full',
        'icon-sm': 'p-1.5 rounded-full',
        'icon-lg': 'p-3 rounded-full',
      },
      // Full width
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    // Valori di default
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// =============================================================================
// BUTTON PROPS
// =============================================================================

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Loading state
  isLoading?: boolean;
  // Testo loading (opzionale)
  loadingText?: string;
  // Icona sinistra
  leftIcon?: React.ReactNode;
  // Icona destra
  rightIcon?: React.ReactNode;
}

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {/* Left icon (non mostrata durante loading) */}
        {!isLoading && leftIcon && leftIcon}
        
        {/* Contenuto */}
        {isLoading ? loadingText || children : children}
        
        {/* Right icon (non mostrata durante loading) */}
        {!isLoading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
