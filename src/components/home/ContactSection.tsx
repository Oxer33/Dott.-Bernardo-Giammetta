// =============================================================================
// SEZIONE CONTATTO - DOTT. BERNARDO GIAMMETTA
// Sezione con form per essere ricontattati nella home page
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactCallbackForm from '@/components/ui/ContactCallbackForm';
import { SITE_CONFIG } from '@/lib/config';

// =============================================================================
// COMPONENTE
// =============================================================================

export function ContactSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-sage-50 via-cream-50 to-lavender-50 relative overflow-hidden">
      {/* Elementi decorativi */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-lavender-200/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
            📞 Contattami
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">
            Inizia il tuo percorso
          </h2>
          <p className="text-sage-600 max-w-2xl mx-auto">
            Hai domande o vuoi prenotare una consulenza? Compila il form e ti ricontatterò il prima possibile.
          </p>
        </motion.div>

        {/* Grid: Info + Form */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Info di contatto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Card info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sage-100">
              <h3 className="text-xl font-display font-bold text-sage-900 mb-6">
                Informazioni di contatto
              </h3>
              
              <div className="space-y-4">
                {/* Telefono */}
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-sage-50 hover:bg-sage-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sage-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-sage-600">Telefono</p>
                    <p className="font-semibold text-sage-900">{SITE_CONFIG.phone}</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-sage-50 hover:bg-sage-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-lavender-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-sage-600">Email</p>
                    <p className="font-semibold text-sage-900">{SITE_CONFIG.email}</p>
                  </div>
                </a>

                {/* Orari */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-sage-50">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-sage-600">Orari</p>
                    <p className="font-semibold text-sage-900">Lun-Ven 8:30-20:00</p>
                  </div>
                </div>

                {/* Indirizzo */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-sage-50">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-sage-600">Studio</p>
                    <p className="font-semibold text-sage-900">Roma e Online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note aggiuntive */}
            <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl p-6 text-white">
              <h4 className="font-semibold mb-2">💡 Prima visita gratuita</h4>
              <p className="text-sage-100 text-sm">
                La prima consulenza telefonica è gratuita e senza impegno. 
                Contattami per capire insieme come posso aiutarti nel tuo percorso.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactCallbackForm
              variant="card"
              title="Richiedi di essere ricontattato"
              description="Inserisci i tuoi dati e ti contatterò entro 24 ore"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
