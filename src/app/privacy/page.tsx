// =============================================================================
// PAGINA PRIVACY POLICY - DOTT. BERNARDO GIAMMETTA
// Informativa sulla privacy e trattamento dati personali
// =============================================================================

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dott. Bernardo Giammetta',
  description: 'Informativa sulla privacy e trattamento dei dati personali',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Ultimo aggiornamento: Dicembre 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          
          <h2>1. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati personali è il Dott. Bernardo Giammetta, 
            Biologo Nutrizionista, con studi in:
          </p>
          <ul>
            <li>Via Daniele Manin 10, 40129 Bologna (BO)</li>
            <li>Via Eraclea 10, 90016 Erice (TP)</li>
          </ul>

          <h2>2. Tipologie di Dati Raccolti</h2>
          <p>
            I dati personali raccolti attraverso questo sito web includono:
          </p>
          <ul>
            <li><strong>Dati di navigazione:</strong> indirizzo IP, browser, sistema operativo</li>
            <li><strong>Dati forniti volontariamente:</strong> nome, email, telefono tramite form di contatto</li>
            <li><strong>Dati di autenticazione:</strong> informazioni Google OAuth per l&apos;accesso all&apos;area riservata</li>
            <li><strong>Dati sanitari:</strong> solo se forniti durante le consulenze nutrizionali</li>
          </ul>

          <h2>3. Finalità del Trattamento</h2>
          <p>I dati vengono trattati per:</p>
          <ul>
            <li>Gestione delle richieste di contatto</li>
            <li>Prenotazione e gestione degli appuntamenti</li>
            <li>Invio di comunicazioni relative ai servizi richiesti</li>
            <li>Adempimento di obblighi di legge</li>
          </ul>

          <h2>4. Base Giuridica</h2>
          <p>
            Il trattamento dei dati si basa sul consenso dell&apos;interessato e/o sulla 
            necessità di eseguire un contratto di cui l&apos;interessato è parte.
          </p>

          <h2>5. Conservazione dei Dati</h2>
          <p>
            I dati personali saranno conservati per il tempo necessario al conseguimento 
            delle finalità per le quali sono stati raccolti, e comunque non oltre i termini 
            previsti dalla normativa vigente.
          </p>

          <h2>6. Diritti dell&apos;Interessato</h2>
          <p>L&apos;interessato ha diritto di:</p>
          <ul>
            <li>Accedere ai propri dati personali</li>
            <li>Richiedere la rettifica o la cancellazione</li>
            <li>Richiedere la limitazione del trattamento</li>
            <li>Opporsi al trattamento</li>
            <li>Richiedere la portabilità dei dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
          </ul>

          <h2>7. Cookie</h2>
          <p>
            Questo sito utilizza cookie tecnici necessari al funzionamento e cookie 
            analitici per migliorare l&apos;esperienza utente. Per maggiori informazioni, 
            consultare la <a href="/cookie" className="text-brand-mint hover:underline">Cookie Policy</a>.
          </p>

          <h2>8. Contatti</h2>
          <p>
            Per esercitare i propri diritti o per qualsiasi domanda relativa al trattamento 
            dei dati personali, è possibile contattare il Titolare tramite la pagina{' '}
            <a href="/contatti" className="text-brand-mint hover:underline">Contatti</a>.
          </p>

        </div>
      </section>
    </main>
  );
}
