// =============================================================================
// PAGINA REGISTRAZIONE - DOTT. BERNARDO GIAMMETTA
// Form registrazione con email e password
// =============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { signIn } from 'next-auth/react';

// =============================================================================
// COMPONENTE PAGINA
// =============================================================================

export default function RegistratiPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Gestione input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  // Validazione form
  const validateForm = (): string | null => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return 'Nome e cognome sono richiesti';
    }
    if (!formData.email.trim()) {
      return 'Email è richiesta';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Email non valida';
    }
    if (formData.password.length < 8) {
      return 'La password deve essere di almeno 8 caratteri';
    }
    if (!/[a-zA-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      return 'La password deve contenere almeno una lettera e un numero';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Le password non coincidono';
    }
    return null;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        // Dopo 3 secondi redirect alla pagina login
        setTimeout(() => {
          router.push('/accedi');
        }, 3000);
      } else {
        setError(data.error || 'Errore durante la registrazione');
      }
    } catch {
      setError('Errore di connessione. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Se registrazione completata
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-sage-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-sage-900 mb-3">
            Account Creato! 🎉
          </h1>
          <p className="text-sage-600 mb-6">
            Il tuo account è stato creato con successo. 
            Attendi l'approvazione dell'amministratore per poter prenotare le visite.
          </p>
          <p className="text-sm text-sage-500">
            Reindirizzamento alla pagina di accesso...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-sage-50 p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
              <span className="text-white font-display font-bold text-2xl">BG</span>
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-sage-900">
            Crea il tuo Account
          </h1>
          <p className="text-sage-600 mt-2">
            Registrati per prenotare le tue visite
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome e Cognome */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-sage-700 mb-1">
                Nome *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                  placeholder="Mario"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-sage-700 mb-1">
                Cognome *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="Rossi"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="mario.rossi@email.com"
                required
              />
            </div>
          </div>

          {/* Telefono (opzionale) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-1">
              Telefono <span className="text-sage-400">(opzionale)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="+39 333 1234567"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sage-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="Minimo 8 caratteri"
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
            <p className="text-xs text-sage-500 mt-1">
              Almeno 8 caratteri, una lettera e un numero
            </p>
          </div>

          {/* Conferma Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-sage-700 mb-1">
              Conferma Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                placeholder="Ripeti la password"
                required
              />
            </div>
          </div>

          {/* Errore */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
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
                Registrazione in corso...
              </>
            ) : (
              <>
                Crea Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-sage-200" />
          <span className="text-sage-500 text-sm">oppure</span>
          <div className="flex-1 h-px bg-sage-200" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/area-personale' })}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white border-2 border-sage-200 rounded-xl hover:bg-sage-50 transition-colors font-medium text-sage-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continua con Google
        </button>

        {/* Link Login */}
        <p className="text-center text-sage-600 mt-6">
          Hai già un account?{' '}
          <Link href="/accedi" className="text-sage-700 font-medium hover:underline">
            Accedi
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
