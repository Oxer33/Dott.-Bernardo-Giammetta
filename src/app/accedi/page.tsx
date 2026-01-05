// =============================================================================
// PAGINA ACCEDI - DOTT. BERNARDO GIAMMETTA
// Login con AWS Cognito (NextAuth)
// =============================================================================

'use client';

import { useState, Suspense, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Loader2, AlertTriangle, LogIn, UserPlus, Shield } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// COMPONENTE FORM LOGIN
// =============================================================================

function AccediForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/area-personale';
  
  // Messaggi da URL (errori OAuth)
  const urlError = searchParams.get('error');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'login' | 'register' | 'admin' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Se già loggato, redirect
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  // Gestione errori OAuth
  useEffect(() => {
    if (urlError) {
      switch (urlError) {
        case 'OAuthAccountNotLinked':
          setError('Questa email è già associata ad un altro metodo di accesso.');
          break;
        case 'AccessDenied':
          setError('Accesso negato. Contatta lo studio per assistenza.');
          break;
        case 'Configuration':
          setError('Errore di configurazione. Riprova più tardi.');
          break;
        default:
          setError('Si è verificato un errore durante l\'accesso. Riprova.');
      }
    }
  }, [urlError]);

  // Login con Cognito PATIENTS (redirect alla pagina hosted UI di Cognito)
  const handleCognitoSignIn = async () => {
    setIsLoading(true);
    setLoadingType('login');
    setError(null);
    try {
      // signIn('cognito-patients') reindirizza alla pagina di login hosted di Cognito per pazienti
      await signIn('cognito-patients', { callbackUrl });
    } catch {
      setError('Si è verificato un errore. Riprova.');
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  // Registrazione con Cognito PATIENTS (redirect diretto alla pagina di signup)
  const handleCognitoRegister = () => {
    setIsLoading(true);
    setLoadingType('register');
    setError(null);
    
    // Costruisce URL di signup direttamente per evitare che l'utente debba cliccare "Sign up"
    const cognitoDomain = 'https://eu-north-1xi3v8zvoy.auth.eu-north-1.amazoncognito.com';
    const clientId = process.env.NEXT_PUBLIC_COGNITO_PATIENTS_CLIENT_ID || '1ecaje9g00o1kpsl3jvmll456q';
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/cognito-patients`);
    const signupUrl = `${cognitoDomain}/signup?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+email+profile`;
    
    window.location.href = signupUrl;
  };

  // Login Admin con Cognito ADMIN
  const handleAdminSignIn = async () => {
    setIsLoading(true);
    setLoadingType('admin');
    setError(null);
    try {
      await signIn('cognito-admin', { callbackUrl: '/admin' });
    } catch {
      setError('Si è verificato un errore. Riprova.');
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  // Se sta caricando la sessione, mostra loader
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-cream-50 to-lavender-50">
        <Loader2 className="w-8 h-8 text-sage-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-lavender-50 flex items-center justify-center p-4">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card principale */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          {/* Logo e titolo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-sage-900">
              Benvenuto
            </h1>
            <p className="text-sage-600 mt-2">
              Accedi o registrati per prenotare le tue visite
            </p>
          </div>

          {/* Messaggio errore */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Bottoni principali - ACCEDI e REGISTRATI */}
          <div className="space-y-4">
            {/* Bottone ACCEDI */}
            <button
              onClick={handleCognitoSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-xl hover:from-sage-600 hover:to-sage-700 transition-all font-medium disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading && loadingType === 'login' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Reindirizzamento...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Accedi al tuo Account</span>
                </>
              )}
            </button>

            {/* Bottone REGISTRATI */}
            <button
              onClick={handleCognitoRegister}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-lavender-500 to-lavender-600 text-white rounded-xl hover:from-lavender-600 hover:to-lavender-700 transition-all font-medium disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading && loadingType === 'register' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Reindirizzamento...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Registrati come Nuovo Paziente</span>
                </>
              )}
            </button>
          </div>

          {/* Info registrazione */}
          <p className="mt-4 text-center text-sm text-sage-600">
            Nella pagina successiva potrai accedere o creare un nuovo account.
          </p>

          {/* Info processo */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-sage-700 text-center">
              Come funziona:
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-cream-50 rounded-xl">
                <div className="text-lg font-bold text-sage-600 mb-1">1</div>
                <p className="text-xs text-sage-600">Accedi o Registrati</p>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl">
                <div className="text-lg font-bold text-sage-600 mb-1">2</div>
                <p className="text-xs text-sage-600">Verifica Email</p>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl">
                <div className="text-lg font-bold text-sage-600 mb-1">3</div>
                <p className="text-xs text-sage-600">Prenota Visita</p>
              </div>
            </div>
          </div>

          {/* Link privacy */}
          <p className="text-center text-xs text-sage-500 mt-6">
            Accedendo accetti i nostri{' '}
            <Link href="/termini" className="text-sage-700 hover:underline">
              Termini di Servizio
            </Link>
            {' '}e la{' '}
            <Link href="/privacy" className="text-sage-700 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Link home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sage-600 hover:text-sage-800 text-sm font-medium transition-colors"
          >
            ← Torna alla Home
          </Link>
        </div>

        {/* Link admin - discreto in fondo, va direttamente a Cognito */}
        <div className="text-center mt-8">
          <button
            onClick={handleAdminSignIn}
            disabled={isLoading}
            className="text-sage-400 hover:text-sage-600 text-xs transition-colors disabled:opacity-50"
          >
            {isLoading && loadingType === 'admin' ? 'Reindirizzamento...' : 'Login Admin'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPALE CON SUSPENSE
// =============================================================================

export default function AccediPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-cream-50 to-lavender-50">
        <Loader2 className="w-8 h-8 text-sage-500 animate-spin" />
      </div>
    }>
      <AccediForm />
    </Suspense>
  );
}
