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
    text: 'Quali **pasti principali** giornalieri (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana? Se consumi dei pasti fuori, indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte a settimana (es: dal Lunedì al Venerdì oppure 2 volte a settimana, ecc.)?',
      'Dove ti appoggi (Mensa, Bar, Gastronomia, Ristorante oppure se ti porti qualcosa da casa)?',
      'Prenderesti in considerazione la possibilità di **prepararli a casa e portarli con te** (nel caso in cui non lo facessi già)? Oppure preferiresti ricevere degli orientamenti per la gestione del pasto in Mensa/Bar/Gastronomia/Ristorante.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q31',
    text: 'Quanti **pasti** fai abitualmente ogni giorno (es: solo 2 pasti principali, oppure 3 pasti principali, o 3 pasti principali e 1 o 2 o 3 spuntini)? Indicami anche:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quali sono esattamente (es: colazione, pranzo, cena, spuntino di metà mattina, spuntino di metà pomeriggio, spuntino dopo cena, ecc.)?',
      'Nel caso in cui non ne facessi 5 (colazione, pranzo, cena + 2 spuntini), saresti disposto/a a farne almeno 5?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q32',
    text: 'Riguardo alla tipologia di **colazione**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Preferisci consumare una colazione **dolce** e una **salata** oppure solo opzioni dolci o solo salate?',
      'Scrivimi, se esistono, anche eventuali **necessità personali particolari** per la colazione (es: un alimento che non può mancare, un abbinamento di cui non puoi fare a meno, ecc.).'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q33',
    text: 'Scrivi **2 tipologie di colazioni** che consumi più di frequente:',
    type: 'textarea',
    required: true,
    placeholder: 'Es: "Latte e biscotti" e "Yogurt con frutta"',
  },
  {
    id: 'q34',
    text: 'In merito al **caffè**, se lo consumi (se non lo consumi scrivi "NO"), indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quanti caffè consumi durante la giornata?',
      'Sono **amari** o **dolcificati** con zucchero o con dolcificanti acalorici (tipo DIETIC classico o Stevia o Eritritolo)?',
      'Nel caso dolcificassi il caffè abitualmente con lo zucchero ma ti proponessi di utilizzare in alternativa **dolcificanti acalorici naturali** come la Stevia o l\'Eritritolo (rispetto alla Stevia non conferisce retrogusto), potremmo inserirli?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q35',
    text: 'Se consumi **spuntini** durante il giorno allora indicami (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Cosa ti capita di consumare abitualmente?',
      'Scrivimi, se esistono, anche eventuali **necessità personali particolari** per gli spuntini (es: un alimento che non può mancare, spuntini pratici da consumare fuori casa, ecc.).'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q36',
    text: 'Riguardo al **pranzo**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Solitamente consumi un **primo piatto** (a base di pasta o riso) o un **secondo piatto** (pietanza) o fai entrambi nello stesso pasto?',
      'Indicami anche se per te è molto importante chiudere il pranzo con la **frutta fresca** o se ne potresti fare anche a meno.',
      'Scrivimi, se esistono, eventuali **necessità personali particolari** per il pranzo.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q37',
    text: 'Indicami se per pranzo prenderesti in considerazione la possibilità di consumare un **piatto unico** (insalata di cereale o patate) composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Cereale integrale** in chicco (es: Riso o simile) o patate comuni (o Americane) + 2) **Pietanza** (es: Fiocchi di Latte magri, Feta Light, Petto di Pollo o Tacchino, Piselli, Uova Intere o solo Albumi, Tonno, Merluzzo, Nasello, Platessa, Salmone affettato affumicato) + 3) Porzione di **Verdura** cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q38',
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di **Legumi** composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Legumi** da consumare in zuppa o asciutti o in vellutata + 2) **Pane tostato** o derivato secco (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut) + 3) Porzione di **Verdura** cotta (Minestrone o verdure a gradimento) o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q39',
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di **Pasta**, composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Pasta** di Semola o integrale (anche a base di farina 100% Legumi) + 2) **Condimento semplice** (sugo di pomodoro, pesto alla genovese, minestrone, verdure saltate in padella o in crema) + 3) Eventuale **Pietanza** + 4) Porzione di **Verdura** cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze/necessità sulla pasta',
  },
  {
    id: 'q40',
    text: 'Per la **cena** le indicazioni saranno di abbinare (secondo ben precise frequenze di assunzione settimanale così come da linee guida dettate dalla dieta mediterranea):',
    type: 'textarea',
    required: true,
    hint: '1) Una **Pietanza** (es: carne rossa, carne bianca, uova, formaggi, salumi magri, pesce) + 2) **Pane** o patate o derivato secco + 3) Porzione di **Verdura** cruda o cotta + 4) Porzione di **Frutta fresca** a fine pasto. Riportami anche, se esistono, eventuali necessità personali particolari per questo pasto.',
    placeholder: 'Scrivi "OK" se non ci sono necessità, altrimenti riportale',
  },
  {
    id: 'q41',
    text: 'Riguardo agli **alcolici**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Bevi alcolici?',
      'Se si allora specificami se li bevi **quotidianamente** o solo il **fine settimana**.',
      'Indicami la quantità consumata di **vino** (in bicchieri) o di **birra** (specificami quante birre piccole o grandi) o di **drink** (in bicchieri).',
      'Nel caso in cui il consumo di alcol sia quotidiano, specificami se potresti farne completamente a meno o se saresti disponibile a ridurlo.'
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
    text: 'Indicami tra le diverse **FONTI PROTEICHE VEGETALI** elencate di seguito se sono presenti alimenti che **non consumi assolutamente** e che quindi non vuoi vengano inseriti nel piano. Scrivi soltanto gli alimenti che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Fonti proteiche vegetali**: Tempeh, Burger di Soia, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi (es: Ceci, Fagioli, Piselli, Lenticchie).',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q46',
    text: 'Indicami per le **UOVA** se sono presenti versioni che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le versioni che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Uova**: sia in versione intera che soli albumi (in brick o tetrapack).',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q47',
    text: 'Indicami tra le diverse tipologie di **FORMAGGIO** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Formaggi**: sia **freschi** nella versione light (es: Mozzarella, Stracchino, Ricotta, Feta, Fiocchi di Latte, Philadelphia) che **stagionati** (es: Parmigiano, Grana, Asiago, Emmenthal, Pecorino). Se non vuoi assolutamente assumere la versione light dei formaggi freschi specificalo. Prenderemo in considerazione anche la versione senza lattosio solo se è necessario.',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q48',
    text: 'Riguardo ai **CONDIMENTI** di base sarà inserito l\'olio extravergine d\'oliva. Specificami se potrebbe interessarti in alternativa anche l\'avocado scrivendo \'si avocado\' oppure \'no avocado\'.',
    type: 'radio',
    required: true,
    options: ['Sì avocado', 'No avocado'],
  },
  {
    id: 'q49',
    text: 'Indicami tra le diverse tipologie di **VERDURA** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Verdure**: **cotte** (es: Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini) o **crude** (es: Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli).',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q50',
    text: 'Indicami tra le diverse tipologie di **CARBOIDRATO** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Fonti di carboidrati**: pasta, cereale in chicco (es: riso o farro o simili), patate, pane, derivato secco del pane (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut o Riso o Mais, se è necessario utilizzeremo derivati secchi simili ma senza glutine).',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q51',
    text: 'Quali **pasti principali** giornalieri (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana? Se consumi dei pasti fuori, indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte a settimana (es: dal Lunedì al Venerdì oppure 2 volte a settimana, ecc.)?',
      'Dove ti appoggi (Mensa, Bar, Gastronomia, Ristorante oppure se ti porti qualcosa da casa)?',
      'Prenderesti in considerazione la possibilità di **prepararli a casa e portarli con te** (nel caso in cui non lo facessi già)? Oppure preferiresti ricevere degli orientamenti per la gestione del pasto in Mensa/Bar/Gastronomia/Ristorante.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q52',
    text: 'Quanti **pasti** fai abitualmente ogni giorno (es: solo 2 pasti principali, oppure 3 pasti principali, o 3 pasti principali e 1 o 2 o 3 spuntini)? Indicami anche:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quali sono esattamente (es: colazione, pranzo, cena, spuntino di metà mattina, spuntino di metà pomeriggio, spuntino dopo cena, ecc.)?',
      'Nel caso in cui non ne facessi 5 (colazione, pranzo, cena + 2 spuntini), saresti disposto/a a farne almeno 5?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q53',
    text: 'Riguardo alla tipologia di **colazione**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Preferisci consumare una colazione **dolce** e una **salata** oppure solo opzioni dolci o solo salate?',
      'Scrivimi, se esistono, anche eventuali **necessità personali particolari** per la colazione (es: un alimento che non può mancare, un abbinamento di cui non puoi fare a meno, ecc.).'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q54',
    text: 'Scrivi **2 tipologie di colazioni** che consumi più di frequente:',
    type: 'textarea',
    required: true,
    placeholder: 'Es: "Latte e biscotti" e "Yogurt con frutta"',
  },
  {
    id: 'q55',
    text: 'In merito al **caffè**, se lo consumi (se non lo consumi scrivi "NO"), indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quanti caffè consumi durante la giornata?',
      'Sono **amari** o **dolcificati** con zucchero o con dolcificanti acalorici (tipo DIETIC classico o Stevia o Eritritolo)?',
      'Nel caso dolcificassi il caffè abitualmente con lo zucchero ma ti proponessi di utilizzare in alternativa **dolcificanti acalorici naturali** come la Stevia o l\'Eritritolo (rispetto alla Stevia non conferisce retrogusto), potremmo inserirli?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q56',
    text: 'Se consumi **spuntini** durante il giorno allora indicami (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Cosa ti capita di consumare abitualmente?',
      'Scrivimi, se esistono, anche eventuali **necessità personali particolari** per gli spuntini (es: un alimento che non può mancare, spuntini pratici da consumare fuori casa, ecc.).'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q57',
    text: 'Riguardo al **pranzo**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Solitamente consumi un **primo piatto** (a base di pasta o riso) o un **secondo piatto** (pietanza) o fai entrambi nello stesso pasto?',
      'Indicami anche se per te è molto importante chiudere il pranzo con la **frutta fresca** o se ne potresti fare anche a meno.',
      'Scrivimi, se esistono, eventuali **necessità personali particolari** per il pranzo.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q58',
    text: 'Indicami se per pranzo prenderesti in considerazione la possibilità di consumare un **piatto unico** (insalata di cereale o patate) composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Cereale integrale** in chicco (es: Riso o simile) o patate comuni (o Americane) + 2) **Pietanza** (es: Fiocchi di Latte magri, Feta Light, Tofu, Piselli, Uova Intere o solo Albume, Affettato vegetale di Mopur o Lupini, Tempeh, Fagioli di Soia Edamame) + 3) Porzione di **Verdura** cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q59',
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di **Legumi** composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Legumi** da consumare in zuppa o asciutti o in vellutata + 2) **Pane tostato** o derivato secco (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut) + 3) Porzione di **Verdura** cotta (Minestrone o verdure a gradimento) o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q60',
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di **Pasta**, composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Pasta** di Semola o integrale (anche a base di farina 100% Legumi) + 2) **Condimento semplice** (sugo di pomodoro, pesto alla genovese, minestrone, verdure saltate in padella o in crema) + 3) Eventuale **Pietanza** (es: Fiocchi di Latte magri, Feta Light, Tofu, Piselli, Uova, Affettato vegetale, Tempeh, Edamame) + 4) Porzione di **Verdura** cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q61',
    text: 'Per la **cena** le indicazioni saranno di abbinare (secondo ben precise frequenze di assunzione settimanale):',
    type: 'textarea',
    required: true,
    hint: '1) Una **Pietanza vegetariana** (es: Tempeh, Burger di Soia, Uova, Formaggi, Seitan, Affettato Vegetale, Tofu, Legumi) + 2) **Pane** o patate o derivato secco + 3) Porzione di **Verdura** cruda o cotta + 4) Porzione di **Frutta fresca** a fine pasto. Riportami anche, se esistono, eventuali necessità personali particolari per questo pasto.',
    placeholder: 'Scrivi "OK" se non ci sono necessità, altrimenti riportale',
  },
  {
    id: 'q62',
    text: 'Riguardo agli **alcolici**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Bevi alcolici?',
      'Se si allora specificami se li bevi **quotidianamente** o solo il **fine settimana**.',
      'Indicami la quantità consumata di **vino** (in bicchieri) o di **birra** (specificami quante birre piccole o grandi) o di **drink** (in bicchieri).',
      'Nel caso in cui il consumo di alcol sia quotidiano, specificami se potresti farne completamente a meno o se saresti disponibile a ridurlo.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q63',
    text: 'Riguardo al **PASTO LIBERO** settimanale:',
    type: 'textarea',
    required: true,
    hint: 'In questa prima fase il pasto libero sarà 1 a settimana nella giornata che preferisci. Può essere una pizza o qualsiasi altro primo piatto/secondo piatto/panino di tuo gradimento.',
    placeholder: 'Scrivi "OK" se non ci sono necessità particolari, altrimenti riportale',
  },
];

// =============================================================================
// DOMANDE PER VEGANI (66-84)
// =============================================================================

export const VEGAN_QUESTIONS: Question[] = [
  {
    id: 'q66',
    text: 'Indicami tra le diverse **FONTI PROTEICHE VEGETALI** elencate di seguito se sono presenti alimenti che **non consumi assolutamente** e che quindi non vuoi vengano inseriti nel piano. Scrivi soltanto gli alimenti che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Fonti proteiche vegetali**: Lievito in scaglie, Tempeh, Burger Vegani fatti in casa, Seitan, Affettato Vegetale di Mopur o Lupini, Tofu, Legumi (es: Ceci, Fagioli, Piselli, Lenticchie, Soia Edamame).',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q67',
    text: 'Riguardo ai **CONDIMENTI** di base sarà inserito l\'olio extravergine d\'oliva. Specificami se potrebbe interessarti in alternativa anche l\'avocado scrivendo \'si avocado\' oppure \'no avocado\'.',
    type: 'radio',
    required: true,
    options: ['Sì avocado', 'No avocado'],
  },
  {
    id: 'q68',
    text: 'Indicami tra le diverse tipologie di **VERDURA** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Verdure**: **cotte** (es: Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini) o **crude** (es: Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli).',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q69',
    text: 'Indicami tra le diverse tipologie di **CARBOIDRATO** elencate di seguito se sono presenti tipologie che **non consumi assolutamente** e che quindi non vuoi vengano inserite nel piano. Scrivi soltanto le tipologie che non gradisci altrimenti, se gradisci tutto, lascia la casella di risposta vuota.',
    type: 'textarea',
    required: false,
    hint: '**Fonti di carboidrati**: pasta, cereale in chicco (es: riso o farro o simili), patate, pane, derivato secco del pane (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut o Riso o Mais, se è necessario utilizzeremo derivati secchi simili ma senza glutine).',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q70',
    text: 'Quali **pasti principali** giornalieri (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana? Se consumi dei pasti fuori, indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte a settimana (es: dal Lunedì al Venerdì oppure 2 volte a settimana, ecc.)?',
      'Dove ti appoggi (Mensa, Bar, Gastronomia, Ristorante oppure se ti porti qualcosa da casa)?',
      'Prenderesti in considerazione la possibilità di **prepararli a casa e portarli con te** (nel caso in cui non lo facessi già)? Oppure preferiresti ricevere degli orientamenti per la gestione del pasto in Mensa/Bar/Gastronomia/Ristorante.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q71',
    text: 'Quanti **pasti** fai abitualmente ogni giorno (es: solo 2 pasti principali, oppure 3 pasti principali, o 3 pasti principali e 1 o 2 o 3 spuntini)? Indicami anche:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quali sono esattamente (es: colazione, pranzo, cena, spuntino di metà mattina, spuntino di metà pomeriggio, spuntino dopo cena, ecc.)?',
      'Nel caso in cui non ne facessi 5 (colazione, pranzo, cena + 2 spuntini), saresti disposto/a a farne almeno 5?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q72',
    text: 'Riguardo alla tipologia di **colazione**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Preferisci consumare una colazione **dolce** e una **salata** oppure solo opzioni dolci o solo salate?',
      'Scrivimi, se esistono, anche eventuali **necessità personali particolari** per la colazione (es: un alimento che non può mancare, un abbinamento di cui non puoi fare a meno, ecc.).'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q73',
    text: 'Scrivi **2 tipologie di colazioni** che consumi più di frequente:',
    type: 'textarea',
    required: true,
    placeholder: 'Es: "Latte vegetale e cereali" e "Frutta con granola"',
  },
  {
    id: 'q74',
    text: 'In merito al **caffè**, se lo consumi (se non lo consumi scrivi "NO"), indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quanti caffè consumi durante la giornata?',
      'Sono **amari** o **dolcificati** con zucchero o con dolcificanti acalorici (tipo DIETIC classico o Stevia o Eritritolo)?',
      'Nel caso dolcificassi il caffè abitualmente con lo zucchero ma ti proponessi di utilizzare in alternativa **dolcificanti acalorici naturali** come la Stevia o l\'Eritritolo (rispetto alla Stevia non conferisce retrogusto), potremmo inserirli?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q75',
    text: 'Se consumi **spuntini** durante il giorno allora indicami (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Cosa ti capita di consumare abitualmente?',
      'Scrivimi, se esistono, anche eventuali **necessità personali particolari** per gli spuntini (es: un alimento che non può mancare, spuntini pratici da consumare fuori casa, ecc.).'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q76',
    text: 'Riguardo al **pranzo**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Solitamente consumi un **primo piatto** (a base di pasta o riso) o un **secondo piatto** (pietanza) o fai entrambi nello stesso pasto?',
      'Indicami anche se per te è molto importante chiudere il pranzo con la **frutta fresca** o se ne potresti fare anche a meno.',
      'Scrivimi, se esistono, eventuali **necessità personali particolari** per il pranzo.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q77',
    text: 'Indicami se per pranzo prenderesti in considerazione la possibilità di consumare un **piatto unico** (insalata di cereale o patate) composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Cereale integrale** in chicco (es: Riso o simile) o patate comuni (o Americane) + 2) **Pietanza** (es: Tofu, Piselli, Affettato vegetale di Mopur o Lupini, Tempeh, Fagioli di Soia Edamame, Legumi) + 3) Porzione di **Verdura** cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q78',
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di **Legumi** composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Legumi** da consumare in zuppa o asciutti o in vellutata + 2) **Pane tostato** o derivato secco (es: Crostini integrali tipo Buitoni, fette WASA Integrali, Gallette di Farro o Kamut) + 3) Porzione di **Verdura** cotta (Minestrone o verdure a gradimento) o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q79',
    text: 'Indicami se per pranzo prenderesti in considerazione il consumo di un pasto a base di **Pasta**, composto da:',
    type: 'textarea',
    required: true,
    hint: '1) **Pasta** di Semola o integrale (anche a base di farina 100% Legumi) + 2) **Condimento semplice** (sugo di pomodoro, pesto alla genovese, minestrone, verdure saltate in padella o in crema) + 3) Eventuale **Pietanza vegana** (es: Tofu, Piselli, Affettato vegetale, Tempeh, Edamame, Legumi) + 4) Porzione di **Verdura** cotta o cruda',
    placeholder: 'Descrivi se ti interesserebbe e eventuali preferenze',
  },
  {
    id: 'q80',
    text: 'Per la **cena** le indicazioni saranno di abbinare (secondo ben precise frequenze di assunzione settimanale):',
    type: 'textarea',
    required: true,
    hint: '1) Una **Pietanza vegana** (es: Tempeh, Burger Vegani fatti in casa, Seitan, Affettato Vegetale, Tofu, Legumi) + 2) **Pane** o patate o derivato secco + 3) Porzione di **Verdura** cruda o cotta + 4) Porzione di **Frutta fresca** a fine pasto. Riportami anche, se esistono, eventuali necessità personali particolari per questo pasto.',
    placeholder: 'Scrivi "OK" se non ci sono necessità, altrimenti riportale',
  },
  {
    id: 'q81',
    text: 'Riguardo agli **alcolici**:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Bevi alcolici?',
      'Se si allora specificami se li bevi **quotidianamente** o solo il **fine settimana**.',
      'Indicami la quantità consumata di **vino** (in bicchieri) o di **birra** (specificami quante birre piccole o grandi) o di **drink** (in bicchieri).',
      'Nel caso in cui il consumo di alcol sia quotidiano, specificami se potresti farne completamente a meno o se saresti disponibile a ridurlo.'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q82',
    text: 'Riguardo al **PASTO LIBERO** settimanale:',
    type: 'textarea',
    required: true,
    hint: 'In questa prima fase il pasto libero sarà 1 a settimana nella giornata che preferisci. Può essere una pizza o qualsiasi altro primo piatto/secondo piatto/panino di tuo gradimento.',
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
