// =============================================================================
// PAGINA AGENDA - DOTT. BERNARDO GIAMMETTA
// Visualizzazione PROTETTA dell'agenda - solo utenti autorizzati
// =============================================================================

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AgendaCalendar } from '@/components/agenda/AgendaCalendar';
import { AgendaMasterView } from '@/components/agenda/AgendaMasterView';
import { PatientNavigation } from '@/components/shared/PatientNavigation';
import Link from 'next/link';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// METADATA SEO
// =============================================================================

export const metadata: Metadata = {
  title: 'Prenota una Visita',
  description: 'Prenota facilmente il tuo appuntamento con il Dott. Bernardo Giammetta. Consulta la disponibilità e scegli la fascia oraria più comoda per te.',
  openGraph: {
    title: 'Prenota una Visita | Dott. Bernardo Giammetta',
    description: 'Prenota facilmente il tuo appuntamento. Consulta la disponibilità e scegli la fascia oraria più comoda per te.',
  },
};

// =============================================================================
// PAGE COMPONENT - PROTETTA
// =============================================================================

export default async function AgendaPage() {
  // Verifica autenticazione
  const session = await getServerSession(authOptions);
  
  // Se non autenticato, mostra messaggio e link per accedere
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sage-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-sage-900 mb-2">
            Area Riservata
          </h1>
          <p className="text-sage-600 mb-6">
            Per prenotare una visita devi prima accedere con il tuo account.
          </p>
          <Link 
            href="/accedi"
            className="inline-flex items-center justify-center px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium transition-colors"
          >
            Accedi per prenotare
          </Link>
        </div>
      </div>
    );
  }
  
  // Se autenticato ma NON in whitelist e NON admin, mostra messaggio
  if (!session.user.isWhitelisted && session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-sage-900 mb-2">
            Accesso Limitato
          </h1>
          <p className="text-sage-600 mb-4">
            Ciao <strong>{session.user.name}</strong>! Il tuo account non è ancora abilitato per le prenotazioni.
          </p>
          <p className="text-sage-500 text-sm mb-6">
            Per essere inserito nella lista dei pazienti, contatta lo studio:
          </p>
          <a 
            href="tel:+393920979135"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
          >
            📞 Chiama: +39 392 0979135
          </a>
        </div>
      </div>
    );
  }
  
  // Punto 1: Account master vede vista semplificata con navigazione
  if (session.user.email && isMasterAccount(session.user.email)) {
    return <AgendaMasterView />;
  }
  
  // Utente autorizzato (whitelist) - mostra l'agenda normale con descrizione
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header con descrizione */}
      <section className="bg-gradient-to-br from-sage-400 to-sage-600 text-white py-16 lg:py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              Agenda Online
            </span>
            <h1 className="text-display-md lg:text-display-lg mb-4">
              Prenota la tua <em className="text-sage-100">visita</em>
            </h1>
            <p className="text-sage-100 text-lg leading-relaxed">
              Consulta la mia disponibilità e prenota l'appuntamento che preferisci. 
              Le visite di controllo durano 60 minuti, mentre la prima visita richiede 90 minuti 
              per una valutazione completa.
            </p>
          </div>
        </div>
      </section>

      {/* Navigazione paziente */}
      <div className="bg-cream-50 border-b border-sage-100">
        <div className="container-custom py-4">
          <PatientNavigation />
        </div>
      </div>

      {/* Calendar Section - Ridotto padding */}
      <section className="py-6 lg:py-8">
        <div className="container-custom">
          <AgendaCalendar />
        </div>
      </section>

      {/* Info Section */}
      <section className="section-sm bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Info Card 1 */}
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sage-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-sage-900 mb-2">Prima Visita</h3>
              <p className="text-sage-600 text-sm">
                90 minuti dedicati a una valutazione completa del tuo stato nutrizionale e definizione degli obiettivi.
              </p>
            </div>

            {/* Info Card 2 */}
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sage-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-sage-900 mb-2">Visite di Controllo</h3>
              <p className="text-sage-600 text-sm">
                60 minuti per monitorare i progressi e ottimizzare il tuo piano alimentare.
              </p>
            </div>

            {/* Info Card 3 */}
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sage-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-sage-900 mb-2">Preavviso Minimo</h3>
              <p className="text-sage-600 text-sm">
                Le prenotazioni devono essere effettuate con almeno 48 ore di anticipo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
