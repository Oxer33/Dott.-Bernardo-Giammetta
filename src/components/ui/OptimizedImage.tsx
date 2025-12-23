// =============================================================================
// OPTIMIZED IMAGE - DOTT. BERNARDO GIAMMETTA
// Componente immagine ottimizzato con blur placeholder e lazy loading
// =============================================================================

'use client';

import { useState, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** Mostra skeleton durante caricamento */
  showSkeleton?: boolean;
  /** Colore placeholder blur (base64 o colore) */
  blurColor?: string;
  /** Aspect ratio per container (es: "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Classe per il container */
  containerClassName?: string;
  /** Animazione fade-in al caricamento */
  fadeIn?: boolean;
  /** Callback quando immagine caricata */
  onLoadComplete?: () => void;
  /** Callback su errore */
  onError?: () => void;
  /** Fallback image URL */
  fallbackSrc?: string;
}

// =============================================================================
// BLUR PLACEHOLDER BASE64
// Placeholder generico grigio sfumato
// =============================================================================

const DEFAULT_BLUR_PLACEHOLDER = 
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+';

// Placeholder con colore sage del brand
const SAGE_BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDRlMmQ3Ii8+PC9zdmc+';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  containerClassName,
  showSkeleton = true,
  blurColor,
  aspectRatio,
  fadeIn = true,
  onLoadComplete,
  onError,
  fallbackSrc = '/images/placeholder.jpg',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    // Usa fallback se disponibile
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
    
    onError?.();
  }, [fallbackSrc, currentSrc, onError]);

  // Determina placeholder
  const placeholder = blurColor === 'sage' ? SAGE_BLUR_PLACEHOLDER : DEFAULT_BLUR_PLACEHOLDER;

  // Stile container con aspect ratio
  const containerStyle = aspectRatio
    ? { aspectRatio, position: 'relative' as const }
    : undefined;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fill && 'w-full h-full',
        containerClassName
      )}
      style={containerStyle}
    >
      {/* Skeleton durante caricamento */}
      <AnimatePresence>
        {isLoading && showSkeleton && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-sage-100 animate-pulse"
          />
        )}
      </AnimatePresence>

      {/* Immagine */}
      <motion.div
        initial={fadeIn ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={cn('w-full h-full', fill && 'absolute inset-0')}
      >
        <Image
          src={currentSrc}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            'object-cover',
            hasError && 'opacity-50',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          placeholder="blur"
          blurDataURL={placeholder}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      </motion.div>

      {/* Overlay errore */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-sage-100/80">
          <span className="text-sage-500 text-sm">Immagine non disponibile</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// AVATAR IMAGE
// Variante circolare per avatar
// =============================================================================

interface AvatarImageProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallbackInitials?: string;
  className?: string;
}

const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const avatarPixelSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function AvatarImage({
  src,
  alt,
  size = 'md',
  fallbackInitials,
  className,
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  // Genera iniziali da alt se non fornite
  const initials = fallbackInitials || alt
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Mostra fallback se no src o errore
  if (!src || hasError) {
    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-sage-400 to-sage-600',
          'flex items-center justify-center text-white font-medium',
          avatarSizes[size],
          className
        )}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-full overflow-hidden', avatarSizes[size], className)}>
      <Image
        src={src}
        alt={alt}
        width={avatarPixelSizes[size]}
        height={avatarPixelSizes[size]}
        className="object-cover w-full h-full"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// =============================================================================
// BACKGROUND IMAGE
// Per sfondi con overlay
// =============================================================================

interface BackgroundImageProps {
  src: string;
  alt: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function BackgroundImage({
  src,
  alt,
  overlay = true,
  overlayOpacity = 0.5,
  overlayColor = 'black',
  children,
  className,
}: BackgroundImageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Immagine di sfondo */}
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
        fadeIn={false}
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Contenuto */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

// =============================================================================
// GALLERY IMAGE
// Per gallerie con lightbox
// =============================================================================

interface GalleryImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}

export function GalleryImage({ src, alt, onClick, className }: GalleryImageProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2',
        className
      )}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="transition-transform duration-300 hover:scale-105"
        blurColor="sage"
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
    </motion.button>
  );
}

export default OptimizedImage;
