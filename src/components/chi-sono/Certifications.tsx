// =============================================================================
// CERTIFICAZIONI - DOTT. BERNARDO GIAMMETTA
// Galleria delle certificazioni e formazione professionale
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle, ExternalLink } from 'lucide-react';

// =============================================================================
// DATI CERTIFICAZIONI
// =============================================================================

const certifications = [
  {
    title: 'Ordine Nazionale dei Biologi',
    subtitle: 'Iscrizione Albo Sezione A',
    number: 'N° XXXXX',
    description: 'Abilitazione all\'esercizio della professione di Biologo Nutrizionista.',
    verified: true,
  },
  {
    title: 'Laurea Magistrale in Biologia',
    subtitle: 'Università degli Studi di Roma',
    number: '110/110 e Lode',
    description: 'Indirizzo Biomedico con specializzazione in Biochimica della Nutrizione.',
    verified: true,
  },
  {
    title: 'Master Nutrizione Clinica',
    subtitle: 'Istituto Accreditato ECM',
    number: 'Certificato',
    description: 'Formazione avanzata in dietoterapia e nutrizione clinica.',
    verified: true,
  },
  {
    title: 'Nutrizione Sportiva',
    subtitle: 'Certificazione Internazionale',
    number: 'ISSN Certified',
    description: 'Specializzazione in nutrizione per atleti e performance sportiva.',
    verified: true,
  },
  {
    title: 'Nutrizione Funzionale',
    subtitle: 'Institute for Functional Medicine',
    number: 'AFMCP',
    description: 'Approccio integrato e personalizzato alla nutrizione e alla salute.',
    verified: true,
  },
  {
    title: 'Aggiornamento Continuo ECM',
    subtitle: 'Crediti Formativi',
    number: '150+ crediti',
    description: 'Formazione continua in ambito nutrizionale e biomedico.',
    verified: true,
  },
];

// =============================================================================
// COMPONENTE CERTIFICAZIONI
// =============================================================================

export function Certifications() {
  return (
    <section className="py-20 bg-gradient-to-br from-sage-50 to-cream-50">
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
            Formazione e Competenze
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">
            Certificazioni Professionali
          </h2>
          <p className="text-sage-600 max-w-2xl mx-auto">
            La mia formazione continua garantisce un approccio sempre aggiornato
            e basato sulle più recenti evidenze scientifiche.
          </p>
        </motion.div>
        
        {/* Griglia certificazioni */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-sage-100 shadow-sm hover:shadow-lg transition-all group"
            >
              {/* Header card */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center group-hover:bg-sage-500 transition-colors">
                  <Award className="w-6 h-6 text-sage-600 group-hover:text-white transition-colors" />
                </div>
                {cert.verified && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verificato</span>
                  </div>
                )}
              </div>
              
              {/* Contenuto */}
              <h3 className="text-lg font-semibold text-sage-800 mb-1">
                {cert.title}
              </h3>
              <p className="text-sage-500 text-sm mb-2">
                {cert.subtitle}
              </p>
              <div className="inline-block px-2 py-1 bg-sage-50 text-sage-700 rounded text-xs font-medium mb-3">
                {cert.number}
              </div>
              <p className="text-sage-600 text-sm">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Link verifica */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.onb.it"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
          >
            <span>Verifica iscrizione su ONB</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
