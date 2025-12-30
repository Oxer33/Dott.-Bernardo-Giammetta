// =============================================================================
// PAGINA ACCEDI - DOTT. BERNARDO GIAMMETTA
// Pagina di login con Google OAuth, AWS Cognito e Email/Password
// =============================================================================

'use client';

import { useState, Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Leaf, Eye, EyeOff, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================

// Componente interno che usa useSearchParams
function AccediForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/area-personale';
  
  // Messaggi da URL (verifica email, errori)
  const verified = searchParams.get('verified') === 'true';
  const urlError = searchParams.get('error');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Reset loading state quando l'utente torna sulla pagina (es. dopo errore OAuth)
  useEffect(() => {
    setIsGoogleLoading(false);
  }, []);

  // Login con Google
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setError('Si è verificato un errore. Riprova.');
      setIsGoogleLoading(false);
    }
  };

  // Login con Email/Password
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setError('Errore di connessione. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-lavender-50 flex items-center justify-center p-4">
      {/* Elementi decorativi */}
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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-sage-900">
              Benvenuto
            </h1>
            <p className="text-sage-600 mt-2">
              Accedi al tuo spazio personale
            </p>
          </div>

          {/* Successo verifica email */}
          {verified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Email verificata!</p>
                <p className="text-green-700 text-sm">Ora puoi accedere con le tue credenziali.</p>
              </div>
            </motion.div>
          )}

          {/* Errore */}
          {error && !verified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form Email/Password */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
                  placeholder="email@esempio.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400"
                  placeholder="La tua password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Accesso in corso...</>
              ) : (
                <>Accedi <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-sage-200" />
            <span className="text-sage-500 text-sm">oppure</span>
            <div className="flex-1 h-px bg-sage-200" />
          </div>

          {/* Pulsante Google */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full justify-center bg-white hover:bg-sage-50 text-sage-800 border-2 border-sage-200 hover:border-sage-300 shadow-sm"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continua con Google</span>
              </>
            )}
          </Button>

          {/* Link registrazione */}
          <div className="bg-lavender-50 rounded-xl p-4 border border-lavender-100 mt-6">
            <h3 className="font-medium text-lavender-800 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Non hai un account?
            </h3>
            <p className="text-sm text-lavender-700 mb-3">
              Crea un account per prenotare le tue visite. Dopo la registrazione, attendi l'approvazione.
            </p>
            <Link
              href="/registrati"
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              Registrati ora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Link */}
          <p className="text-center text-sm text-sage-500 mt-6">
            Tornando indietro accetti i nostri{' '}
            <Link href="/privacy" className="text-sage-700 hover:underline">
              Termini e Condizioni
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
      </motion.div>
    </div>
  );
}

// Componente wrapper con Suspense per useSearchParams
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
