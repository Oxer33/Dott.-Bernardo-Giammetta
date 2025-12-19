// =============================================================================
// SERVICES HERO - DOTT. BERNARDO GIAMMETTA
// Hero section per la pagina Servizi
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// =============================================================================
// COMPONENTE HERO
// =============================================================================

export function ServicesHero() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-sage-50 via-cream-50 to-blush-50 overflow-hidden">
      {/* Decorazioni di sfondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-sage-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-blush-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-sage-700 rounded-full text-sm font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Percorsi Personalizzati</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-sage-900 mb-6">
            I Miei{' '}
            <span className="text-sage-600">Servizi</span>
          </h1>
          
          <p className="text-lg text-sage-600 leading-relaxed">
            Offro un approccio completo alla nutrizione, dalla prima visita 
            fino al raggiungimento dei tuoi obiettivi. Ogni percorso è 
            costruito su misura per le tue esigenze specifiche.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
