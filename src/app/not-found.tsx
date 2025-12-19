// =============================================================================
// 404 NOT FOUND PAGE - DOTT. BERNARDO GIAMMETTA
// Pagina personalizzata per errore 404
// =============================================================================

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 via-white to-sage-50">
      <div className="text-center px-4">
        {/* Numero 404 grande */}
        <div className="text-[150px] md:text-[200px] font-display font-bold text-sage-100 leading-none select-none">
          404
        </div>
        
        {/* Messaggio */}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-sage-800 -mt-8 mb-4">
          Pagina Non Trovata
        </h1>
        <p className="text-sage-600 max-w-md mx-auto mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
          Torna alla homepage o prova a cercare quello che ti serve.
        </p>
        
        {/* Azioni */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Torna alla Homepage
          </Link>
          <Link
            href="/contatti"
            className="flex items-center gap-2 px-6 py-3 bg-white text-sage-700 border border-sage-200 rounded-xl hover:bg-sage-50 transition-colors font-medium"
          >
            <Search className="w-5 h-5" />
            Contattaci
          </Link>
        </div>
        
        {/* Link rapidi */}
        <div className="mt-12 pt-8 border-t border-sage-100">
          <p className="text-sage-500 text-sm mb-4">Pagine popolari:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/chi-sono" className="text-sage-600 hover:text-sage-800 underline">
              Chi Sono
            </Link>
            <Link href="/servizi" className="text-sage-600 hover:text-sage-800 underline">
              Servizi
            </Link>
            <Link href="/blog" className="text-sage-600 hover:text-sage-800 underline">
              Blog
            </Link>
            <Link href="/agenda" className="text-sage-600 hover:text-sage-800 underline">
              Prenota
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
