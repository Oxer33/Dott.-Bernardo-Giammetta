// =============================================================================
// SCROLL TO TOP BUTTON - DOTT. BERNARDO GIAMMETTA
// Pulsante per tornare in cima alla pagina
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

// =============================================================================
// COMPONENTE SCROLL TO TOP
// =============================================================================

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostra/nascondi in base allo scroll
  useEffect(() => {
    const toggleVisibility = () => {
      // Mostra dopo 300px di scroll
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Funzione scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-sage-500 text-white rounded-full shadow-lg hover:bg-sage-600 transition-colors flex items-center justify-center group"
          aria-label="Torna in cima"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
