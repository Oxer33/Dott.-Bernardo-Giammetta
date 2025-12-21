// =============================================================================
// SPLASHSCREEN - DOTT. BERNARDO GIAMMETTA
// Splash screen d'impatto con animazione e messaggio di benvenuto
// Durata: 3.5 secondi
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Leaf, Heart, Sparkles } from 'lucide-react';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  // Rispetta preferenze utente per riduzione movimento (accessibilità)
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Controlla se l'utente ha già visto lo splash in questa sessione
    const seen = sessionStorage.getItem('splashSeen');
    if (seen) {
      setIsVisible(false);
      setHasSeenSplash(true);
      return;
    }

    // Precarica risorse durante lo splash per migliorare fluidità
    const preloadResources = async () => {
      try {
        // Precarica sessione utente
        fetch('/api/auth/session');
        // Precarica dati comuni
        fetch('/api/comuni?q=roma&limit=1');
        // Precarica immagini critiche con link preload
        const preloadImages = ['/images/hero-bg.jpg', '/images/dott-giammetta.jpg'];
        preloadImages.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          document.head.appendChild(link);
        });
      } catch (e) {
        // Ignora errori di precaricamento
      }
    };
    preloadResources();

    // Nascondi dopo 2.5 secondi (ridotto per migliore UX) o 1s se reduce motion
    const duration = shouldReduceMotion ? 1000 : 2500;
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('splashSeen', 'true');
    }, duration);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Se ha già visto lo splash, non renderizzare nulla
  if (hasSeenSplash) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        >
          {/* Background con gradiente - semplificato per performance */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-sage-600 via-sage-500 to-lavender-500"
            style={{ willChange: 'opacity' }}
          />

          {/* Pattern decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full" />
            <div className="absolute bottom-32 right-20 w-48 h-48 border-2 border-white rounded-full" />
            <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-white rounded-full" />
          </div>

          {/* Contenuto centrale */}
          <div className="relative z-10 text-center px-6">
            {/* Logo animato */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30">
                <Leaf className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Titolo */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
            >
              Dott. Bernardo Giammetta
            </motion.h1>

            {/* Sottotitolo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg text-white/90 mb-8"
            >
              Biologo Nutrizionista
            </motion.p>

            {/* Frase d'impatto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-orange-300" />
                  <Heart className="w-5 h-5 text-pink-300" />
                  <Sparkles className="w-5 h-5 text-orange-300" />
                </div>
                <p className="text-xl md:text-2xl font-display text-white italic leading-relaxed">
                  "I primi passi verso una vita più sana iniziano oggi"
                </p>
              </div>
            </motion.div>

            {/* Firma con font Jane Austen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="mt-8"
            >
              <p 
                className="text-4xl md:text-5xl lg:text-6xl text-white/90"
                style={{ fontFamily: "'Jane Austen', cursive" }}
              >
                Bernardo Giammetta
              </p>
            </motion.div>

            {/* Indicatore di caricamento */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-8"
            >
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white/60 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
