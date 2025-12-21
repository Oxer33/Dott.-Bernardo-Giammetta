// =============================================================================
// COOKIE CONSENT BANNER - DOTT. BERNARDO GIAMMETTA
// Banner per consenso cookie GDPR
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// COSTANTI
// =============================================================================

const COOKIE_CONSENT_KEY = 'cookie-consent';

// =============================================================================
// COMPONENTE COOKIE CONSENT
// =============================================================================

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Sempre attivo
    analytics: false,
    marketing: false,
  });

  // Controlla se c'è già un consenso salvato
  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Mostra banner dopo 1 secondo
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Salva consenso
  const saveConsent = (acceptAll: boolean) => {
    const consent = acceptAll
      ? { necessary: true, analytics: true, marketing: true }
      : preferences;
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShowBanner(false);
    
    // Qui puoi attivare/disattivare gli script in base alle preferenze
    if (consent.analytics) {
      // Attiva Google Analytics - il componente GoogleAnalytics si occupa del tracking
      // La configurazione viene gestita tramite il componente dedicato
    }
  };

  // Rifiuta tutti (solo necessari)
  const rejectAll = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-sage-100 overflow-hidden">
            {/* Banner principale */}
            {!showSettings ? (
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-sage-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">
                      Utilizziamo i Cookie 🍪
                    </h3>
                    <p className="text-sage-600 text-sm mb-4">
                      Questo sito utilizza cookie per migliorare la tua esperienza. 
                      Alcuni sono essenziali, altri ci aiutano a capire come usi il sito.{' '}
                      <Link href="/privacy" className="underline hover:text-sage-800">
                        Leggi la Privacy Policy
                      </Link>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => saveConsent(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors font-medium text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Accetta Tutti
                      </button>
                      <button
                        onClick={rejectAll}
                        className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors font-medium text-sm"
                      >
                        Solo Necessari
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sage-600 hover:text-sage-800 transition-colors font-medium text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Personalizza
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={rejectAll}
                    className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
                    aria-label="Chiudi"
                  >
                    <X className="w-5 h-5 text-sage-500" />
                  </button>
                </div>
              </div>
            ) : (
              /* Impostazioni dettagliate */
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-sage-800">
                    Preferenze Cookie
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-sage-500" />
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  {/* Necessari */}
                  <div className="flex items-center justify-between p-4 bg-sage-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-sage-800">Necessari</h4>
                      <p className="text-sm text-sage-600">
                        Essenziali per il funzionamento del sito
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-sage-400 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  
                  {/* Analytics */}
                  <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-sage-800">Analytics</h4>
                      <p className="text-sm text-sage-600">
                        Ci aiutano a capire come usi il sito
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.analytics ? 'bg-sage-500' : 'bg-sage-200'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        preferences.analytics ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  
                  {/* Marketing */}
                  <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-sage-800">Marketing</h4>
                      <p className="text-sm text-sage-600">
                        Per mostrarti contenuti personalizzati
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.marketing ? 'bg-sage-500' : 'bg-sage-200'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        preferences.marketing ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => saveConsent(false)}
                  className="w-full py-3 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium"
                >
                  Salva Preferenze
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
