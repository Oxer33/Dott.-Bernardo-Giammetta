// =============================================================================
// ABOUT HERO - DOTT. BERNARDO GIAMMETTA
// Hero section per la pagina Chi Sono con foto e introduzione
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Award, BookOpen, Heart, Users } from 'lucide-react';

// =============================================================================
// STATISTICHE RAPIDE
// =============================================================================

const stats = [
  { icon: Users, value: '1000+', label: 'Pazienti seguiti' },
  { icon: Award, value: '15+', label: 'Anni di esperienza' },
  { icon: BookOpen, value: '50+', label: 'Corsi e certificazioni' },
  { icon: Heart, value: '98%', label: 'Pazienti soddisfatti' },
];

// =============================================================================
// COMPONENTE HERO
// =============================================================================

export function AboutHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-cream-50 via-white to-sage-50">
      {/* Decorazioni di sfondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blush-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Contenuto testuale */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6">
              Biologo Nutrizionista
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-sage-900 mb-6">
              Dott. Bernardo{' '}
              <span className="text-sage-600">Giammetta</span>
            </h1>
            
            <p className="text-lg text-sage-700 mb-6 leading-relaxed">
              Da oltre 15 anni accompagno i miei pazienti in un percorso di 
              <strong className="text-sage-800"> benessere completo</strong>, 
              combinando scienza della nutrizione, approccio funzionale e 
              attenzione alla persona nella sua totalità.
            </p>
            
            <p className="text-sage-600 mb-8">
              La mia missione è aiutarti a raggiungere i tuoi obiettivi di salute 
              attraverso un&apos;alimentazione personalizzata, sostenibile e 
              che si integri perfettamente nel tuo stile di vita.
            </p>
            
            {/* Statistiche */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-sage-100"
                >
                  <stat.icon className="w-6 h-6 text-sage-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-sage-800">{stat.value}</div>
                  <div className="text-xs text-sage-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Immagine */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder per foto dottore */}
              <div className="absolute inset-0 bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16" />
                  </div>
                  <p className="text-sm opacity-80">Foto Dott. Giammetta</p>
                </div>
              </div>
            </div>
            
            {/* Card decorativa */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-sage-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <div className="font-semibold text-sage-800">Iscritto ONB</div>
                  <div className="text-sm text-sage-600">Ordine Nazionale Biologi</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
