// =============================================================================
// PROFILE CONTENT - DOTT. BERNARDO GIAMMETTA
// Componente per gestione profilo utente e questionario
// =============================================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// TIPI
// =============================================================================

interface ProfileContentProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: 'ADMIN' | 'PATIENT';
    isWhitelisted: boolean;
    phone?: string | null;
  };
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export function ProfileContent({ user }: ProfileContentProps) {
  // Form state
  const [firstName, setFirstName] = useState(user.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user.name?.split(' ').slice(1).join(' ') || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Salva profilo
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          phone,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await response.json();
        setSaveError(data.error || 'Errore nel salvataggio');
      }
    } catch (error) {
      setSaveError('Errore di connessione');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Colonna sinistra - Profilo */}
      <div className="lg:col-span-2 space-y-6">
        {/* Card Dati Personali */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center">
              <User className="w-6 h-6 text-lavender-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-sage-900">
                Dati Personali
              </h2>
              <p className="text-sage-500 text-sm">
                Aggiorna le tue informazioni
              </p>
            </div>
          </div>

          {/* Nota importante */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-800 font-medium text-sm">
                  Usa il tuo nome e cognome reali
                </p>
                <p className="text-orange-600 text-sm mt-1">
                  Per facilitare il lavoro del medico e la gestione delle tue visite, 
                  ti consigliamo di utilizzare i tuoi dati anagrafici reali e non nomi fittizi.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Il tuo nome"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 
                           focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                           outline-none text-sage-800 placeholder:text-sage-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Cognome *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Il tuo cognome"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 
                           focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                           outline-none text-sage-800 placeholder:text-sage-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sage-50 border border-sage-200">
                <Mail className="w-5 h-5 text-sage-400" />
                <span className="text-sage-600">{user.email}</span>
                <span className="ml-auto text-xs text-sage-400">(non modificabile)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Telefono
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 123 456 7890"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage-200 
                           focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100
                           outline-none text-sage-800 placeholder:text-sage-400"
                />
              </div>
            </div>

            {/* Messaggi di stato */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Profilo salvato con successo!</span>
              </motion.div>
            )}

            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{saveError}</span>
              </motion.div>
            )}

            {/* Pulsante salva */}
            <button
              onClick={handleSaveProfile}
              disabled={isSaving || !firstName || !lastName}
              className="w-full md:w-auto px-6 py-3 bg-lavender-500 hover:bg-lavender-600 
                       text-white rounded-xl font-medium transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salva Modifiche
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Card Questionario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-sage-900">
                Questionario Alimentare
              </h2>
              <p className="text-sage-500 text-sm">
                Compila prima della tua visita
              </p>
            </div>
          </div>

          <p className="text-sage-600 mb-6">
            Il questionario alimentare è fondamentale per permettere al Dott. Giammetta 
            di preparare al meglio la tua consulenza. Contiene 35 domande sulle tue 
            abitudini alimentari, stile di vita e obiettivi.
          </p>

          <Link
            href="/profilo/questionario"
            className="flex items-center justify-between p-4 bg-sage-50 hover:bg-sage-100 
                     rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sage-200 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sage-700" />
              </div>
              <div>
                <span className="font-medium text-sage-900">Compila il questionario</span>
                <p className="text-sm text-sage-500">~15-20 minuti</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-sage-400 group-hover:text-sage-600 transition-colors" />
          </Link>
        </motion.div>
      </div>

      {/* Colonna destra - Stato account */}
      <div className="space-y-6">
        {/* Card Stato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-display font-bold text-sage-900 mb-4">
            Stato Account
          </h3>

          <div className="space-y-4">
            {/* Ruolo */}
            <div className="flex items-center justify-between py-2 border-b border-sage-100">
              <span className="text-sage-600">Ruolo</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-sage-100 text-sage-700'
              }`}>
                {user.role === 'ADMIN' ? 'Amministratore' : 'Paziente'}
              </span>
            </div>

            {/* Whitelist */}
            <div className="flex items-center justify-between py-2 border-b border-sage-100">
              <span className="text-sage-600">Prenotazioni</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                user.isWhitelisted 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {user.isWhitelisted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Abilitato
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Non abilitato
                  </>
                )}
              </span>
            </div>
          </div>

          {!user.isWhitelisted && (
            <div className="mt-4 p-4 bg-orange-50 rounded-xl">
              <p className="text-orange-800 text-sm">
                Per prenotare visite, contatta lo studio al{' '}
                <a href="tel:+393920979135" className="font-semibold underline">
                  +39 392 0979135
                </a>
              </p>
            </div>
          )}
        </motion.div>

        {/* Link rapidi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-display font-bold text-sage-900 mb-4">
            Link Rapidi
          </h3>

          <div className="space-y-2">
            {user.isWhitelisted && (
              <Link
                href="/agenda"
                className="flex items-center justify-between p-3 hover:bg-sage-50 rounded-xl transition-colors"
              >
                <span className="text-sage-700">Prenota visita</span>
                <ChevronRight className="w-5 h-5 text-sage-400" />
              </Link>
            )}
            <Link
              href="/servizi"
              className="flex items-center justify-between p-3 hover:bg-sage-50 rounded-xl transition-colors"
            >
              <span className="text-sage-700">I nostri servizi</span>
              <ChevronRight className="w-5 h-5 text-sage-400" />
            </Link>
            <Link
              href="/contatti"
              className="flex items-center justify-between p-3 hover:bg-sage-50 rounded-xl transition-colors"
            >
              <span className="text-sage-700">Contattaci</span>
              <ChevronRight className="w-5 h-5 text-sage-400" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
