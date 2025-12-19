// =============================================================================
// PROCESS STEPS - DOTT. BERNARDO GIAMMETTA
// Sezione che spiega come funziona il percorso nutrizionale
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageSquare, FileText, TrendingUp } from 'lucide-react';

// =============================================================================
// DATI STEP
// =============================================================================

const steps = [
  {
    number: '01',
    icon: Calendar,
    title: 'Prenota la Visita',
    description: 'Scegli la data e l\'ora che preferisci attraverso il sistema di prenotazione online. Riceverai una conferma via email.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Prima Consulenza',
    description: 'Durante la prima visita analizzeremo insieme la tua storia, le tue abitudini e definiremo gli obiettivi del percorso.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Piano Personalizzato',
    description: 'Riceverai un piano alimentare costruito su misura per te, con indicazioni pratiche e facili da seguire.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Monitoraggio Continuo',
    description: 'Con le visite di controllo monitoriamo i progressi e adattiamo il piano per ottimizzare i risultati.',
  },
];

// =============================================================================
// COMPONENTE PROCESS STEPS
// =============================================================================

export function ProcessSteps() {
  return (
    <section className="py-20 bg-gradient-to-br from-cream-50 to-sage-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white text-sage-700 rounded-full text-sm font-medium mb-4 shadow-sm">
            Come Funziona
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">
            Il Tuo Percorso in 4 Passi
          </h2>
          <p className="text-sage-600 max-w-2xl mx-auto">
            Un processo semplice e strutturato per guidarti verso i tuoi obiettivi
            di salute e benessere.
          </p>
        </motion.div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Linea connettore */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-sage-200 -z-10" />
              )}
              
              {/* Card */}
              <div className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm hover:shadow-lg transition-shadow h-full">
                {/* Numero */}
                <div className="text-5xl font-display font-bold text-sage-100 mb-4">
                  {step.number}
                </div>
                
                {/* Icona */}
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-sage-600" />
                </div>
                
                {/* Contenuto */}
                <h3 className="text-lg font-semibold text-sage-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-sage-600 text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
