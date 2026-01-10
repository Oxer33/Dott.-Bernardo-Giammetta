// =============================================================================
// CONFIGURAZIONE QUESTIONARIO PRIMA VISITA
// Definizione di tutte le domande divise per sezione
// =============================================================================

// Tipo per le domande
export interface Question {
  id: string;
  text: string;          // Testo domanda (supporta **grassetto** che verrà convertito)
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'textarea-with-radio' | 'radio-with-textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  hint?: string;         // Esempi o suggerimenti sotto la domanda
  // Nuovi campi per domande con radio Si/No + textarea condizionale
  radioOptions?: string[]; // Opzioni radio (es: ['Sì', 'No'])
  conditionalOnRadio?: string; // Mostra textarea solo se radio = questo valore
  // Per domande con elenco puntato da mostrare FUORI dalla textarea
  bulletPoints?: string[]; // Punti da mostrare come lista sopra la textarea (supporta **grassetto**)
}

// Helper per convertire **testo** in <strong>testo</strong>
export function formatBoldText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// =============================================================================
// DOMANDE COMUNI A TUTTI (5-17)
// Le domande 1-4 (email, nome, data nascita, telefono) sono precompilate dal profilo
// =============================================================================

export const COMMON_QUESTIONS: Question[] = [
  {
    id: 'q5',
    text: 'Hai mai affrontato un **percorso alimentare** con il supporto di un professionista? Se si allora quante volte e con quale obiettivo?',
    type: 'textarea-with-radio',
    required: true,
    radioOptions: ['Sì', 'No'],
    conditionalOnRadio: 'Sì',
    placeholder: 'Scrivi qui quante volte e con quale obiettivo',
  },
  {
    id: 'q6',
    text: 'Svolgi una tipologia di **lavoro sedentario** oppure ti ritrovi a muoverti molto durante le ore lavorative settimanali?',
    type: 'textarea',
    required: true,
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q7',
    text: 'Nelle ore libere dopo il lavoro e nelle giornate di riposo dal lavoro tendi ad essere **sedentario/a** o cerchi di muoverti (per esempio passeggiare, uscire in bici, fare del trekking)?',
    type: 'textarea',
    required: true,
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q8',
    text: 'Svolgi un\'**attività fisica programmata** quindi un **allenamento settimanale**? Se la risposta è si allora indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      '**tipologia** di attività svolta (per esempio sala pesi, crossfit, nuoto, pilates, yoga, atletica leggera, ect ect...)',
      '**quante sedute** svolgi a settimana',
      '**durata** di ogni singola seduta',
      '**fascia oraria**',
      'solo nel caso in cui fossi agonista specificami anche se sei in **fase di carico, scarico o pre-competizione**'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q9',
    text: 'Hai l\'abitudine di **fumare**? Se si indicami quante sigarette al giorno:',
    type: 'textarea-with-radio',
    required: true,
    radioOptions: ['Sì', 'No'],
    conditionalOnRadio: 'Sì',
    placeholder: 'Scrivi il numero di sigarette al giorno indicativo',
  },
  {
    id: 'q10',
    text: 'Riguardo al **sonno**, indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante ore riesci a **dormire continuativamente**. In caso di risvegli notturni riportami la causa.',
      'Quante ore dormi **in totale** (anche se discontinue).',
      'Nel caso di un **sonno cattivo** per cause non esterne, vorresti consigliata un\'**integrazione** utile per provare a migliorarlo?',
      'In caso di sonno cattivo indicami anche **se hai già provato degli integratori** (scrivimi i nomi se li ricordi) che però non hanno dato effetti positivi.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q11',
    text: 'In caso di sesso maschile rispondi scrivendo soltanto \'y\'. Riguardo al **Ciclo**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Il ciclo è regolare senza **pillola**? Oppure siamo in Menopausa o Post menopausa?',
      'Il ciclo è molto **doloroso** o sopportabile o quasi asintomatico?',
      'La settimana pre-ciclo e del ciclo è critica dal punto di vista delle **tentazioni alimentari**?',
      'Nel caso di ciclo doloroso o molto stimolante la fame indicami **se stai già assumendo qualche rimedio** farmacologico o da integratore? Se è si scrivimi i nomi dei prodotti assunti e le modalità di assunzione.',
      'Nel caso in cui non stessi assumendo nulla per ridurre i fastidi, indicami se vorresti **consigliato il protocollo di integrazione** naturale utile a renderlo più sopportabile?'
    ],
    placeholder: 'Scrivi qui oppure "y" se maschio',
  },
  {
    id: 'q12',
    text: 'Sono presenti **condizioni patologiche** diagnosticate da un Medico? Se si allora riportamele di seguito:',
    type: 'textarea',
    required: true,
    placeholder: 'Elenca eventuali patologie diagnosticate o scrivi "Nessuna"',
  },
  {
    id: 'q13',
    text: '**Assumi farmaci**? Se è si indicami qui sotto il nome e la modalità di assunzione:',
    type: 'textarea',
    required: true,
    placeholder: 'Nome farmaco e come/quando lo assumi, oppure "Nessuno"',
  },
  {
    id: 'q14',
    text: '**Assumi integratori**? Se è si indicami qui sotto il nome e la modalità di assunzione:',
    type: 'textarea',
    required: true,
    placeholder: 'Nome integratore e come/quando lo assumi, oppure "Nessuno"',
  },
  {
    id: 'q15',
    text: 'In merito ad **allergie**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Sono presenti **allergie ad alimenti o stagionali** diagnosticate da un medico?',
      'Sia nel caso in cui ci sia una diagnosi medica che **nel caso in cui non ci sia una diagnosi medica** (ma percepiamo fastidi o sintomi nell\'assunzione di particolari cibi) specifichiamole.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q16',
    text: 'Riguardo alla **regolarità intestinale**, indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte **vai di corpo** durante il giorno? Se non vai di corpo giornalmente allora indicami quante volte evacui settimanalmente.',
      'Assumi **integratori** (scrivi i nomi) per favorire la regolarità? Nel caso non assumessi nulla e non andassi giornalmente di corpo specificami se vorresti consigliato un integratore naturale utile a questo scopo.',
      'Se hai già provato degli **integratori che però non hanno dato effetti positivi** nel regolarizzarti allora scrivimi i nomi.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q17',
    text: 'Qual è il tuo **obiettivo personale** per cui vuoi iniziare questo percorso? Indicami se:',
    type: 'radio-with-textarea',
    required: true,
    options: [
      'Vuoi **ridurre** il grasso corporeo, quindi il peso, migliorando l\'alimentazione?',
      'Oppure **aumentare** il peso e anche la massa muscolare (valida solo se ci alleniamo) migliorando l\'alimentazione?',
      'Oppure **mantenere** il peso migliorando solamente l\'alimentazione e anche lo stato di forma fisica (valido solo se ci alleniamo)?'
    ],
    placeholder: 'Note aggiuntive (opzionale)',
  },
];

// =============================================================================
// DOMANDA 18 - STILE ALIMENTARE (determina quali domande successive mostrare)
// =============================================================================

export const DIET_TYPE_QUESTION: Question = {
  id: 'q18',
  text: 'Seleziona il tuo stile alimentare:',
  type: 'radio',
  required: true,
  options: [
    'ONNIVORO (mangi qualsiasi pietanza di origine animale oppure escludi solo carne o pesce o formaggi)',
    'VEGETARIANO (escludi carne e pesce ma includi latte, derivati e uova)',
    'VEGANO (escludi qualsiasi pietanza di origine animale)',
  ],
};

// =============================================================================
// DOMANDE PER ONNIVORI (19-44)
// =============================================================================

export const OMNIVORE_QUESTIONS: Question[] = [
  {
    id: 'q19',
    text: 'Indicami tra i **LEGUMI** elencati di seguito se sono presenti legumi che **non consumi assolutamente** e che quindi non vuoi vengano inseriti nel piano. Scrivi soltanto i legumi che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Legumi**: Ceci, Fagioli, Piselli, Lenticchie.',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q20',
    text: 'Indicami tra le **CARNI ROSSE** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Carne rossa**: manzo, vitello, maiale sia in versione fettina/bistecca che in versione hamburger.',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q21',
    text: 'Indicami tra le **CARNI BIANCHE** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Carne bianca**: pollo o tacchino sia in versione fettina/bistecca che in versione hamburger.',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q22',
    text: 'Indicami per le **UOVA** se sono presenti versioni che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le versioni che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Uova**: sia in versione intera che soli albumi (in brick o tetrapack).',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q23',
    text: 'Indicami tra le diverse tipologie di **PESCE** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Pesce**: sia **con lisca** (es: Merluzzo, Nasello, Persico, Platessa, Sogliola, Orata, Pesce Spada, Tonno fresco, Branzino, Salmone, Sarde, Alici, Sgombro), sia **molluschi** (es: Calamari, Polpo, Seppia, Totani) che **crostacei** (es: Gamberi).',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q24',
    text: 'Indicami tra le diverse tipologie di **FORMAGGIO** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Formaggi**: sia **freschi** nella versione light (es: Mozzarella, Stracchino, Ricotta, Feta, Fiocchi di Latte, Philadelphia) che **stagionati** (es: Parmigiano, Grana, Asiago, Emmenthal, Pecorino). Se non vuoi assolutamente assumere la versione light dei formaggi freschi specificalo. Prenderemo in considerazione anche la versione senza lattosio solo se è necessario.',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q25',
    text: 'Indicami tra le diverse tipologie di **SALUMI MAGRI** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Salumi magri**: Bresaola, Fesa di Pollo o Tacchino arrosto, Prosciutto Crudo sgrassato. Riportami eventuali salumi non presenti tra i precedenti di cui non puoi fare assolutamente a meno.',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q26',
    text: 'Riguardo ai **CONDIMENTI** di base sarà inserito l\'olio extravergine d\'oliva. Specificami se potrebbe interessarti in alternativa anche l\'avocado scrivendo \'si avocado\' oppure \'no avocado\'.',
    type: 'radio',
    required: true,
    options: ['Sì avocado', 'No avocado'],
  },
  {
    id: 'q27',
    text: 'Indicami tra le diverse tipologie di **VERDURA** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Verdure**: **cotte** (es: Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini) o **crude** (es: Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli).',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q28',
    text: 'Indicami tra le diverse tipologie di **CARBOIDRATO** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Fonti di carboidrati**: pasta, cereale in chicco (es: riso o farro o simili), patate, pane, derivato secco del pane (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut o Riso o Mais, se è necessario utilizzeremo derivati secchi simili ma senza glutine).',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q29',
    text: 'Consumi almeno 3 volte a settimana il **pesce azzurro fresco**?',
    type: 'radio',
    required: true,
    options: ['Sì', 'No'],
    hint: 'Esempi di pesce azzurro sono: Suri, Sarde, Alici, Sgombro fresco, Pesce Spada, Lanzardo, Tonno fresco, Palamita, Lampuga, Ricciola, Sugarello, Alaccia, Aguglia, Aringa, Tonno Alletterato, Pesce Sciabola, Costardella, Spratto.',
  },
  {
    id: 'q30',
    text: 'Quali pasti principali (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana?',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte a settimana fuori?',
      'Dove (Mensa, Bar, Gastronomia, Ristorante, porti da casa)?',
      'Considereresti portarli da casa o preferisci orientamenti per gestione fuori?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q31',
    text: 'Quanti pasti fai abitualmente ogni giorno?',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quali esattamente (colazione, pranzo, cena, spuntini...)?',
      'Se non fai 5 pasti (colazione, pranzo, cena + 2 spuntini), saresti disposto/a a farne almeno 5?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q32',
    text: 'Riguardo alla tipologia di colazione:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Preferisci dolce, salata o entrambe?',
      'Necessità particolari (alimento che non può mancare, abbinamento indispensabile...)?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q33',
    text: 'Scrivi 2 tipologie di colazioni che consumi più di frequente:',
    type: 'textarea',
    required: true,
    placeholder: 'Es: "Latte e biscotti" e "Yogurt con frutta"',
  },
  {
    id: 'q34',
    text: 'In merito al caffè (se non lo consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quanti caffè al giorno?',
      'Amari o dolcificati (zucchero/Stevia/Eritritolo)?',
      'Considereresti dolcificanti acalorici naturali?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q35',
    text: 'Se consumi spuntini durante il giorno (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Cosa consumi abitualmente?',
      'Necessità particolari (alimento indispensabile, spuntini pratici fuori casa...)?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q36',
    text: 'Riguardo al pranzo:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Consumi primo (pasta/riso) o secondo (pietanza) o entrambi?',
      'È importante chiudere con frutta fresca?',
      'Necessità particolari?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q37',
    text: 'Prenderesti in considerazione un PIATTO UNICO per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Cereale integrale (Riso...) o patate + 2) Pietanza (Fiocchi di Latte, Feta Light, Pollo, Piselli, Uova, Tonno, Merluzzo, Salmone...) + 3) Verdura cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q38',
    text: 'Prenderesti in considerazione un pasto a base di LEGUMI per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Legumi (zuppa, asciutti, vellutata) + 2) Pane tostato o derivato secco + 3) Verdura cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q39',
    text: 'Prenderesti in considerazione un pasto a base di PASTA per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Pasta (semola o integrale, anche 100% legumi) + 2) Condimento semplice (pomodoro, pesto, verdure) + 3) Eventuale pietanza + 4) Verdura',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze/necessità sulla pasta',
  },
  {
    id: 'q40',
    text: 'Per la CENA le indicazioni saranno di abbinare pietanza + pane/patate + verdura + frutta. Necessità particolari?',
    type: 'textarea',
    required: true,
    hint: 'Pietanze: carne rossa/bianca, uova, formaggi, salumi magri, pesce secondo frequenze da dieta mediterranea',
    placeholder: 'Scrivi "OK" se non ci sono necessità, altrimenti riportale',
  },
  {
    id: 'q41',
    text: 'Riguardo agli alcolici:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Bevi alcolici?',
      'Quotidianamente o solo weekend?',
      'Quantità (bicchieri vino, birre piccole/grandi, drink)?',
      'Potresti farne a meno o ridurli?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q42',
    text: 'Riguardo al PASTO LIBERO settimanale (pizza, sushi, carbonara...):',
    type: 'textarea',
    required: true,
    hint: 'In questa prima fase il pasto libero sarà 1 a settimana nella giornata che preferisci',
    placeholder: 'Scrivi "OK" se non ci sono necessità particolari, altrimenti riportale',
  },
];

// =============================================================================
// DOMANDE PER VEGETARIANI (45-65)
// =============================================================================

export const VEGETARIAN_QUESTIONS: Question[] = [
  {
    id: 'q45',
    text: 'FONTI PROTEICHE VEGETALI che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Tempeh, Burger di Soia, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi (Ceci, Fagioli, Piselli, Lenticchie)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q46',
    text: 'UOVA - versioni che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Uova: versione intera o soli albumi (in brick o tetrapack)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q47',
    text: 'FORMAGGI - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Freschi light (Mozzarella, Stracchino, Ricotta, Feta, Fiocchi di Latte, Philadelphia), Stagionati (Parmigiano, Grana, Asiago, Emmenthal, Pecorino). Specifica se non vuoi versione light.',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q48',
    text: 'CONDIMENTI - Ti interessa anche l\'avocado come alternativa all\'olio EVO?',
    type: 'radio',
    required: true,
    options: ['Sì avocado', 'No avocado'],
  },
  {
    id: 'q49',
    text: 'VERDURA - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Cotte (Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini), Crude (Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q50',
    text: 'CARBOIDRATI - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Pasta, cereale in chicco (riso, farro...), patate, pane, derivati secchi (Crostini integrali Buitoni, fette WASA, Gallette di Farro/Kamut/Riso/Mais)',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q51',
    text: 'Quali pasti principali (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana?',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte a settimana fuori?',
      'Dove (Mensa, Bar, Gastronomia, Ristorante, porti da casa)?',
      'Considereresti portarli da casa o preferisci orientamenti per gestione fuori?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q52',
    text: 'Quanti pasti fai abitualmente ogni giorno?',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quali esattamente (colazione, pranzo, cena, spuntini...)?',
      'Se non fai 5 pasti, saresti disposto/a a farne almeno 5?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q53',
    text: 'Riguardo alla tipologia di colazione:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Preferisci dolce, salata o entrambe?',
      'Necessità particolari?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q54',
    text: 'Scrivi 2 tipologie di colazioni che consumi più di frequente:',
    type: 'textarea',
    required: true,
    placeholder: 'Es: "Latte e biscotti" e "Yogurt con frutta"',
  },
  {
    id: 'q55',
    text: 'In merito al caffè (se non lo consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quanti caffè al giorno?',
      'Amari o dolcificati?',
      'Considereresti dolcificanti acalorici naturali?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q56',
    text: 'Se consumi spuntini durante il giorno (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Cosa consumi abitualmente?',
      'Necessità particolari?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q57',
    text: 'Riguardo al pranzo:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Consumi primo o secondo o entrambi?',
      'È importante chiudere con frutta fresca?',
      'Necessità particolari?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q58',
    text: 'Prenderesti in considerazione un PIATTO UNICO per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Cereale integrale o patate + 2) Pietanza (Fiocchi di Latte, Feta Light, Tofu, Piselli, Uova, Affettato vegetale, Tempeh, Edamame) + 3) Verdura',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q59',
    text: 'Prenderesti in considerazione un pasto a base di LEGUMI per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Legumi (zuppa, asciutti, vellutata) + 2) Pane tostato o derivato secco + 3) Verdura',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q60',
    text: 'Prenderesti in considerazione un pasto a base di PASTA per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Pasta (anche 100% legumi) + 2) Condimento semplice + 3) Eventuale pietanza vegetariana + 4) Verdura',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q61',
    text: 'Per la CENA le indicazioni saranno di abbinare pietanza vegetariana + pane/patate + verdura + frutta. Necessità particolari?',
    type: 'textarea',
    required: true,
    hint: 'Pietanze: Tempeh, Burger di Soia, Uova, Formaggi, Seitan, Affettato Vegetale, Tofu, Legumi',
    placeholder: 'Scrivi "OK" se non ci sono necessità, altrimenti riportale',
  },
  {
    id: 'q62',
    text: 'Riguardo agli alcolici:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Bevi alcolici?',
      'Quotidianamente o solo weekend?',
      'Quantità?',
      'Potresti farne a meno o ridurli?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q63',
    text: 'Riguardo al PASTO LIBERO settimanale:',
    type: 'textarea',
    required: true,
    hint: 'Pizza o qualsiasi primo/secondo/panino di tuo gradimento',
    placeholder: 'Scrivi "OK" se non ci sono necessità particolari, altrimenti riportale',
  },
];

// =============================================================================
// DOMANDE PER VEGANI (66-84)
// =============================================================================

export const VEGAN_QUESTIONS: Question[] = [
  {
    id: 'q66',
    text: 'FONTI PROTEICHE VEGETALI che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Lievito in scaglie, Tempeh, Burger Vegani fatti in casa, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi (Ceci, Fagioli, Piselli, Lenticchie, Soia Edamame)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q67',
    text: 'CONDIMENTI - Ti interessa anche l\'avocado come alternativa all\'olio EVO?',
    type: 'radio',
    required: true,
    options: ['Sì avocado', 'No avocado'],
  },
  {
    id: 'q68',
    text: 'VERDURA - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Cotte (Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini), Crude (Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q69',
    text: 'CARBOIDRATI - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Pasta, cereale in chicco (riso, farro...), patate, pane, derivati secchi (Crostini integrali Buitoni, fette WASA, Gallette)',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q70',
    text: 'Quali pasti principali (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana?',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte a settimana fuori?',
      'Dove?',
      'Considereresti portarli da casa?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q71',
    text: 'Quanti pasti fai abitualmente ogni giorno?',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quali esattamente?',
      'Se non fai 5 pasti, saresti disposto/a a farne almeno 5?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q72',
    text: 'Riguardo alla tipologia di colazione:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Preferisci dolce, salata o entrambe?',
      'Necessità particolari?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q73',
    text: 'Scrivi 2 tipologie di colazioni che consumi più di frequente:',
    type: 'textarea',
    required: true,
    placeholder: 'Es: "Latte vegetale e cereali" e "Frutta con granola"',
  },
  {
    id: 'q74',
    text: 'In merito al caffè (se non lo consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quanti caffè al giorno?',
      'Amari o dolcificati?',
      'Considereresti dolcificanti acalorici naturali?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q75',
    text: 'Se consumi spuntini durante il giorno (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Cosa consumi abitualmente?',
      'Necessità particolari?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q76',
    text: 'Riguardo al pranzo:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Consumi primo o secondo o entrambi?',
      'È importante chiudere con frutta fresca?',
      'Necessità particolari?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q77',
    text: 'Prenderesti in considerazione un PIATTO UNICO per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Cereale integrale o patate + 2) Pietanza (Tofu, Piselli, Affettato vegetale, Tempeh, Edamame, Legumi) + 3) Verdura',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q78',
    text: 'Prenderesti in considerazione un pasto a base di LEGUMI per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Legumi (zuppa, asciutti, vellutata) + 2) Pane tostato o derivato secco + 3) Verdura',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q79',
    text: 'Prenderesti in considerazione un pasto a base di PASTA per pranzo?',
    type: 'textarea',
    required: true,
    hint: 'Composto da: 1) Pasta (anche 100% legumi) + 2) Condimento semplice + 3) Eventuale pietanza vegana + 4) Verdura',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q80',
    text: 'Per la CENA le indicazioni saranno di abbinare pietanza vegana + pane/patate + verdura + frutta. Necessità particolari?',
    type: 'textarea',
    required: true,
    hint: 'Pietanze: Tempeh, Burger Vegani fatti in casa, Seitan, Affettato Vegetale, Tofu, Legumi',
    placeholder: 'Scrivi "OK" se non ci sono necessità, altrimenti riportale',
  },
  {
    id: 'q81',
    text: 'Riguardo agli alcolici:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Bevi alcolici?',
      'Quotidianamente o solo weekend?',
      'Quantità?',
      'Potresti farne a meno o ridurli?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q82',
    text: 'Riguardo al PASTO LIBERO settimanale:',
    type: 'textarea',
    required: true,
    hint: 'Pizza o qualsiasi primo/secondo/panino di tuo gradimento',
    placeholder: 'Scrivi "OK" se non ci sono necessità particolari, altrimenti riportale',
  },
];

// =============================================================================
// DATI FATTURAZIONE (comune a tutti)
// =============================================================================

export const BILLING_QUESTIONS: Question[] = [
  {
    id: 'billingBirthPlace',
    text: 'Luogo di nascita:',
    type: 'text',
    required: true,
    placeholder: 'Es: Roma',
  },
  {
    id: 'billingAddress',
    text: 'Via di residenza:',
    type: 'text',
    required: true,
    placeholder: 'Es: Via Roma',
  },
  {
    id: 'billingAddressNumber',
    text: 'Numero civico:',
    type: 'text',
    required: true,
    placeholder: 'Es: 123',
  },
  {
    id: 'billingCap',
    text: 'CAP:',
    type: 'text',
    required: true,
    placeholder: 'Es: 00100',
  },
  {
    id: 'billingCity',
    text: 'Città:',
    type: 'text',
    required: true,
    placeholder: 'Es: Roma',
  },
  {
    id: 'billingCodiceFiscale',
    text: 'Codice Fiscale:',
    type: 'text',
    required: true,
    placeholder: 'Es: RSSMRA85M01H501Z',
  },
];

// =============================================================================
// HELPER per ottenere domande in base al tipo di dieta
// =============================================================================

export function getDietQuestions(dietType: string): Question[] {
  switch (dietType) {
    case 'ONNIVORO':
      return OMNIVORE_QUESTIONS;
    case 'VEGETARIANO':
      return VEGETARIAN_QUESTIONS;
    case 'VEGANO':
      return VEGAN_QUESTIONS;
    default:
      return [];
  }
}

// Helper per estrarre il tipo di dieta dalla risposta q18
export function extractDietType(answer: string): string {
  if (answer.includes('ONNIVORO')) return 'ONNIVORO';
  if (answer.includes('VEGETARIANO')) return 'VEGETARIANO';
  if (answer.includes('VEGANO')) return 'VEGANO';
  return '';
}
