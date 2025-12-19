// =============================================================================
// TIMELINE CARRIERA - DOTT. BERNARDO GIAMMETTA
// Timeline animata con le tappe principali della carriera
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Building, Star } from 'lucide-react';

// =============================================================================
// DATI TIMELINE
// =============================================================================

const timelineEvents = [
  {
    year: '2008',
    title: 'Laurea in Scienze Biologiche',
    description: 'Laurea magistrale con lode presso l\'Università degli Studi di Roma. Tesi sperimentale in biochimica della nutrizione.',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2009',
    title: 'Abilitazione e Iscrizione ONB',
    description: 'Superamento dell\'esame di stato e iscrizione all\'Ordine Nazionale dei Biologi, sezione A.',
    icon: Award,
    type: 'certification',
  },
  {
    year: '2010',
    title: 'Master in Nutrizione Clinica',
    description: 'Specializzazione in nutrizione clinica e dietoterapia presso un istituto di formazione accreditato.',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2012',
    title: 'Apertura Studio Privato',
    description: 'Inizio dell\'attività libero-professionale con focus su nutrizione funzionale e metabolismo.',
    icon: Building,
    type: 'career',
  },
  {
    year: '2015',
    title: 'Certificazione Nutrizione Sportiva',
    description: 'Specializzazione in nutrizione per atleti e sportivi, con focus su performance e recupero.',
    icon: Star,
    type: 'certification',
  },
  {
    year: '2018',
    title: 'Collaborazioni Cliniche',
    description: 'Avvio di collaborazioni con centri medici e cliniche per approcci multidisciplinari alla salute.',
    icon: Briefcase,
    type: 'career',
  },
  {
    year: '2020',
    title: 'Formazione Nutrizione Funzionale',
    description: 'Approfondimento in medicina funzionale e approccio integrato alla nutrizione.',
    icon: GraduationCap,
    type: 'education',
  },
  {
    year: '2023',
    title: 'Oltre 1000 Pazienti',
    description: 'Raggiungimento del traguardo di oltre 1000 pazienti seguiti con successo nel loro percorso.',
    icon: Star,
    type: 'milestone',
  },
];

// =============================================================================
// COMPONENTE TIMELINE
// =============================================================================

export function Timeline() {
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
          <span className="inline-block px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
            Il Mio Percorso
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">
            Timeline della Carriera
          </h2>
          <p className="text-sage-600 max-w-2xl mx-auto">
            Un percorso di formazione continua e passione per la nutrizione,
            sempre al servizio del benessere dei miei pazienti.
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Linea centrale */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-sage-200 hidden md:block" />
          
          {/* Eventi */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year + event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Contenuto */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-cream-50 p-6 rounded-xl border border-sage-100 hover:shadow-lg transition-shadow">
                    <span className="inline-block px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-3">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-semibold text-sage-800 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sage-600">
                      {event.description}
                    </p>
                  </div>
                </div>
                
                {/* Icona centrale */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-sage-500 rounded-full items-center justify-center shadow-lg">
                  <event.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Spazio vuoto */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
