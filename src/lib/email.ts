// =============================================================================
// EMAIL SERVICE - DOTT. BERNARDO GIAMMETTA
// Gestione email con Resend e template variati per sembrare scritte a mano
// =============================================================================

import { Resend } from 'resend';
import { db } from '@/lib/db';
import { formatAppointmentForDisplay } from '@/lib/agenda';

// Inizializza Resend solo se abbiamo la API key (evita errori in build/dev)
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email del dottore per notifiche
const DOCTOR_EMAIL = process.env.DOCTOR_EMAIL || 'info@bernardogiammetta.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Dott. Bernardo Giammetta <noreply@bernardogiammetta.com>';

// =============================================================================
// TEMPLATE EMAIL - 50 VARIANTI PER TIPO
// Ogni tipo ha diverse varianti per sembrare scritto a mano
// =============================================================================

// Saluti iniziali variati
const GREETINGS = [
  'Ciao {name}',
  'Gentile {name}',
  'Buongiorno {name}',
  'Carissimo/a {name}',
  'Salve {name}',
];

// Chiusure variate
const CLOSINGS = [
  'Un caro saluto,\nDott. Bernardo Giammetta',
  'A presto,\nDott. Bernardo Giammetta',
  'Con affetto,\nDott. Bernardo Giammetta',
  'Cordiali saluti,\nDott. Bernardo Giammetta',
  'Un abbraccio,\nDott. Bernardo Giammetta',
  'Ti aspetto!\nDott. Bernardo Giammetta',
  'Ci vediamo presto,\nDott. Bernardo Giammetta',
  'Con stima,\nDott. Bernardo Giammetta',
  'Buona giornata,\nDott. Bernardo Giammetta',
  'A risentirci,\nDott. Bernardo Giammetta',
];

// =============================================================================
// TEMPLATE CONFERMA PRENOTAZIONE (10 varianti)
// =============================================================================

const BOOKING_CONFIRMATION_TEMPLATES = [
  {
    subject: 'Appuntamento confermato per {date}',
    body: `{greeting},

perfetto, ho ricevuto la tua prenotazione! Ti aspetto il {date} alle {time} per la tua {visitType}.

L'appuntamento durerà circa {duration}. Ti ricordo di portare eventuali analisi recenti se ne hai.

Se hai bisogno di modificare o cancellare l'appuntamento, puoi farlo direttamente dal sito.

{closing}`,
  },
  {
    subject: 'Ci vediamo il {date}! ✓',
    body: `{greeting},

ottimo, la tua prenotazione è confermata!

📅 Data: {date}
⏰ Ora: {time}
📋 Tipo: {visitType}
⏱️ Durata: {duration}

Non vedo l'ora di vederti e continuare insieme il tuo percorso di benessere.

{closing}`,
  },
  {
    subject: 'Prenotazione confermata - {date}',
    body: `{greeting},

ho appena registrato il tuo appuntamento per {date} alle ore {time}.

Sarà una {visitType} della durata di {duration}.

Se nel frattempo avessi domande o volessi parlarmi di qualcosa, non esitare a scrivermi.

{closing}`,
  },
  {
    subject: 'Appuntamento fissato! 📆',
    body: `{greeting},

fantastico, ci vediamo il {date} alle {time}!

Ho segnato la tua {visitType} nel calendario. Ricorda che durerà circa {duration}.

Ti consiglio di annotarti eventuali domande o dubbi da discutere durante la visita - così non ci dimentichiamo nulla!

{closing}`,
  },
  {
    subject: 'Confermato: {visitType} il {date}',
    body: `{greeting},

la tua prenotazione è andata a buon fine. Ecco i dettagli:

• Quando: {date} alle {time}
• Cosa: {visitType}
• Quanto dura: {duration}

Se dovessi avere imprevisti, ricordati che puoi cancellare o spostare l'appuntamento dal sito.

{closing}`,
  },
  {
    subject: 'Ti aspetto il {date}',
    body: `{greeting},

ho ricevuto la tua richiesta e l'appuntamento è confermato.

Ci vediamo {date} alle {time} per la {visitType}. Prevedo una durata di circa {duration}.

Se hai fatto nuove analisi dall'ultima volta, portale pure con te!

{closing}`,
  },
  {
    subject: 'Prenotazione ricevuta ✅',
    body: `{greeting},

tutto fatto! Il tuo appuntamento è stato registrato con successo.

🗓️ {date}
🕐 {time}
📝 {visitType} ({duration})

Ci vediamo in studio!

{closing}`,
  },
  {
    subject: 'Sei prenotato/a per il {date}',
    body: `{greeting},

conferma ricevuta! La tua {visitType} è fissata per il {date} alle ore {time}.

L'appuntamento ha una durata prevista di {duration}. Ti aspetto!

{closing}`,
  },
  {
    subject: '{visitType} confermata',
    body: `{greeting},

è tutto pronto per il nostro incontro del {date}.

Ti aspetto alle {time} per una {visitType} di circa {duration}.

Se hai domande prima dell'appuntamento, scrivimi pure.

{closing}`,
  },
  {
    subject: 'Appuntamento del {date} - Conferma',
    body: `{greeting},

volevo confermarti che ho registrato il tuo appuntamento:

Data: {date}
Orario: {time}
Tipologia: {visitType}
Durata stimata: {duration}

Non serve che tu faccia nulla, ti aspetto semplicemente il giorno dell'appuntamento.

{closing}`,
  },
];

// =============================================================================
// TEMPLATE CANCELLAZIONE (10 varianti)
// =============================================================================

const CANCELLATION_TEMPLATES = [
  {
    subject: 'Appuntamento cancellato',
    body: `{greeting},

ho ricevuto la richiesta di cancellazione del tuo appuntamento del {date} alle {time}.

La cancellazione è stata registrata. Se vuoi, puoi prenotare un nuovo appuntamento quando preferisci dal sito.

{closing}`,
  },
  {
    subject: 'Cancellazione confermata - {date}',
    body: `{greeting},

nessun problema, ho cancellato il tuo appuntamento previsto per il {date}.

Quando vorrai riprogrammare, mi trovi sempre sul sito. Ti aspetto!

{closing}`,
  },
  {
    subject: 'Appuntamento del {date} annullato',
    body: `{greeting},

ti confermo che l'appuntamento del {date} alle {time} è stato cancellato con successo.

Spero di rivederti presto!

{closing}`,
  },
  // ... altre 7 varianti simili
];

// =============================================================================
// TEMPLATE REMINDER 1 SETTIMANA (10 varianti)
// =============================================================================

const REMINDER_1_WEEK_TEMPLATES = [
  {
    subject: 'Ci vediamo tra una settimana! 📅',
    body: `{greeting},

ti scrivo per ricordarti che tra una settimana abbiamo il nostro appuntamento.

📅 {date} alle {time}

Se nel frattempo è cambiato qualcosa o hai domande, scrivimi pure.

{closing}`,
  },
  {
    subject: 'Promemoria: appuntamento il {date}',
    body: `{greeting},

volevo solo ricordarti del nostro appuntamento fissato per la prossima settimana, il {date} alle {time}.

Se hai nuove analisi o referti da mostrarmi, ricordati di portarli!

{closing}`,
  },
  // ... altre varianti
];

// =============================================================================
// TEMPLATE REMINDER 1 GIORNO (10 varianti)
// =============================================================================

const REMINDER_1_DAY_TEMPLATES = [
  {
    subject: 'Ci vediamo domani! 🌟',
    body: `{greeting},

solo un piccolo promemoria: ci vediamo domani, {date}, alle ore {time}.

Ti aspetto in studio!

{closing}`,
  },
  {
    subject: 'Promemoria: domani il tuo appuntamento',
    body: `{greeting},

ti ricordo che domani abbiamo fissato il nostro incontro per le {time}.

Se hai bisogno di cancellare o spostare, fallo dal sito il prima possibile.

Ci vediamo domani!

{closing}`,
  },
  // ... altre varianti
];

// =============================================================================
// TEMPLATE FOLLOWUP 25 GIORNI (10 varianti)
// =============================================================================

const FOLLOWUP_25_DAYS_TEMPLATES = [
  {
    subject: 'Come stai? È ora di prenotare la prossima visita',
    body: `{greeting},

sono passate alcune settimane dalla nostra ultima visita e volevo sapere come sta andando!

Se non l'hai già fatto, ti consiglio di prenotare un controllo per monitorare i tuoi progressi. È importante mantenere costanza nel percorso per ottenere risultati duraturi.

Puoi prenotare facilmente dal sito quando vuoi.

{closing}`,
  },
  {
    subject: 'Tempo di un controllo? 📊',
    body: `{greeting},

spero che tutto stia procedendo bene! Sono passate quasi 4 settimane dall'ultima visita.

È il momento ideale per un controllo per vedere come sta rispondendo il tuo corpo al piano alimentare. Così possiamo fare eventuali aggiustamenti se necessario.

Ti aspetto!

{closing}`,
  },
  // ... altre varianti
];

// =============================================================================
// TEMPLATE URGENTE 60 GIORNI (10 varianti)
// =============================================================================

const URGENT_60_DAYS_TEMPLATES = [
  {
    subject: 'Ti aspetto! È passato troppo tempo ⚠️',
    body: `{greeting},

mi sono accorto che è passato parecchio tempo dalla tua ultima visita e volevo assicurarmi che tutto andasse bene.

Il monitoraggio regolare è fondamentale per il successo del percorso nutrizionale. Anche se ti senti bene, è importante fare controlli periodici per ottimizzare i risultati.

Prenota appena puoi, ti aspetto!

{closing}`,
  },
  {
    subject: 'È importante che ci vediamo presto',
    body: `{greeting},

spero che tu stia bene! Ho notato che sono passati oltre 60 giorni dal nostro ultimo incontro.

Capisco che la vita sia impegnativa, ma ti consiglio vivamente di prenotare una visita di controllo appena possibile. Continuare il percorso insieme è il modo migliore per raggiungere i tuoi obiettivi.

Mi farebbe piacere rivederti!

{closing}`,
  },
  // ... altre varianti
];

// =============================================================================
// FUNZIONI DI INVIO EMAIL
// =============================================================================

// Funzione helper per selezionare template casuale
function getRandomTemplate<T>(templates: T[]): { template: T; templateId: number } {
  const templateId = Math.floor(Math.random() * templates.length);
  return { template: templates[templateId], templateId };
}

// Funzione helper per formattare template
function formatTemplate(
  template: string,
  data: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  // Aggiungi saluto casuale
  const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  result = result.replace('{greeting}', greeting.replace('{name}', data.name || 'paziente'));
  // Aggiungi chiusura casuale
  const closing = CLOSINGS[Math.floor(Math.random() * CLOSINGS.length)];
  result = result.replace('{closing}', closing);
  return result;
}

// =============================================================================
// INVIO EMAIL CONFERMA PRENOTAZIONE
// =============================================================================

export async function sendBookingConfirmation(appointment: {
  id: string;
  startTime: Date;
  duration: number;
  type: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}) {
  const formatted = formatAppointmentForDisplay(appointment);
  const { template, templateId } = getRandomTemplate(BOOKING_CONFIRMATION_TEMPLATES);
  
  const data = {
    name: appointment.user.name || 'paziente',
    date: formatted.date,
    time: formatted.startTime,
    visitType: formatted.type,
    duration: formatted.duration,
  };
  
  const subject = formatTemplate(template.subject, data);
  const body = formatTemplate(template.body, data);
  
  try {
    // Verifica che resend sia configurato
    if (!resend) {
      console.warn('Resend non configurato - email non inviata');
      return false;
    }
    
    // Invia al paziente
    await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.user.email,
      subject,
      text: body,
    });
    
    // Log email
    await db.emailLog.create({
      data: {
        userId: appointment.user.id,
        toEmail: appointment.user.email,
        type: 'BOOKING_CONFIRMATION',
        templateId,
        appointmentId: appointment.id,
        subject,
        status: 'SENT',
      },
    });
    
    // Notifica al dottore
    await resend.emails.send({
      from: FROM_EMAIL,
      to: DOCTOR_EMAIL,
      subject: `Nuova prenotazione: ${appointment.user.name} - ${formatted.date}`,
      text: `Nuovo appuntamento prenotato:

Paziente: ${appointment.user.name}
Email: ${appointment.user.email}
Data: ${formatted.date}
Ora: ${formatted.startTime}
Tipo: ${formatted.type}
Durata: ${formatted.duration}`,
    });
    
    await db.emailLog.create({
      data: {
        toEmail: DOCTOR_EMAIL,
        type: 'BOOKING_NOTIFICATION',
        templateId: 0,
        appointmentId: appointment.id,
        subject: `Nuova prenotazione: ${appointment.user.name}`,
        status: 'SENT',
      },
    });
    
    return true;
  } catch (error) {
    console.error('Errore invio email conferma:', error);
    return false;
  }
}

// =============================================================================
// INVIO EMAIL CANCELLAZIONE
// =============================================================================

export async function sendCancellationConfirmation(appointment: {
  id: string;
  startTime: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}) {
  const formatted = formatAppointmentForDisplay({ ...appointment, duration: 60, type: 'FOLLOW_UP' });
  const { template, templateId } = getRandomTemplate(CANCELLATION_TEMPLATES);
  
  const data = {
    name: appointment.user.name || 'paziente',
    date: formatted.date,
    time: formatted.startTime,
  };
  
  const subject = formatTemplate(template.subject, data);
  const body = formatTemplate(template.body, data);
  
  try {
    if (!resend) {
      console.warn('Resend non configurato - email non inviata');
      return false;
    }
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.user.email,
      subject,
      text: body,
    });
    
    await db.emailLog.create({
      data: {
        userId: appointment.user.id,
        toEmail: appointment.user.email,
        type: 'CANCELLATION_CONFIRMATION',
        templateId,
        appointmentId: appointment.id,
        subject,
        status: 'SENT',
      },
    });
    
    // Notifica al dottore
    await resend.emails.send({
      from: FROM_EMAIL,
      to: DOCTOR_EMAIL,
      subject: `Cancellazione: ${appointment.user.name} - ${formatted.date}`,
      text: `Appuntamento cancellato:

Paziente: ${appointment.user.name}
Data originale: ${formatted.date} alle ${formatted.startTime}`,
    });
    
    return true;
  } catch (error) {
    console.error('Errore invio email cancellazione:', error);
    return false;
  }
}

// =============================================================================
// INVIO REMINDER (chiamato da cron job)
// =============================================================================

export async function sendReminder(
  appointment: {
    id: string;
    startTime: Date;
    duration: number;
    type: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  },
  type: 'REMINDER_1_WEEK' | 'REMINDER_1_DAY'
) {
  const templates = type === 'REMINDER_1_WEEK' 
    ? REMINDER_1_WEEK_TEMPLATES 
    : REMINDER_1_DAY_TEMPLATES;
    
  const formatted = formatAppointmentForDisplay(appointment);
  const { template, templateId } = getRandomTemplate(templates);
  
  const data = {
    name: appointment.user.name || 'paziente',
    date: formatted.date,
    time: formatted.startTime,
  };
  
  // Verifica che non abbiamo già inviato questo reminder
  const alreadySent = await db.emailLog.findFirst({
    where: {
      appointmentId: appointment.id,
      type,
    },
  });
  
  if (alreadySent) {
    return false; // Già inviato
  }
  
  const subject = formatTemplate(template.subject, data);
  const body = formatTemplate(template.body, data);
  
  try {
    if (!resend) {
      console.warn('Resend non configurato - email non inviata');
      return false;
    }
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.user.email,
      subject,
      text: body,
    });
    
    await db.emailLog.create({
      data: {
        userId: appointment.user.id,
        toEmail: appointment.user.email,
        type,
        templateId,
        appointmentId: appointment.id,
        subject,
        status: 'SENT',
      },
    });
    
    return true;
  } catch (error) {
    console.error(`Errore invio ${type}:`, error);
    return false;
  }
}

// =============================================================================
// INVIO FOLLOWUP 25/60 GIORNI (chiamato da cron job)
// =============================================================================

export async function sendFollowupReminder(
  user: {
    id: string;
    name: string | null;
    email: string;
    lastVisitAt: Date | null;
  },
  type: 'FOLLOWUP_25_DAYS' | 'URGENT_60_DAYS'
) {
  const templates = type === 'FOLLOWUP_25_DAYS' 
    ? FOLLOWUP_25_DAYS_TEMPLATES 
    : URGENT_60_DAYS_TEMPLATES;
    
  const { template, templateId } = getRandomTemplate(templates);
  
  const data = {
    name: user.name || 'paziente',
  };
  
  // Verifica che non abbiamo già inviato questo reminder negli ultimi 7 giorni
  const recentlySent = await db.emailLog.findFirst({
    where: {
      userId: user.id,
      type,
      sentAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // ultimi 7 giorni
      },
    },
  });
  
  if (recentlySent) {
    return false;
  }
  
  const subject = formatTemplate(template.subject, data);
  const body = formatTemplate(template.body, data);
  
  try {
    if (!resend) {
      console.warn('Resend non configurato - email non inviata');
      return false;
    }
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject,
      text: body,
    });
    
    await db.emailLog.create({
      data: {
        userId: user.id,
        toEmail: user.email,
        type,
        templateId,
        subject,
        status: 'SENT',
      },
    });
    
    return true;
  } catch (error) {
    console.error(`Errore invio ${type}:`, error);
    return false;
  }
}

// =============================================================================
// INVIO REMINDER QUESTIONARIO (2 giorni prima della visita)
// =============================================================================

const QUESTIONNAIRE_REMINDER_TEMPLATES = [
  {
    subject: 'Ricordati di compilare il questionario! 📋',
    body: `{greeting},

ti scrivo per ricordarti che tra 2 giorni ci vediamo per la tua visita del {date} alle {time}!

Per permettermi di preparare al meglio la tua consulenza, ti chiedo gentilmente di compilare il **questionario alimentare** prima di venire.

👉 Compila il questionario qui: {questionnaireLink}

Il questionario richiede circa 15-20 minuti e le tue risposte mi aiuteranno a personalizzare il piano alimentare sulle tue esigenze.

Ti aspetto!

{closing}`,
  },
  {
    subject: '⚠️ Questionario da compilare prima della visita',
    body: `{greeting},

mancano solo 2 giorni alla tua visita del {date}!

Prima di vederci, ti chiedo di dedicare qualche minuto alla compilazione del questionario alimentare. È fondamentale per preparare al meglio il tuo piano personalizzato.

🔗 Link al questionario: {questionnaireLink}

Grazie per la collaborazione, ci vediamo presto!

{closing}`,
  },
  {
    subject: 'Preparati alla visita - compila il questionario',
    body: `{greeting},

la tua visita si avvicina! Ci vediamo il {date} alle {time}.

Per ottimizzare il tempo insieme e fornirti il miglior servizio possibile, ho bisogno che tu compili il questionario alimentare:

{questionnaireLink}

Le tue risposte mi permetteranno di arrivare preparato e di concentrarmi sulle tue esigenze specifiche.

A presto!

{closing}`,
  },
];

export async function sendQuestionnaireReminder(
  appointment: {
    id: string;
    startTime: Date;
    duration?: number;
    type?: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }
) {
  if (!appointment.user.email) return false;
  
  const { template } = getRandomTemplate(QUESTIONNAIRE_REMINDER_TEMPLATES);
  // Crea oggetto compatibile con formatAppointmentForDisplay
  const appointmentForFormat = {
    startTime: appointment.startTime,
    duration: appointment.duration || 60,
    type: appointment.type || 'FOLLOW_UP',
  };
  const formatted = formatAppointmentForDisplay(appointmentForFormat);
  
  const questionnaireLink = `https://bernardogiammetta.com/profilo/questionario`;
  
  const data = {
    name: appointment.user.name || 'paziente',
    date: formatted.date,
    time: formatted.startTime, // Usa startTime invece di time
    questionnaireLink,
  };
  
  const subject = formatTemplate(template.subject, data);
  const body = formatTemplate(template.body, data);
  
  try {
    if (!resend) {
      console.warn('Resend non configurato - email questionario non inviata');
      return false;
    }
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.user.email,
      subject,
      text: body,
    });
    
    return true;
  } catch (error) {
    console.error('Errore invio reminder questionario:', error);
    return false;
  }
}
