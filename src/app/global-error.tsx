// =============================================================================
// GLOBAL ERROR PAGE - DOTT. BERNARDO GIAMMETTA
// Pagina per errori critici che rompono il layout root
// =============================================================================

'use client';

import { RefreshCw, AlertTriangle } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="it">
      <body className="bg-cream-50">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
            {/* Icona */}
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-rose-500" />
            </div>
            
            {/* Messaggio */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Errore Critico
            </h1>
            <p className="text-gray-600 mb-8">
              Si è verificato un errore grave. Per favore ricarica la pagina.
            </p>
            
            {/* Azione */}
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Ricarica Pagina
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
