// =============================================================================
// BLOG HERO - DOTT. BERNARDO GIAMMETTA
// Hero section per la pagina Blog
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
import { useState } from 'react';

// =============================================================================
// COMPONENTE HERO
// =============================================================================

export function BlogHero() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <section className="relative py-20 bg-gradient-to-br from-cream-50 via-white to-sage-50 overflow-hidden">
      {/* Decorazioni di sfondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-sage-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blush-100/30 rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6"
          >
            <BookOpen className="w-4 h-4" />
            <span>Articoli e Approfondimenti</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-sage-900 mb-6">
            Il Mio{' '}
            <span className="text-sage-600">Blog</span>
          </h1>
          
          <p className="text-lg text-sage-600 mb-8 leading-relaxed">
            Consigli pratici, ricette salutari e approfondimenti scientifici
            per aiutarti a vivere meglio attraverso l&apos;alimentazione.
          </p>
          
          {/* Barra di ricerca */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Cerca articoli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 bg-white border border-sage-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
