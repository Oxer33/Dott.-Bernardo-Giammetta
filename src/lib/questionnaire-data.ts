// =============================================================================
// QUESTIONARIO ALIMENTARE - DOTT. BERNARDO GIAMMETTA
// Domande per la prima visita nutrizionale
// Estratto dal progetto my-questionnaire
// =============================================================================

export interface Question {
  id: number;
  text: string;
  section: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox';
  options?: string[];
  required: boolean;
}

// =============================================================================
// SEZIONI DEL QUESTIONARIO
// =============================================================================

export const SECTIONS = [
  { id: 'generalita', name: 'Generalità e Contatti', range: [1, 4] },
  { id: 'stile-vita', name: 'Stile di Vita', range: [5, 10] },
  { id: 'cliniche', name: 'Informazioni Cliniche', range: [11, 16] },
  { id: 'obiettivo', name: 'Obiettivo Personale', range: [17, 17] },
  { id: 'stile-alimentare', name: 'Stile Alimentare', range: [18, 18] },
  { id: 'alimenti', name: 'Alimenti', range: [19, 19] },
  { id: 'abitudini', name: 'Abitudini Alimentari', range: [20, 22] },
  { id: 'colazione', name: 'Colazione', range: [23, 25] },
  { id: 'spuntini', name: 'Spuntini', range: [26, 26] },
  { id: 'pranzo', name: 'Pranzo', range: [27, 30] },
  { id: 'cena', name: 'Cena', range: [31, 31] },
  { id: 'alcol', name: 'Alcol e Pasto Libero', range: [32, 33] },
  { id: 'fatturazione', name: 'Dati Fatturazione', range: [34, 34] },
  { id: 'privacy', name: 'Privacy', range: [35, 35] },
];

// =============================================================================
// DOMANDE DEL QUESTIONARIO
// =============================================================================

export const QUESTIONS: Question[] = [
  // GENERALITÀ E CONTATTI (1-4)
  {
    id: 1,
    text: 'Scrivimi il tuo Nome e Cognome:',
    section: 'generalita',
    type: 'text',
    required: true,
  },
  {
    id: 2,
    text: 'Riportami la tua Data di Nascita. Scrivila nel formato giorno/mese/anno (es: 28/07/1986)',
    section: 'generalita',
    type: 'text',
    required: true,
  },
  {
    id: 3,
    text: 'Riportami il tuo indirizzo e-mail su cui inviarti tutto il materiale utile:',
    section: 'generalita',
    type: 'text',
    required: true,
  },
  {
    id: 4,
    text: 'Scrivimi il tuo Numero di Cellulare per tenerci sempre in contatto:',
    section: 'generalita',
    type: 'text',
    required: true,
  },

  // STILE DI VITA (5-10)
  {
    id: 5,
    text: 'Hai mai affrontato un percorso alimentare con il supporto di un professionista? Se sì, quante volte e con quale obiettivo?',
    section: 'stile-vita',
    type: 'textarea',
    required: true,
  },
  {
    id: 6,
    text: 'Svolgi una tipologia di lavoro sedentario oppure ti ritrovi a muoverti molto durante le ore lavorative settimanali?',
    section: 'stile-vita',
    type: 'textarea',
    required: true,
  },
  {
    id: 7,
    text: 'Nelle ore libere dopo il lavoro e nelle giornate di riposo dal lavoro tendi ad essere sedentario/a o cerchi di muoverti (per esempio passeggiare, uscire in bici, fare del trekking)?',
    section: 'stile-vita',
    type: 'textarea',
    required: true,
  },
  {
    id: 8,
    text: 'Svolgi un\'attività fisica programmata quindi un allenamento settimanale? Se la risposta è sì indicami: 1) la tipologia di attività svolta 2) quante sedute a settimana 3) la durata di ogni singola seduta 4) la fascia oraria 5) solo nel caso in cui fossi agonista specificami anche se sei in fase di carico, scarico o pre-competizione.',
    section: 'stile-vita',
    type: 'textarea',
    required: true,
  },
  {
    id: 9,
    text: 'Hai l\'abitudine di fumare? Se sì indicami quante sigarette al giorno:',
    section: 'stile-vita',
    type: 'textarea',
    required: true,
  },
  {
    id: 10,
    text: 'Riguardo al sonno, indicami: 1) Quante ore riesci a dormire continuativamente. In caso di risvegli notturni riportami la causa. 2) Quante ore dormi in totale (anche se discontinue). 3) Nel caso di un sonno cattivo per cause non esterne vorresti consigliata un\'integrazione utile per provare a migliorarlo? 4) In caso di sonno cattivo indicami anche se hai già provato degli integratori.',
    section: 'stile-vita',
    type: 'textarea',
    required: true,
  },

  // INFORMAZIONI CLINICHE (11-16)
  {
    id: 11,
    text: 'In caso di sesso maschile rispondi scrivendo soltanto "non applicabile". Riguardo al Ciclo: 1) Il ciclo è regolare senza pillola? Oppure siamo in Menopausa o Post-menopausa? 2) Il ciclo è molto doloroso o sopportabile o quasi asintomatico? 3) La settimana pre-ciclo e del ciclo è critica dal punto di vista delle tentazioni alimentari? 4) Nel caso di ciclo doloroso o molto stimolante la fame indicami se stai già assumendo qualche rimedio. 5) Nel caso in cui non stessi assumendo nulla per ridurre i fastidi, indicami se vorresti consigliato il protocollo di integrazione naturale.',
    section: 'cliniche',
    type: 'textarea',
    required: true,
  },
  {
    id: 12,
    text: 'Sono presenti condizioni patologiche diagnosticate da un Medico? Se sì allora riportamele di seguito:',
    section: 'cliniche',
    type: 'textarea',
    required: true,
  },
  {
    id: 13,
    text: 'Assumi farmaci? Se è sì indicami qui sotto il nome e la modalità di assunzione:',
    section: 'cliniche',
    type: 'textarea',
    required: true,
  },
  {
    id: 14,
    text: 'Assumi integratori? Se è sì indicami qui sotto il nome e la modalità di assunzione:',
    section: 'cliniche',
    type: 'textarea',
    required: true,
  },
  {
    id: 15,
    text: 'In merito ad allergie: 1) Sono presenti allergie ad alimenti o stagionali diagnosticate da un medico? 2) Sia nel caso in cui ci sia una diagnosi medica che nel caso in cui non ci sia una diagnosi medica (ma percepiamo fastidi o sintomi nell\'assunzione di particolari cibi) specifichiamole.',
    section: 'cliniche',
    type: 'textarea',
    required: true,
  },
  {
    id: 16,
    text: 'Riguardo alla regolarità intestinale, indicami: 1) Quante volte vai di corpo durante il giorno? Se non vai di corpo giornalmente allora indicami quante volte evacui settimanalmente. 2) Assumi integratori per favorire la regolarità? Nel caso non assumessi nulla e non andassi giornalmente di corpo specificami se vorresti consigliato un integratore naturale. 3) Se hai già provato degli integratori che però non hanno dato effetti positivi scrivimi i nomi.',
    section: 'cliniche',
    type: 'textarea',
    required: true,
  },

  // OBIETTIVO PERSONALE (17)
  {
    id: 17,
    text: 'Qual è il tuo obiettivo personale per cui vuoi iniziare questo percorso? Indicami se: 1) Vuoi ridurre il grasso corporeo, quindi il peso, migliorando l\'alimentazione? 2) Oppure aumentare il peso e anche la massa muscolare (valida solo se ci alleniamo) migliorando l\'alimentazione? 3) Oppure mantenere il peso migliorando solamente l\'alimentazione e anche lo stato di forma fisica (valido solo se ci alleniamo)?',
    section: 'obiettivo',
    type: 'textarea',
    required: true,
  },

  // STILE ALIMENTARE (18)
  {
    id: 18,
    text: 'Seleziona il tuo stile alimentare:',
    section: 'stile-alimentare',
    type: 'radio',
    options: [
      'Onnivoro (mangi qualsiasi pietanza di origine animale)',
      'Vegetariano (escludi carne e pesce ma consumi uova e latticini)',
      'Vegano (escludi tutti i prodotti di origine animale)',
    ],
    required: true,
  },

  // ALIMENTI (19)
  {
    id: 19,
    text: 'Indicami tra i cibi elencati di seguito se sono presenti alimenti che non consumi assolutamente e che quindi non verranno inseriti nel piano. Scrivi gli alimenti che non gradisci altrimenti, se gradisci tutto, scrivi "gradisco tutto".',
    section: 'alimenti',
    type: 'textarea',
    required: true,
  },

  // ABITUDINI ALIMENTARI (20-22)
  {
    id: 20,
    text: 'Quali pasti principali giornalieri (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana? Se consumi dei pasti fuori, indicami: 1) Quante volte a settimana? 2) Dove ti appoggi (Mensa, Bar, Gastronomia, Ristorante oppure se ti porti qualcosa da casa)? 3) Prenderesti in considerazione la possibilità di prepararli a casa e portarli con te? Oppure preferiresti ricevere degli orientamenti per la gestione del pasto fuori?',
    section: 'abitudini',
    type: 'textarea',
    required: true,
  },
  {
    id: 21,
    text: 'Quanti pasti fai abitualmente ogni giorno (es: solo 2 pasti principali, oppure 3 pasti principali, o 3 pasti principali e 1 o 2 o 3 spuntini)? Indicami anche: 1) Quali sono esattamente? 2) Nel caso in cui non ne facessi 5 (colazione, pranzo, cena + 2 spuntini), saresti disposto/a a farne almeno 5?',
    section: 'abitudini',
    type: 'textarea',
    required: true,
  },
  {
    id: 22,
    text: 'Riguardo alla tipologia di colazione: 1) Preferisci consumare una colazione dolce e una salata oppure solo opzioni dolci o solo salate? 2) Scrivimi, se esistono, anche eventuali necessità personali particolari per la colazione.',
    section: 'colazione',
    type: 'textarea',
    required: true,
  },

  // COLAZIONE (23-25)
  {
    id: 23,
    text: 'Scrivi 2 tipologie di colazioni che consumi più di frequente:',
    section: 'colazione',
    type: 'textarea',
    required: true,
  },
  {
    id: 24,
    text: 'In merito al caffè, se lo consumi, indicami: 1) Quanti caffè consumi durante la giornata? 2) Sono amari o dolcificati con zucchero o con dolcificanti acalorici? 3) Nel caso dolcificassi il caffè abitualmente con lo zucchero ma ti proponessi di utilizzare in alternativa dolcificanti acalorici naturali come la Stevia o l\'Eritritolo, potremmo inserirli?',
    section: 'colazione',
    type: 'textarea',
    required: true,
  },
  {
    id: 25,
    text: 'Consumi almeno 3 volte a settimana il pesce azzurro fresco? (Esempi: Suri, Sarde, Alici, Sgombro fresco, Pesce Spada, Lanzardo, Tonno fresco, Palamita, ecc.)',
    section: 'colazione',
    type: 'textarea',
    required: true,
  },

  // SPUNTINI (26)
  {
    id: 26,
    text: 'Se consumi spuntini durante il giorno allora indicami: 1) Cosa ti capita di consumare abitualmente? 2) Scrivimi, se esistono, anche eventuali necessità personali particolari per gli spuntini.',
    section: 'spuntini',
    type: 'textarea',
    required: true,
  },

  // PRANZO (27-30)
  {
    id: 27,
    text: 'Riguardo al pranzo: 1) Solitamente consumi un primo piatto (a base di pasta o riso) o un secondo piatto (pietanza) o fai entrambi nello stesso pasto? 2) Indicami anche se per te è molto importante chiudere il pranzo con la frutta fresca o se ne potresti fare anche a meno. 3) Scrivimi, se esistono, eventuali necessità personali particolari per il pranzo.',
    section: 'pranzo',
    type: 'textarea',
    required: true,
  },
  {
    id: 28,
    text: 'Indicami se per pranzo prenderesti in considerazione la possibilità di consumare un piatto unico (insalata di cereale o patate) composto da: 1) Cereale integrale in chicco o patate 2) Pietanza (es: Fiocchi di Latte, Petto di Pollo, Tonno, ecc.) 3) Verdura cotta o cruda.',
    section: 'pranzo',
    type: 'textarea',
    required: true,
  },
  {
    id: 29,
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di Legumi composto da: 1) Legumi da consumare in zuppa o asciutti o in vellutata 2) Pane tostato o derivato secco 3) Verdura cotta o cruda.',
    section: 'pranzo',
    type: 'textarea',
    required: true,
  },
  {
    id: 30,
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di Pasta, composto da: 1) Pasta di Semola o integrale 2) Un Condimento semplice 3) Eventuale Pietanza 4) Verdura cotta o cruda.',
    section: 'pranzo',
    type: 'textarea',
    required: true,
  },

  // CENA (31)
  {
    id: 31,
    text: 'Per la cena le indicazioni saranno di abbinare: 1) Una Pietanza (es: carne rossa, carne bianca, uova, formaggi, salumi magri, pesce) 2) Pane o patate o derivato secco 3) Verdura cruda o cotta 4) Frutta fresca a fine pasto. Riportami eventuali necessità personali particolari per questo pasto.',
    section: 'cena',
    type: 'textarea',
    required: true,
  },

  // ALCOL E PASTO LIBERO (32-33)
  {
    id: 32,
    text: 'Riguardo agli alcolici: 1) Bevi alcolici? 2) Se sì specificami se li bevi quotidianamente o solo il fine settimana. 3) Indicami la quantità consumata di vino (in bicchieri) o di birra o di drink. 4) Nel caso in cui il consumo di alcol sia quotidiano, specificami se potresti farne completamente a meno o se saresti disponibile a ridurlo.',
    section: 'alcol',
    type: 'textarea',
    required: true,
  },
  {
    id: 33,
    text: 'In questa prima fase il pasto libero sarà 1 a settimana all\'interno della giornata che più preferirai sfruttare per farlo. Al pasto libero si è "liberi" di consumare tutto ciò che desideriamo (pizza, sushi, carbonara, ecc.). Scrivimi, se esistono, eventuali necessità personali particolari per questo pasto altrimenti scrivi "ok".',
    section: 'alcol',
    type: 'textarea',
    required: true,
  },

  // DATI FATTURAZIONE (34)
  {
    id: 34,
    text: 'Riportami di seguito i dati utili all\'emissione della fattura: 1) Luogo di nascita 2) Via di residenza 3) Numero civico 4) CAP 5) Città 6) Codice fiscale.',
    section: 'fatturazione',
    type: 'textarea',
    required: true,
  },

  // PRIVACY (35)
  {
    id: 35,
    text: 'Con riferimento alla Legge 31/12/1996 "tutela delle persone e di altri soggetti al trattamento dei dati personali", il sottoscritto (ossia il richiedente la consulenza) spuntando la casella "Autorizzo" ed inviando il questionario esprime il proprio consenso ed autorizza il Dr. Bernardo Giammetta al trattamento dei dati personali limitatamente ai fini di dietoterapia.',
    section: 'privacy',
    type: 'checkbox',
    required: true,
  },
];

// =============================================================================
// FUNZIONI UTILITY
// =============================================================================

export function getQuestionsBySection(sectionId: string): Question[] {
  return QUESTIONS.filter(q => q.section === sectionId);
}

export function getSectionProgress(answers: Record<number, string>, sectionId: string): number {
  const sectionQuestions = getQuestionsBySection(sectionId);
  const answeredCount = sectionQuestions.filter(q => answers[q.id]?.trim()).length;
  return Math.round((answeredCount / sectionQuestions.length) * 100);
}

export function getTotalProgress(answers: Record<number, string>): number {
  const answeredCount = QUESTIONS.filter(q => answers[q.id]?.trim()).length;
  return Math.round((answeredCount / QUESTIONS.length) * 100);
}

export function isQuestionnaireComplete(answers: Record<number, string>): boolean {
  return QUESTIONS.every(q => {
    if (!q.required) return true;
    return answers[q.id]?.trim();
  });
}
