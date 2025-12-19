// =============================================================================
// PAGINA COOKIE POLICY - DOTT. BERNARDO GIAMMETTA
// Informativa sull'utilizzo dei cookie
// =============================================================================

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Dott. Bernardo Giammetta',
  description: 'Informativa sull\'utilizzo dei cookie sul nostro sito web',
};

export default function CookiePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-6">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600">
            Ultimo aggiornamento: Dicembre 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          
          <h2>Cosa sono i Cookie</h2>
          <p>
            I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo 
            quando visiti un sito web. Sono ampiamente utilizzati per far funzionare i siti 
            web in modo più efficiente e per fornire informazioni ai proprietari del sito.
          </p>

          <h2>Cookie Utilizzati</h2>
          
          <h3>Cookie Tecnici (Necessari)</h3>
          <p>
            Questi cookie sono essenziali per il funzionamento del sito e non possono essere 
            disattivati. Includono:
          </p>
          <ul>
            <li><strong>Cookie di sessione:</strong> per mantenere la sessione utente attiva</li>
            <li><strong>Cookie di autenticazione:</strong> per gestire l&apos;accesso all&apos;area riservata</li>
            <li><strong>Cookie di preferenze:</strong> per memorizzare le tue preferenze (es. tema)</li>
          </ul>

          <h3>Cookie Analitici</h3>
          <p>
            Utilizziamo Google Analytics per comprendere come i visitatori interagiscono con 
            il nostro sito. Questi cookie raccolgono informazioni in forma anonima, tra cui:
          </p>
          <ul>
            <li>Numero di visitatori</li>
            <li>Pagine visitate</li>
            <li>Tempo trascorso sul sito</li>
            <li>Provenienza dei visitatori</li>
          </ul>

          <h3>Cookie di Terze Parti</h3>
          <p>
            Il nostro sito può includere cookie di terze parti per:
          </p>
          <ul>
            <li><strong>Google OAuth:</strong> per l&apos;autenticazione tramite account Google</li>
            <li><strong>Google Maps:</strong> per visualizzare le mappe degli studi</li>
          </ul>

          <h2>Gestione dei Cookie</h2>
          <p>
            Puoi gestire le preferenze sui cookie in qualsiasi momento attraverso le 
            impostazioni del tuo browser. Ecco come fare nei principali browser:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
            <li><strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie</li>
            <li><strong>Safari:</strong> Preferenze → Privacy → Cookie</li>
            <li><strong>Edge:</strong> Impostazioni → Privacy → Cookie</li>
          </ul>

          <h2>Disabilitazione dei Cookie</h2>
          <p>
            Disabilitando i cookie, alcune funzionalità del sito potrebbero non essere 
            disponibili o funzionare correttamente. In particolare:
          </p>
          <ul>
            <li>Non sarà possibile effettuare l&apos;accesso all&apos;area riservata</li>
            <li>Le preferenze non verranno salvate</li>
            <li>Alcune funzionalità interattive potrebbero non funzionare</li>
          </ul>

          <h2>Maggiori Informazioni</h2>
          <p>
            Per ulteriori informazioni sui cookie e su come gestirli, visita{' '}
            <a 
              href="https://www.garanteprivacy.it/cookie" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-mint hover:underline"
            >
              il sito del Garante per la Protezione dei Dati Personali
            </a>.
          </p>

          <h2>Contatti</h2>
          <p>
            Per domande sulla nostra Cookie Policy, contattaci tramite la pagina{' '}
            <a href="/contatti" className="text-brand-mint hover:underline">Contatti</a>.
          </p>

        </div>
      </section>
    </main>
  );
}
