// =============================================================================
// FORM RICONTATTO - DOTT. BERNARDO GIAMMETTA
// Componente per richiedere di essere ricontattati
// Usato in home page e aree ad accesso limitato
// =============================================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X
} from 'lucide-react';

// =============================================================================
// TIPI
// =============================================================================

interface ContactCallbackFormProps {
  // Variante di stile: 'card' per card standalone, 'inline' per inline
  variant?: 'card' | 'inline' | 'modal';
  // Titolo personalizzato
  title?: string;
  // Descrizione personalizzata
  description?: string;
  // Callback quando il form viene chiuso (per modal)
  onClose?: () => void;
  // Classe CSS aggiuntiva
  className?: string;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export default function ContactCallbackForm({
  variant = 'card',
  title = 'Richiedi di essere ricontattato',
  description = 'Compila il form e ti ricontatteremo al più presto',
  onClose,
  className = '',
}: ContactCallbackFormProps) {
  // State form
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Gestione input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Reset errore quando l'utente modifica
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', contactInfo: '', message: '' });
        // Chiudi modal dopo 3 secondi se è modal
        if (variant === 'modal' && onClose) {
          setTimeout(onClose, 3000);
        }
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Errore durante l\'invio');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Errore di connessione. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Contenuto del form
  const formContent = (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-sage-900">
            {title}
          </h3>
          {variant === 'modal' && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-sage-100 transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5 text-sage-500" />
            </button>
          )}
        </div>
        <p className="text-sage-600 text-sm mt-1">{description}</p>
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-sage-900 mb-2">
              Messaggio inviato!
            </h4>
            <p className="text-sage-600 text-sm">
              Ti ricontatteremo al più presto.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Nome */}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-sage-700 mb-1">
                Nome e Cognome *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
                  placeholder="Mario Rossi"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Email o Telefono */}
            <div>
              <label htmlFor="contact-info" className="block text-sm font-medium text-sage-700 mb-1">
                Email o Telefono *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sage-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs">/</span>
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="contact-info"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
                  placeholder="email@esempio.com o +39 333 1234567"
                  required
                  minLength={5}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Messaggio */}
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-sage-700 mb-1">
                Messaggio *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-sage-400" />
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all resize-none"
                  placeholder="Descrivi brevemente il motivo del contatto..."
                  rows={4}
                  required
                  minLength={10}
                  maxLength={2000}
                />
              </div>
              <p className="text-xs text-sage-500 mt-1 text-right">
                {formData.message.length}/2000
              </p>
            </div>

            {/* Errore */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errorMessage}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Invia Richiesta
                </>
              )}
            </button>

            {/* Privacy note */}
            <p className="text-xs text-sage-500 text-center">
              Inviando questo form accetti la nostra{' '}
              <a href="/privacy" className="text-sage-700 hover:underline">
                Privacy Policy
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );

  // Render in base alla variante
  if (variant === 'modal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md ${className}`}
        >
          {formContent}
        </motion.div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`${className}`}>
        {formContent}
      </div>
    );
  }

  // Default: card
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-sage-100 p-6 ${className}`}>
      {formContent}
    </div>
  );
}
