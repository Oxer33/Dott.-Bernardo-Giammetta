// =============================================================================
// TOOLTIP - DOTT. BERNARDO GIAMMETTA
// Componente tooltip riutilizzabile
// =============================================================================

'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  /** Contenuto del tooltip */
  content: ReactNode;
  /** Elemento trigger */
  children: ReactNode;
  /** Posizione */
  position?: TooltipPosition;
  /** Delay prima di mostrare (ms) */
  delay?: number;
  /** Classe container */
  className?: string;
  /** Classe tooltip */
  tooltipClassName?: string;
  /** Disabilita tooltip */
  disabled?: boolean;
}

// =============================================================================
// POSIZIONI
// =============================================================================

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-sage-800 border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-sage-800 border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-sage-800 border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-sage-800 border-y-transparent border-l-transparent',
};

const motionVariants = {
  top: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
  },
  bottom: {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
  },
  left: {
    initial: { opacity: 0, x: 5 },
    animate: { opacity: 1, x: 0 },
  },
  right: {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0 },
  },
} as const;

// =============================================================================
// COMPONENTE
// =============================================================================

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
  tooltipClassName,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Cleanup al unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const variants = motionVariants[position];

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-1.5 rounded-lg',
              'bg-sage-800 text-white text-sm whitespace-nowrap',
              'shadow-lg pointer-events-none',
              positionClasses[position],
              tooltipClassName
            )}
            role="tooltip"
          >
            {content}
            {/* Arrow */}
            <span
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowClasses[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// INFO TOOLTIP
// Versione con icona info integrata
// =============================================================================

import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  className?: string;
  iconClassName?: string;
}

export function InfoTooltip({
  content,
  position = 'top',
  className,
  iconClassName,
}: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position} className={className}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center',
          'w-4 h-4 rounded-full',
          'text-sage-400 hover:text-sage-600',
          'focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-1',
          iconClassName
        )}
        aria-label="Informazioni"
      >
        <Info className="w-full h-full" />
      </button>
    </Tooltip>
  );
}

// =============================================================================
// BADGE
// =============================================================================

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const badgeVariants = {
  default: 'bg-sage-100 text-sage-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// =============================================================================
// STATUS DOT
// =============================================================================

interface StatusDotProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
};

const dotSizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function StatusDot({
  status,
  size = 'md',
  pulse = false,
  className,
}: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'rounded-full',
          statusColors[status],
          dotSizes[size]
        )}
      />
      {pulse && status === 'online' && (
        <span
          className={cn(
            'absolute inset-0 rounded-full animate-ping',
            statusColors[status],
            'opacity-75'
          )}
        />
      )}
    </span>
  );
}

export default Tooltip;
