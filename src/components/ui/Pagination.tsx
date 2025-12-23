// =============================================================================
// PAGINATION - DOTT. BERNARDO GIAMMETTA
// Componente paginazione riutilizzabile
// =============================================================================

'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TIPI
// =============================================================================

interface PaginationProps {
  /** Pagina corrente (1-indexed) */
  currentPage: number;
  /** Totale pagine */
  totalPages: number;
  /** Callback cambio pagina */
  onPageChange: (page: number) => void;
  /** Numero pagine da mostrare ai lati della corrente */
  siblingCount?: number;
  /** Mostra pulsanti prima/ultima pagina */
  showFirstLast?: boolean;
  /** Variante */
  variant?: 'default' | 'simple' | 'minimal';
  /** Dimensione */
  size?: 'sm' | 'md' | 'lg';
  /** Classe container */
  className?: string;
  /** Disabilita */
  disabled?: boolean;
}

// =============================================================================
// DIMENSIONI
// =============================================================================

const sizes = {
  sm: 'h-8 min-w-8 text-sm',
  md: 'h-10 min-w-10 text-base',
  lg: 'h-12 min-w-12 text-lg',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

// =============================================================================
// HELPER: Genera range di pagine
// =============================================================================

function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'dots')[] {
  const totalNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 dots

  // Se il numero totale di pagine è inferiore a totalNumbers, mostra tutte
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, 'dots', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, 'dots', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );

  return [1, 'dots', ...middleRange, 'dots', totalPages];
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
}: PaginationProps) {
  const paginationRange = useMemo(
    () => generatePaginationRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  // Non mostrare se solo una pagina
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const buttonClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-medium',
    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400',
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const activeClasses = 'bg-sage-600 text-white';
  const inactiveClasses = 'bg-white text-sage-700 hover:bg-sage-100 border border-sage-200';
  const disabledNavClasses = 'opacity-50 cursor-not-allowed hover:bg-white';

  // Variante minimal
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center gap-2', className)}>
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={disabled || !canGoPrevious}
          className={cn(buttonClasses, inactiveClasses, !canGoPrevious && disabledNavClasses)}
          aria-label="Pagina precedente"
        >
          <ChevronLeft className={iconSizes[size]} />
        </button>
        <span className="text-sage-600 px-2">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={disabled || !canGoNext}
          className={cn(buttonClasses, inactiveClasses, !canGoNext && disabledNavClasses)}
          aria-label="Pagina successiva"
        >
          <ChevronRight className={iconSizes[size]} />
        </button>
      </div>
    );
  }

  // Variante simple
  if (variant === 'simple') {
    return (
      <div className={cn('flex items-center justify-between', className)}>
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={disabled || !canGoPrevious}
          className={cn(
            'flex items-center gap-1 px-4 py-2 rounded-lg',
            'text-sage-700 hover:bg-sage-100 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <ChevronLeft className={iconSizes[size]} />
          Precedente
        </button>
        <span className="text-sage-600">
          Pagina {currentPage} di {totalPages}
        </span>
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={disabled || !canGoNext}
          className={cn(
            'flex items-center gap-1 px-4 py-2 rounded-lg',
            'text-sage-700 hover:bg-sage-100 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Successiva
          <ChevronRight className={iconSizes[size]} />
        </button>
      </div>
    );
  }

  // Variante default (con numeri)
  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Paginazione"
    >
      {/* Prima pagina */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={disabled || !canGoPrevious}
          className={cn(buttonClasses, inactiveClasses, !canGoPrevious && disabledNavClasses)}
          aria-label="Prima pagina"
        >
          <ChevronsLeft className={iconSizes[size]} />
        </button>
      )}

      {/* Precedente */}
      <button
        onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
        disabled={disabled || !canGoPrevious}
        className={cn(buttonClasses, inactiveClasses, !canGoPrevious && disabledNavClasses)}
        aria-label="Pagina precedente"
      >
        <ChevronLeft className={iconSizes[size]} />
      </button>

      {/* Numeri pagina */}
      {paginationRange.map((page, index) => {
        if (page === 'dots') {
          return (
            <span
              key={`dots-${index}`}
              className={cn('px-2 text-sage-400', sizes[size])}
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => !isActive && onPageChange(page)}
            disabled={disabled}
            className={cn(
              buttonClasses,
              'px-3',
              isActive ? activeClasses : inactiveClasses
            )}
            aria-label={`Pagina ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Successiva */}
      <button
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={disabled || !canGoNext}
        className={cn(buttonClasses, inactiveClasses, !canGoNext && disabledNavClasses)}
        aria-label="Pagina successiva"
      >
        <ChevronRight className={iconSizes[size]} />
      </button>

      {/* Ultima pagina */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || !canGoNext}
          className={cn(buttonClasses, inactiveClasses, !canGoNext && disabledNavClasses)}
          aria-label="Ultima pagina"
        >
          <ChevronsRight className={iconSizes[size]} />
        </button>
      )}
    </nav>
  );
}

// =============================================================================
// HOOK: usePagination
// =============================================================================

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

import { useState, useCallback } from 'react';

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const setPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const prevPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    nextPage,
    prevPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
  };
}

export default Pagination;
