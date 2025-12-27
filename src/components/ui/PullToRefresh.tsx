// =============================================================================
// PULL TO REFRESH - DOTT. BERNARDO GIAMMETTA
// Componente per refresh pagina con gesto swipe down su mobile (punto 8)
// =============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// =============================================================================
// COSTANTI
// =============================================================================

const PULL_THRESHOLD = 80; // Pixel da trascinare prima del refresh
const MAX_PULL = 120; // Massimo pull visuale

// =============================================================================
// COMPONENTE
// =============================================================================

export function PullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  // Verifica se siamo in cima alla pagina
  const isAtTop = useCallback(() => {
    return window.scrollY <= 0;
  }, []);

  // Verifica se è mobile
  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  }, []);

  // Handler touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile() || !isAtTop()) return;
    setStartY(e.touches[0].clientY);
    setIsPulling(true);
  }, [isMobile, isAtTop]);

  // Handler touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !isAtTop() || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0) {
      // Effetto di resistenza (rallenta il pull)
      const resistance = Math.min(diff * 0.5, MAX_PULL);
      setPullDistance(resistance);
      
      // Previeni scroll normale solo quando si sta facendo pull
      if (diff > 10) {
        e.preventDefault();
      }
    }
  }, [isPulling, startY, isAtTop, isRefreshing]);

  // Handler touch end
  const handleTouchEnd = useCallback(() => {
    if (!isPulling) return;
    
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      // Trigger refresh
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD / 2);
      
      // Refresh della pagina
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setPullDistance(0);
    }
    
    setIsPulling(false);
  }, [pullDistance, isPulling, isRefreshing]);

  // Setup event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Aggiungi listeners con passive: false per poter prevenire scroll
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Non renderizzare su desktop
  if (typeof window !== 'undefined' && !isMobile()) {
    return null;
  }

  return (
    <AnimatePresence>
      {pullDistance > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: pullDistance / PULL_THRESHOLD,
            y: Math.min(pullDistance - 40, MAX_PULL - 40)
          }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
        >
          <motion.div
            animate={{ 
              rotate: isRefreshing ? 360 : (pullDistance / PULL_THRESHOLD) * 180,
              scale: pullDistance >= PULL_THRESHOLD ? 1.2 : 1
            }}
            transition={{ 
              rotate: isRefreshing ? { repeat: Infinity, duration: 1, ease: 'linear' } : { duration: 0.1 }
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
              pullDistance >= PULL_THRESHOLD ? 'bg-sage-500' : 'bg-white'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${
              pullDistance >= PULL_THRESHOLD ? 'text-white' : 'text-sage-600'
            }`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PullToRefresh;
