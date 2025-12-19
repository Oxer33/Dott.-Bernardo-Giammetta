// =============================================================================
// PAGINA AGENDA - DOTT. BERNARDO GIAMMETTA
// Visualizzazione pubblica dell'agenda con possibilità di prenotazione
// =============================================================================

import { Metadata } from 'next';
import { AgendaCalendar } from '@/components/agenda/AgendaCalendar';

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
// PAGE COMPONENT
// =============================================================================

export default function AgendaPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
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

      {/* Calendar Section */}
      <section className="section">
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
