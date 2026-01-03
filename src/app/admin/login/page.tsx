// =============================================================================
// PAGINA LOGIN ADMIN - DOTT. BERNARDO GIAMMETTA
// Login per staff medico con AWS Cognito (Pool separato)
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Loader2, AlertTriangle, Shield, Lock } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se già loggato come admin, redirect alla dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin');
    }
  }, [status, session, router]);

  // Login con Cognito ADMIN (redirect alla pagina hosted UI di Cognito per staff)
  const handleAdminSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // signIn('cognito-admin') reindirizza alla pagina di login hosted di Cognito per staff
      await signIn('cognito-admin', { callbackUrl: '/admin' });
    } catch {
      setError('Si è verificato un errore. Riprova.');
      setIsLoading(false);
    }
  };

  // Se sta caricando la sessione
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sage-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card principale */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50">
          {/* Logo e titolo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">
              Area Staff
            </h1>
            <p className="text-slate-400 mt-2">
              Accesso riservato al personale medico
            </p>
          </div>

          {/* Messaggio errore */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Pulsante principale Cognito Admin */}
          <button
            onClick={handleAdminSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-sage-600 to-sage-700 text-white rounded-xl hover:from-sage-700 hover:to-sage-800 transition-all font-medium disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Reindirizzamento...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Accedi come Staff</span>
              </>
            )}
          </button>

          {/* Info box sicurezza */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-sage-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-slate-200 mb-1">
                  Accesso protetto
                </h3>
                <p className="text-sm text-slate-400">
                  Questa area è riservata esclusivamente al personale autorizzato dello studio.
                  Gli accessi vengono monitorati per motivi di sicurezza.
                </p>
              </div>
            </div>
          </div>

          {/* Link per pazienti */}
          <p className="text-center text-slate-500 mt-6 text-sm">
            Sei un paziente?{' '}
            <Link href="/accedi" className="text-sage-400 font-medium hover:underline">
              Accedi qui
            </Link>
          </p>
        </div>

        {/* Link home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
          >
            ← Torna alla Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
