// =============================================================================
// GUEST VIEW - AREA PERSONALE
// Vista per utenti non autenticati o non in whitelist
// =============================================================================

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Phone, Mail, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';

// =============================================================================
// PROPS
// =============================================================================

interface GuestViewProps {
  isLoggedIn?: boolean;
  userName?: string | null;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export function GuestView({ isLoggedIn = false, userName }: GuestViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-lavender-50 py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto text-center"
        >
          {/* Icona */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-lavender-100 flex items-center justify-center">
            <Lock className="w-10 h-10 text-lavender-500" />
          </div>

          {/* Titolo */}
          <h1 className="text-3xl font-display font-bold text-sage-900 mb-4">
            {isLoggedIn ? `Ciao ${userName || 'Utente'}!` : 'Area Riservata'}
          </h1>

          {/* Messaggio */}
          <p className="text-sage-600 mb-8">
            {isLoggedIn ? (
              <>
                Per accedere all'agenda e prenotare visite, devi essere un paziente registrato.
                <br />
                Contatta lo studio per essere inserito nella lista pazienti.
              </>
            ) : (
              <>
                Accedi per visualizzare i tuoi appuntamenti e gestire il tuo profilo.
                <br />
                Se sei un nuovo paziente, contatta prima lo studio.
              </>
            )}
          </p>

          {/* Azioni */}
          <div className="space-y-4">
            {!isLoggedIn && (
              <Button
                onClick={() => signIn('google')}
                className="w-full justify-center bg-lavender-500 hover:bg-lavender-600"
              >
                <LogIn className="w-5 h-5" />
                <span>Accedi con Google</span>
              </Button>
            )}

            {/* Contatti */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-lavender-100">
              <h3 className="font-semibold text-sage-800 mb-4">
                Contatta lo Studio
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+393920979135"
                  className="flex items-center gap-3 text-sage-600 hover:text-sage-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-500" />
                  </div>
                  <span>+39 392 0979135</span>
                </a>
                <a
                  href="mailto:info@bernardogiammetta.com"
                  className="flex items-center gap-3 text-sage-600 hover:text-sage-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-sage-500" />
                  </div>
                  <span>info@bernardogiammetta.com</span>
                </a>
              </div>
            </div>

            {/* Link utili */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/servizi"
                className="text-lavender-600 hover:text-lavender-700 text-sm font-medium"
              >
                Scopri i Servizi
              </Link>
              <Link
                href="/contatti"
                className="text-lavender-600 hover:text-lavender-700 text-sm font-medium"
              >
                Contattaci
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
