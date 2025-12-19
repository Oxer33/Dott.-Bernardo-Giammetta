// =============================================================================
// ERROR PAGE - DOTT. BERNARDO GIAMMETTA
// Pagina personalizzata per errori runtime (500, etc.)
// =============================================================================

'use client';

import { useEffect } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log dell'errore per debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 via-white to-rose-50">
      <div className="text-center px-4 max-w-lg">
        {/* Icona errore */}
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        
        {/* Messaggio */}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-sage-800 mb-4">
          Qualcosa è Andato Storto
        </h1>
        <p className="text-sage-600 mb-8">
          Si è verificato un errore imprevisto. Prova a ricaricare la pagina 
          o torna alla homepage. Se il problema persiste, contattaci.
        </p>
        
        {/* Debug info (solo in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-left">
            <p className="text-sm font-mono text-rose-700 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-rose-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
        
        {/* Azioni */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Riprova
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white text-sage-700 border border-sage-200 rounded-xl hover:bg-sage-50 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Torna alla Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
