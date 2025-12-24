// =============================================================================
// PWA INSTALL PROMPT - DOTT. BERNARDO GIAMMETTA
// Prompt per installazione app su dispositivi mobile/tablet
// Mostra solo se: mobile/tablet + non installata + non già rifiutata
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, Download, Share, Plus, Check } from 'lucide-react';
import { Button } from './Button';

// =============================================================================
// COSTANTI
// =============================================================================

// Chiave localStorage per ricordare se l'utente ha già rifiutato
const PWA_PROMPT_DISMISSED_KEY = 'pwa_prompt_dismissed';
// Chiave per ricordare se l'app è già installata
const PWA_INSTALLED_KEY = 'pwa_installed';
// Delay prima di mostrare il prompt (ms)
const PROMPT_DELAY = 3000;

// =============================================================================
// TIPI
// =============================================================================

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Controlla se siamo in modalità standalone (app già installata)
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
        // @ts-ignore - Safari iOS
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
      
      if (standalone) {
        localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      }
    };
    checkStandalone();

    // Se già installata o già rifiutata, non mostrare
    const dismissed = localStorage.getItem(PWA_PROMPT_DISMISSED_KEY);
    const installed = localStorage.getItem(PWA_INSTALLED_KEY);
    
    if (dismissed || installed || isStandalone) {
      return;
    }

    // Rileva iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Rileva se è mobile o tablet
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

    if (!isMobileOrTablet) {
      return; // Non mostrare su desktop
    }

    // Per iOS, mostra prompt manuale dopo delay
    if (iOS) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, PROMPT_DELAY);
      return () => clearTimeout(timer);
    }

    // Per Android/altri, intercetta evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostra prompt dopo delay
      setTimeout(() => {
        setShowPrompt(true);
      }, PROMPT_DELAY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Rileva quando l'app viene installata
    const handleAppInstalled = () => {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  // Gestisci installazione Android
  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  // Chiudi e ricorda la scelta
  const handleDismiss = () => {
    localStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
    setShowPrompt(false);
  };

  // Non mostrare se già in standalone o nulla da mostrare
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[90] md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-sage-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-sage-500 to-sage-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Smartphone className="w-5 h-5" />
                <span className="font-semibold">Installa l'App</span>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sage-700 mb-4">
                Installa l'app del <strong>Dott. Bernardo Giammetta</strong> per un'esperienza migliore!
              </p>

              {/* Vantaggi */}
              <ul className="space-y-2 mb-4 text-sm text-sage-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Accesso rapido dalla home
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Navigazione più fluida
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Notifiche appuntamenti
                </li>
              </ul>

              {/* Istruzioni iOS */}
              {isIOS ? (
                <div className="bg-sage-50 rounded-xl p-3 mb-4">
                  <p className="text-sm text-sage-700 font-medium mb-2">
                    Come installare su iPhone/iPad:
                  </p>
                  <ol className="text-sm text-sage-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-sage-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <span>Tocca <Share className="w-4 h-4 inline text-blue-500" /> in basso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-sage-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <span>Scorri e tocca "Aggiungi a Home" <Plus className="w-4 h-4 inline" /></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-sage-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <span>Tocca "Aggiungi" in alto a destra</span>
                    </li>
                  </ol>
                </div>
              ) : (
                /* Pulsante installazione Android */
                <Button
                  onClick={handleInstall}
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Installa Ora
                </Button>
              )}

              {/* Link per chiudere */}
              <button
                onClick={handleDismiss}
                className="w-full text-center text-sm text-sage-500 hover:text-sage-700 mt-3 py-2"
              >
                Non ora, grazie
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PWAInstallPrompt;
