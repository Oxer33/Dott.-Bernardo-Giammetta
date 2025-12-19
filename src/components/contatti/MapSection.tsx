// =============================================================================
// MAP SECTION - DOTT. BERNARDO GIAMMETTA
// Sezione con mappa Google Maps
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Train } from 'lucide-react';

// =============================================================================
// COMPONENTE MAP SECTION
// =============================================================================

export function MapSection() {
  return (
    <section className="py-16 bg-sage-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-sage-700 rounded-full text-sm font-medium mb-4 shadow-sm">
            <MapPin className="w-4 h-4" />
            <span>Dove Trovarmi</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sage-900 mb-4">
            Lo Studio
          </h2>
          <p className="text-sage-600 max-w-2xl mx-auto">
            Lo studio si trova in una posizione centrale e facilmente raggiungibile
            sia con i mezzi pubblici che in auto.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mappa */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-sage-200 rounded-2xl overflow-hidden h-[400px] relative">
              {/* Placeholder mappa - da sostituire con iframe Google Maps */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage-100 to-sage-200">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                  <p className="text-sage-600 font-medium">Mappa Google Maps</p>
                  <p className="text-sage-500 text-sm">Via Roma 123, Roma</p>
                </div>
              </div>
              
              {/* Quando hai l'API key di Google Maps, sostituisci con: */}
              {/* <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              /> */}
            </div>
          </motion.div>
          
          {/* Info raggiungibilità */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Indirizzo */}
            <div className="bg-white rounded-xl p-5 border border-sage-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-800">Indirizzo</h3>
              </div>
              <p className="text-sage-600 text-sm">
                Via Roma 123<br />
                00100 Roma (RM)<br />
                Citofono: Giammetta
              </p>
            </div>
            
            {/* Come arrivare in auto */}
            <div className="bg-white rounded-xl p-5 border border-sage-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-800">In Auto</h3>
              </div>
              <p className="text-sage-600 text-sm">
                Parcheggio disponibile nelle vie limitrofe.
                Strisce blu a pagamento (€1/ora).
              </p>
            </div>
            
            {/* Come arrivare con mezzi */}
            <div className="bg-white rounded-xl p-5 border border-sage-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                  <Train className="w-5 h-5 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-800">Mezzi Pubblici</h3>
              </div>
              <p className="text-sage-600 text-sm">
                Metro A - Fermata Repubblica (5 min a piedi)<br />
                Bus 64, 170, H - Fermata Via Nazionale
              </p>
            </div>
            
            {/* Navigazione */}
            <a
              href="https://www.google.com/maps/dir//Via+Roma+123+Roma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-4 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium"
            >
              <Navigation className="w-5 h-5" />
              Ottieni indicazioni
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
