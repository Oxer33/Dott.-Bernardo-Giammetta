// =============================================================================
// CONTACT INFO - DOTT. BERNARDO GIAMMETTA
// Informazioni di contatto e orari studio
// =============================================================================

'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  MessageCircle 
} from 'lucide-react';

// =============================================================================
// DATI CONTATTO
// =============================================================================

const contactDetails = [
  {
    icon: MapPin,
    title: 'Indirizzo Studio',
    lines: ['Via Roma 123', '00100 Roma (RM)', 'Italia'],
  },
  {
    icon: Phone,
    title: 'Telefono',
    lines: ['+39 392 0979135', '+39 392 0979135 (WhatsApp)'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['info@bernardogiammetta.com', 'prenotazioni@bernardogiammetta.com'],
  },
];

const workingHours = [
  { day: 'Lunedì', hours: '09:00 - 19:00' },
  { day: 'Martedì', hours: '09:00 - 19:00' },
  { day: 'Mercoledì', hours: '09:00 - 19:00' },
  { day: 'Giovedì', hours: '09:00 - 19:00' },
  { day: 'Venerdì', hours: '09:00 - 18:00' },
  { day: 'Sabato', hours: '09:00 - 13:00' },
  { day: 'Domenica', hours: 'Chiuso' },
];

// =============================================================================
// COMPONENTE CONTACT INFO
// =============================================================================

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-8"
    >
      {/* Info contatto */}
      <div className="bg-cream-50 rounded-2xl p-6 border border-sage-100">
        <h3 className="text-xl font-semibold text-sage-800 mb-6">
          Informazioni di Contatto
        </h3>
        <div className="space-y-6">
          {contactDetails.map((detail) => (
            <div key={detail.title} className="flex gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <detail.icon className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <h4 className="font-medium text-sage-800 mb-1">{detail.title}</h4>
                {detail.lines.map((line, i) => (
                  <p key={i} className="text-sage-600 text-sm">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Orari */}
      <div className="bg-cream-50 rounded-2xl p-6 border border-sage-100">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-sage-600" />
          <h3 className="text-xl font-semibold text-sage-800">
            Orari Studio
          </h3>
        </div>
        <ul className="space-y-3">
          {workingHours.map((item) => (
            <li key={item.day} className="flex justify-between text-sm">
              <span className="text-sage-700 font-medium">{item.day}</span>
              <span className={item.hours === 'Chiuso' ? 'text-red-500' : 'text-sage-600'}>
                {item.hours}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* CTA rapido */}
      <div className="bg-sage-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Prenota Subito</h3>
        </div>
        <p className="text-sage-100 text-sm mb-4">
          Preferisci prenotare direttamente online? Usa il nostro sistema di prenotazione.
        </p>
        <a
          href="/agenda"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-sage-700 rounded-xl hover:bg-cream-50 transition-colors font-medium text-sm"
        >
          Vai all&apos;agenda
        </a>
      </div>
      
      {/* WhatsApp */}
      <a
        href="https://wa.me/393920979135"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 p-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-medium">Scrivimi su WhatsApp</span>
      </a>
    </motion.div>
  );
}
