// =============================================================================
// CONTACT FORM - DOTT. BERNARDO GIAMMETTA
// Form di contatto con validazione
// =============================================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle } from 'lucide-react';

// =============================================================================
// COMPONENTE FORM
// =============================================================================

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simula invio (da sostituire con API reale)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch {
      setError('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-sage-50 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-sage-600" />
        </div>
        <h3 className="text-xl font-semibold text-sage-800 mb-2">
          Messaggio Inviato!
        </h3>
        <p className="text-sage-600">
          Grazie per avermi contattato. Ti risponderò il prima possibile.
        </p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-display font-bold text-sage-900 mb-6">
        Inviami un Messaggio
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-1">
            Nome completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
            placeholder="Il tuo nome"
          />
        </div>
        
        {/* Email e Telefono */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
              placeholder="email@esempio.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-1">
              Telefono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
              placeholder="+39 123 456 7890"
            />
          </div>
        </div>
        
        {/* Oggetto */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-sage-700 mb-1">
            Oggetto *
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
          >
            <option value="">Seleziona un oggetto</option>
            <option value="info">Richiesta informazioni</option>
            <option value="prenota">Prenotazione visita</option>
            <option value="preventivo">Richiesta preventivo</option>
            <option value="collaborazione">Proposta collaborazione</option>
            <option value="altro">Altro</option>
          </select>
        </div>
        
        {/* Messaggio */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-1">
            Messaggio *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all resize-none"
            placeholder="Scrivi qui il tuo messaggio..."
          />
        </div>
        
        {/* Errore */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Invio in corso...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Invia Messaggio
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
