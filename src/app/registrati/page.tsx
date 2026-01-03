// =============================================================================
// PAGINA REGISTRATI - DOTT. BERNARDO GIAMMETTA
// Redirect a Cognito per registrazione (la registrazione avviene su Cognito)
// =============================================================================

'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Loader2, UserPlus, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export default function RegistratiPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Se già loggato, redirect all'area personale
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/area-personale');
    }
  }, [status, session, router]);

  // Redirect automatico a Cognito per registrazione
  const handleRegister = async () => {
    // signIn('cognito') porta alla pagina Cognito dove si può anche registrare
    await signIn('cognito', { callbackUrl: '/area-personale' });
  };

  // Se sta caricando la sessione
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-sage-50">
        <Loader2 className="w-8 h-8 text-sage-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-sage-50 p-4">
      {/* Elementi decorativi */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-lavender-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/50"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-sage-900">
            Diventa Paziente
          </h1>
          <p className="text-sage-600 mt-2">
            Registrati per prenotare le tue visite nutrizionali
          </p>
        </div>

        {/* Vantaggi registrazione */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <span className="text-sm text-sage-700">Prenota visite online 24/7</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <span className="text-sm text-sage-700">Storico appuntamenti sempre disponibile</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0" />
            <span className="text-sm text-sage-700">Promemoria automatici via email</span>
          </div>
        </div>

        {/* Pulsante registrazione */}
        <button
          onClick={handleRegister}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-xl hover:from-sage-600 hover:to-sage-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-5 h-5" />
          <span>Registrati Ora</span>
        </button>

        {/* Info registrazione */}
        <div className="mt-6 p-4 bg-lavender-50 rounded-xl border border-lavender-100">
          <h3 className="font-medium text-lavender-800 mb-2">
            Cosa succede dopo:
          </h3>
          <ol className="text-sm text-lavender-700 space-y-1 list-decimal list-inside">
            <li>Inserisci i tuoi dati nel form sicuro</li>
            <li>Ricevi email di verifica</li>
            <li>Conferma la tua email</li>
            <li>Accedi e prenota la tua prima visita!</li>
          </ol>
        </div>

        {/* Link Login */}
        <p className="text-center text-sage-600 mt-6">
          Hai già un account?{' '}
          <Link href="/accedi" className="text-sage-700 font-medium hover:underline">
            Accedi
          </Link>
        </p>

        {/* Link home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sage-500 hover:text-sage-700 text-sm transition-colors"
          >
            ← Torna alla Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
