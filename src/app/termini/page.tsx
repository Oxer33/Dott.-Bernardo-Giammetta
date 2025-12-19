// =============================================================================
// PAGINA TERMINI E CONDIZIONI - DOTT. BERNARDO GIAMMETTA
// Termini di utilizzo del sito web e dei servizi
// =============================================================================

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termini e Condizioni | Dott. Bernardo Giammetta',
  description: 'Termini e condizioni di utilizzo del sito web e dei servizi',
};

export default function TerminiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-light to-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-6">
            Termini e Condizioni
          </h1>
          <p className="text-lg text-gray-600">
            Ultimo aggiornamento: Dicembre 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          
          <h2>1. Accettazione dei Termini</h2>
          <p>
            Utilizzando questo sito web, accetti di essere vincolato dai presenti Termini 
            e Condizioni. Se non accetti questi termini, ti preghiamo di non utilizzare il sito.
          </p>

          <h2>2. Descrizione del Servizio</h2>
          <p>
            Il Dott. Bernardo Giammetta offre servizi di consulenza nutrizionale come 
            Biologo Nutrizionista regolarmente iscritto all&apos;Albo. Il sito web fornisce:
          </p>
          <ul>
            <li>Informazioni sui servizi offerti</li>
            <li>Sistema di prenotazione appuntamenti online</li>
            <li>Contenuti informativi sulla nutrizione</li>
            <li>Assistente virtuale (NutriBot) per informazioni generali</li>
          </ul>

          <h2>3. Prenotazioni e Appuntamenti</h2>
          <p>
            Le prenotazioni effettuate tramite il sito sono soggette a conferma. 
            Il paziente si impegna a:
          </p>
          <ul>
            <li>Fornire dati veritieri e accurati</li>
            <li>Presentarsi puntualmente agli appuntamenti</li>
            <li>Comunicare eventuali disdette con almeno 24 ore di anticipo</li>
            <li>Rispettare le indicazioni fornite dal professionista</li>
          </ul>

          <h2>4. Limitazioni di Responsabilità</h2>
          <p>
            Le informazioni presenti sul sito hanno carattere puramente informativo e 
            non sostituiscono in alcun modo il parere medico professionale. In particolare:
          </p>
          <ul>
            <li>I contenuti del blog non costituiscono consulenza medica</li>
            <li>NutriBot fornisce informazioni generali e non personalizzate</li>
            <li>Ogni piano alimentare deve essere valutato individualmente</li>
          </ul>

          <h2>5. Proprietà Intellettuale</h2>
          <p>
            Tutti i contenuti del sito (testi, immagini, loghi, grafica) sono di proprietà 
            del Dott. Bernardo Giammetta o dei rispettivi titolari e sono protetti dalle 
            leggi sul diritto d&apos;autore. È vietata la riproduzione senza autorizzazione.
          </p>

          <h2>6. Privacy</h2>
          <p>
            Il trattamento dei dati personali è regolato dalla nostra{' '}
            <a href="/privacy" className="text-brand-mint hover:underline">Privacy Policy</a>.
            Utilizzando il sito, acconsenti al trattamento dei tuoi dati come descritto.
          </p>

          <h2>7. Utilizzo dell&apos;Area Riservata</h2>
          <p>
            L&apos;accesso all&apos;area riservata è consentito solo agli utenti registrati. 
            L&apos;utente si impegna a:
          </p>
          <ul>
            <li>Mantenere riservate le proprie credenziali di accesso</li>
            <li>Non condividere l&apos;accesso con terzi</li>
            <li>Notificare immediatamente eventuali accessi non autorizzati</li>
          </ul>

          <h2>8. Modifiche ai Termini</h2>
          <p>
            Il Titolare si riserva il diritto di modificare questi Termini in qualsiasi 
            momento. Le modifiche saranno effettive dalla data di pubblicazione sul sito.
          </p>

          <h2>9. Legge Applicabile</h2>
          <p>
            I presenti Termini sono regolati dalla legge italiana. Per qualsiasi 
            controversia sarà competente il Foro di Bologna.
          </p>

          <h2>10. Contatti</h2>
          <p>
            Per domande sui presenti Termini e Condizioni, contattaci tramite la pagina{' '}
            <a href="/contatti" className="text-brand-mint hover:underline">Contatti</a>.
          </p>

        </div>
      </section>
    </main>
  );
}
