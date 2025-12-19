// =============================================================================
// SERVICES LIST - DOTT. BERNARDO GIAMMETTA
// Lista completa dei servizi con cards glassmorphism
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  ClipboardCheck, 
  Dumbbell, 
  Baby, 
  Heart, 
  Apple,
  Timer,
  ArrowRight,
  Check
} from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// DATI SERVIZI
// =============================================================================

const services = [
  {
    id: 'prima-visita',
    icon: Stethoscope,
    title: 'Prima Visita Nutrizionale',
    duration: '90 minuti',
    description: 'Un incontro approfondito per conoscere la tua storia, analizzare le tue abitudini e definire insieme gli obiettivi del percorso.',
    includes: [
      'Anamnesi completa',
      'Analisi composizione corporea',
      'Valutazione abitudini alimentari',
      'Definizione obiettivi',
      'Piano alimentare personalizzato',
    ],
    featured: true,
  },
  {
    id: 'visita-controllo',
    icon: ClipboardCheck,
    title: 'Visita di Controllo',
    duration: '60 minuti',
    description: 'Monitoraggio del percorso, valutazione dei progressi e aggiustamenti al piano alimentare in base ai risultati ottenuti.',
    includes: [
      'Valutazione progressi',
      'Analisi composizione corporea',
      'Revisione piano alimentare',
      'Supporto motivazionale',
    ],
    featured: false,
  },
  {
    id: 'nutrizione-sportiva',
    icon: Dumbbell,
    title: 'Nutrizione Sportiva',
    duration: '90 minuti',
    description: 'Piani alimentari specifici per atleti e sportivi, ottimizzati per performance, recupero e composizione corporea.',
    includes: [
      'Valutazione fabbisogno energetico',
      'Piano pre e post allenamento',
      'Integrazione mirata',
      'Periodizzazione nutrizionale',
      'Strategie gara/competizione',
    ],
    featured: false,
  },
  {
    id: 'nutrizione-pediatrica',
    icon: Baby,
    title: 'Nutrizione Pediatrica',
    duration: '75 minuti',
    description: 'Consulenze dedicate a bambini e adolescenti, con focus su crescita, sviluppo e educazione alimentare familiare.',
    includes: [
      'Valutazione crescita',
      'Analisi abitudini familiari',
      'Piano alimentare età-specifico',
      'Educazione alimentare',
      'Coinvolgimento genitori',
    ],
    featured: false,
  },
  {
    id: 'nutrizione-clinica',
    icon: Heart,
    title: 'Nutrizione Clinica',
    duration: '90 minuti',
    description: 'Gestione nutrizionale di patologie specifiche: diabete, ipertensione, dislipidemie, patologie gastrointestinali e molto altro.',
    includes: [
      'Valutazione clinica approfondita',
      'Collaborazione con medico curante',
      'Piano terapeutico nutrizionale',
      'Monitoraggio parametri',
      'Educazione terapeutica',
    ],
    featured: false,
  },
  {
    id: 'educazione-alimentare',
    icon: Apple,
    title: 'Educazione Alimentare',
    duration: '60 minuti',
    description: 'Percorsi di consapevolezza alimentare per imparare a fare scelte sane e costruire un rapporto equilibrato con il cibo.',
    includes: [
      'Lettura etichette',
      'Organizzazione dispensa',
      'Meal prep e planning',
      'Gestione eventi sociali',
      'Mindful eating',
    ],
    featured: false,
  },
];

// =============================================================================
// COMPONENTE LISTA SERVIZI
// =============================================================================

export function ServicesList() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">
            Cosa Posso Fare per Te
          </h2>
          <p className="text-sage-600 max-w-2xl mx-auto">
            Ogni servizio è pensato per rispondere a esigenze specifiche,
            con un approccio sempre personalizzato e basato sulla scienza.
          </p>
        </motion.div>
        
        {/* Griglia servizi */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group ${
                service.featured ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Card glassmorphism */}
              <div className={`
                h-full p-6 rounded-2xl border transition-all duration-300
                bg-white/70 backdrop-blur-md
                hover:bg-white hover:shadow-xl hover:-translate-y-1
                ${service.featured 
                  ? 'border-sage-300 ring-2 ring-sage-100' 
                  : 'border-sage-100'
                }
              `}>
                {/* Badge featured */}
                {service.featured && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-sage-500 text-white text-xs font-medium rounded-full">
                    Più richiesto
                  </div>
                )}
                
                {/* Header card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center group-hover:from-sage-500 group-hover:to-sage-600 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-sage-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-1 text-sage-500 text-sm">
                    <Timer className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                
                {/* Titolo e descrizione */}
                <h3 className="text-xl font-semibold text-sage-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sage-600 text-sm mb-4">
                  {service.description}
                </p>
                
                {/* Lista include */}
                <ul className="space-y-2 mb-6">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-sage-700">
                      <Check className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Link prenota */}
                <Link
                  href="/agenda"
                  className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 font-medium text-sm group/link"
                >
                  <span>Prenota ora</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
