// =============================================================================
// VALORI E FILOSOFIA - DOTT. BERNARDO GIAMMETTA
// Sezione che descrive i valori e l'approccio professionale
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Heart, Target, Sparkles, Users, Brain, Leaf } from 'lucide-react';

// =============================================================================
// DATI VALORI
// =============================================================================

const values = [
  {
    icon: Heart,
    title: 'Ascolto Attivo',
    description: 'Ogni paziente è unico. Dedico tempo ad ascoltare la tua storia, le tue esigenze e i tuoi obiettivi per creare un percorso su misura.',
    color: 'rose',
  },
  {
    icon: Target,
    title: 'Approccio Scientifico',
    description: 'Le mie raccomandazioni sono sempre basate sulle più recenti evidenze scientifiche e sulla medicina basata sull\'evidenza.',
    color: 'sage',
  },
  {
    icon: Sparkles,
    title: 'Nutrizione Funzionale',
    description: 'Guardo oltre i sintomi per identificare le cause profonde, utilizzando l\'alimentazione come strumento di prevenzione e cura.',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Collaborazione',
    description: 'Lavoro in sinergia con altri professionisti della salute per offrirti un approccio multidisciplinare completo.',
    color: 'blue',
  },
  {
    icon: Brain,
    title: 'Educazione Alimentare',
    description: 'Ti insegno a comprendere il cibo e le sue proprietà, così da renderti autonomo nelle tue scelte alimentari.',
    color: 'purple',
  },
  {
    icon: Leaf,
    title: 'Sostenibilità',
    description: 'Propongo piani alimentari sostenibili nel tempo, che si integrino naturalmente nel tuo stile di vita quotidiano.',
    color: 'green',
  },
];

// =============================================================================
// COMPONENTE VALORI
// =============================================================================

export function Values() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contenuto testuale */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
              La Mia Filosofia
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-6">
              Valori che Guidano il Mio Lavoro
            </h2>
            <p className="text-sage-600 mb-6 leading-relaxed">
              Credo fermamente che la nutrizione sia uno strumento potente per 
              migliorare la qualità della vita. Il mio approccio va oltre la 
              semplice prescrizione di una dieta: è un percorso condiviso verso 
              il benessere.
            </p>
            <p className="text-sage-600 mb-8 leading-relaxed">
              Ogni persona che si rivolge a me porta con sé una storia unica, 
              fatta di abitudini, preferenze, obiettivi e sfide. Il mio compito 
              è ascoltare attentamente e costruire insieme un piano che sia 
              non solo efficace, ma anche sostenibile e piacevole da seguire.
            </p>
            
            {/* Quote */}
            <blockquote className="relative pl-6 border-l-4 border-sage-400 italic text-sage-700">
              <p className="text-lg">
                &quot;La vera nutrizione non è privazione, ma scoperta di un nuovo 
                equilibrio che ti fa stare bene ogni giorno.&quot;
              </p>
              <footer className="mt-2 text-sage-500 not-italic">
                — Dott. Bernardo Giammetta
              </footer>
            </blockquote>
          </motion.div>
          
          {/* Griglia valori */}
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-5 bg-cream-50 rounded-xl border border-sage-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center mb-3">
                  <value.icon className="w-5 h-5 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-sage-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
