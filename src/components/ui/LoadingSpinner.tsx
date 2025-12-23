// =============================================================================
// LOADING SPINNER - DOTT. BERNARDO GIAMMETTA
// Componente loading riutilizzabile con varianti
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Loader2, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

interface LoadingSpinnerProps {
  /** Dimensione: sm, md, lg, xl */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Variante: default (cerchio), leaf (foglia brand), dots (puntini) */
  variant?: 'default' | 'leaf' | 'dots' | 'pulse';
  /** Testo opzionale da mostrare */
  text?: string;
  /** Classe CSS aggiuntiva */
  className?: string;
  /** Colore (default: sage) */
  color?: 'sage' | 'white' | 'gray';
  /** Centrare nel container */
  center?: boolean;
  /** Overlay fullscreen */
  fullscreen?: boolean;
}

// =============================================================================
// DIMENSIONI
// =============================================================================

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

const colors = {
  sage: 'text-sage-600',
  white: 'text-white',
  gray: 'text-gray-400',
};

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  className,
  color = 'sage',
  center = false,
  fullscreen = false,
}: LoadingSpinnerProps) {
  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-2',
    center && 'absolute inset-0',
    fullscreen && 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50',
    className
  );

  const iconClasses = cn(sizes[size], colors[color]);

  return (
    <div className={containerClasses}>
      {variant === 'default' && (
        <Loader2 className={cn(iconClasses, 'animate-spin')} />
      )}

      {variant === 'leaf' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Leaf className={iconClasses} />
        </motion.div>
      )}

      {variant === 'dots' && <DotsLoader size={size} color={color} />}

      {variant === 'pulse' && <PulseLoader size={size} color={color} />}

      {text && (
        <p className={cn(textSizes[size], colors[color], 'animate-pulse')}>
          {text}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// VARIANTE DOTS
// =============================================================================

function DotsLoader({ size, color }: { size: string; color: string }) {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 
                  size === 'md' ? 'w-2 h-2' : 
                  size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  const bgColor = color === 'sage' ? 'bg-sage-600' :
                  color === 'white' ? 'bg-white' : 'bg-gray-400';

  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(dotSize, bgColor, 'rounded-full')}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// VARIANTE PULSE
// =============================================================================

function PulseLoader({ size, color }: { size: string; color: string }) {
  const circleSize = sizes[size as keyof typeof sizes];
  const bgColor = color === 'sage' ? 'bg-sage-500' :
                  color === 'white' ? 'bg-white' : 'bg-gray-400';

  return (
    <div className="relative">
      <motion.div
        className={cn(circleSize, bgColor, 'rounded-full opacity-75')}
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.3, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className={cn(
          circleSize,
          bgColor,
          'rounded-full absolute inset-0'
        )}
      />
    </div>
  );
}

// =============================================================================
// SKELETON LOADER
// =============================================================================

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-sage-200/50 rounded';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses[variant], className)}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : style.width, // Ultima riga più corta
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
}

// =============================================================================
// CARD SKELETON
// =============================================================================

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 bg-white rounded-2xl shadow-sm', className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="60%" height={20} className="mb-2" />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <Skeleton lines={3} className="mb-4" />
      <div className="flex gap-2">
        <Skeleton width={80} height={32} variant="rectangular" />
        <Skeleton width={80} height={32} variant="rectangular" />
      </div>
    </div>
  );
}

// =============================================================================
// TABLE SKELETON
// =============================================================================

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-sage-50 rounded-lg">
        <Skeleton width="20%" height={20} />
        <Skeleton width="25%" height={20} />
        <Skeleton width="20%" height={20} />
        <Skeleton width="15%" height={20} />
        <Skeleton width="20%" height={20} />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white rounded-lg border border-sage-100">
          <Skeleton width="20%" height={18} />
          <Skeleton width="25%" height={18} />
          <Skeleton width="20%" height={18} />
          <Skeleton width="15%" height={18} />
          <Skeleton width="20%" height={18} />
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// PAGE LOADER
// =============================================================================

export function PageLoader({ text = 'Caricamento...' }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="lg" variant="leaf" text={text} />
    </div>
  );
}

export default LoadingSpinner;
