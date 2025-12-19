// =============================================================================
// SKELETON COMPONENTS - DOTT. BERNARDO GIAMMETTA
// Componenti di loading skeleton per migliorare UX durante caricamento
// =============================================================================

import { cn } from '@/lib/utils';

// =============================================================================
// SKELETON BASE
// =============================================================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-sage-100',
        className
      )}
    />
  );
}

// =============================================================================
// SKELETON CARD
// =============================================================================

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-sage-100 p-6 space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// =============================================================================
// SKELETON ARTICLE
// =============================================================================

export function SkeletonArticle() {
  return (
    <div className="bg-white rounded-xl border border-sage-100 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// =============================================================================
// SKELETON TABLE ROW
// =============================================================================

export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-sage-50">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  );
}

// =============================================================================
// SKELETON STATS
// =============================================================================

export function SkeletonStats() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-5 border border-sage-100">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// SKELETON CALENDAR
// =============================================================================

export function SkeletonCalendar() {
  return (
    <div className="bg-white rounded-xl border border-sage-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
        {[...Array(35)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SKELETON HERO
// =============================================================================

export function SkeletonHero() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Skeleton className="h-6 w-32 mx-auto rounded-full" />
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
