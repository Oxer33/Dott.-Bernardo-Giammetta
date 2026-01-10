// =============================================================================
// CONFIGURAZIONE QUESTIONARIO PRIMA VISITA
// Definizione di tutte le domande divise per sezione
// =============================================================================

// Tipo per le domande
export interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'textarea-with-radio';
  required: boolean;
  placeholder?: string;
  options?: string[];
  hint?: string; // Esempi o suggerimenti sotto la domanda
  // Nuovi campi per domande con radio Si/No + textarea condizionale
  radioOptions?: string[]; // Opzioni radio (es: ['Sì', 'No'])
  conditionalOnRadio?: string; // Mostra textarea solo se radio = questo valore
  // Per domande con elenco puntato da mostrare FUORI dalla textarea
  bulletPoints?: string[]; // Punti da mostrare come lista sopra la textarea
}

// =============================================================================
// DOMANDE COMUNI A TUTTI (5-17)
// Le domande 1-4 (email, nome, data nascita, telefono) sono precompilate dal profilo
// =============================================================================

export const COMMON_QUESTIONS: Question[] = [
  {
    id: 'q5',
    text: 'Hai mai affrontato un percorso alimentare con il supporto di un professionista? Se sì allora quante volte e con quale obiettivo?',
    type: 'textarea-with-radio',
    required: true,
    radioOptions: ['Sì', 'No'],
    conditionalOnRadio: 'Sì',
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q6',
    text: 'Svolgi una tipologia di lavoro sedentario oppure ti ritrovi a muoverti molto durante le ore lavorative settimanali?',
    type: 'textarea',
    required: true,
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q7',
    text: 'Nelle ore libere dopo il lavoro e nelle giornate di riposo dal lavoro tendi ad essere sedentario/a o cerchi di muoverti?',
    type: 'textarea',
    required: true,
    placeholder: 'Per esempio passeggiare, uscire in bici, fare del trekking...',
  },
  {
    id: 'q8',
    text: 'Svolgi un\'attività fisica programmata quindi un allenamento settimanale? Se la risposta è sì allora indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'tipologia di attività svolta (per esempio sala pesi, crossfit, nuoto, pilates, yoga, atletica leggera, ecc...)',
      'quante sedute svolgi a settimana',
      'durata di ogni singola seduta',
      'fascia oraria',
      'solo nel caso in cui fossi agonista specificami anche se sei in fase di carico, scarico o pre-competizione'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q9',
    text: 'Hai l\'abitudine di fumare? Se sì indicami quante sigarette al giorno:',
    type: 'textarea-with-radio',
    required: true,
    radioOptions: ['Sì', 'No'],
    conditionalOnRadio: 'Sì',
    placeholder: 'Scrivi il numero di sigarette al giorno indicativo',
  },
  {
    id: 'q10',
    text: 'Riguardo al sonno, indicami:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante ore dormi continuativamente (e causa risvegli notturni)',
      'Ore totali',
      'Vorresti integrazione per migliorarlo?',
      'Integratori già provati senza effetto?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q11',
    text: 'Riguardo al Ciclo (se maschio scrivi "non applicabile"):',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Ciclo regolare/Menopausa?',
      'Doloroso/sopportabile?',
      'Tentazioni alimentari pre-ciclo?',
      'Assumi farmaci/integratori per ciclo?',
      'Vorresti integrazione naturale?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q12',
    text: 'Sono presenti condizioni patologiche diagnosticate da un Medico? Se sì riportale:',
    type: 'textarea',
    required: true,
    placeholder: 'Elenca eventuali patologie diagnosticate o scrivi "Nessuna"',
  },
  {
    id: 'q13',
    text: 'Assumi farmaci? Se sì indicami nome e modalità di assunzione:',
    type: 'textarea',
    required: true,
    placeholder: 'Nome farmaco e come/quando lo assumi, oppure "Nessuno"',
  },
  {
    id: 'q14',
    text: 'Assumi integratori? Se sì indicami nome e modalità di assunzione:',
    type: 'textarea',
    required: true,
    placeholder: 'Nome integratore e come/quando lo assumi, oppure "Nessuno"',
  },
  {
    id: 'q15',
    text: 'In merito ad allergie:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Allergie ad alimenti o stagionali diagnosticate?',
      'Specificale anche se non diagnosticate ma percepisci fastidi'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q16',
    text: 'Riguardo alla regolarità intestinale:',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Quante volte al giorno/settimana?',
      'Assumi integratori per regolarità?',
      'Integratori già provati senza effetto?'
    ],
    placeholder: 'Scrivi qui',
  },
  {
    id: 'q17',
    text: 'Qual è il tuo obiettivo personale per cui vuoi iniziare questo percorso?',
    type: 'textarea',
    required: true,
    bulletPoints: [
      'Ridurre grasso/peso?',
      'Aumentare peso/massa muscolare?',
      'Mantenere peso migliorando alimentazione/forma fisica?'
    ],
    placeholder: 'Scrivi qui',
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
    text: 'LEGUMI che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Legumi: Ceci, Fagioli, Piselli, Lenticchie',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q20',
    text: 'CARNI ROSSE che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Carne rossa: manzo, vitello, maiale (fettina/bistecca o hamburger)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q21',
    text: 'CARNI BIANCHE che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Carne bianca: pollo o tacchino (fettina/bistecca o hamburger)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q22',
    text: 'UOVA - versioni che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Uova: versione intera o soli albumi (in brick o tetrapack)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q23',
    text: 'PESCE - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Con lisca (Merluzzo, Nasello, Persico, Platessa, Sogliola, Orata, Pesce Spada, Tonno fresco, Branzino, Salmone, Sarde, Alici, Sgombro), Molluschi (Calamari, Polpo, Seppia, Totani), Crostacei (Gamberi)',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q24',
    text: 'FORMAGGI - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Freschi light (Mozzarella, Stracchino, Ricotta, Feta, Fiocchi di Latte, Philadelphia), Stagionati (Parmigiano, Grana, Asiago, Emmenthal, Pecorino). Specifica se non vuoi versione light.',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q25',
    text: 'SALUMI MAGRI - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Bresaola, Fesa di Pollo o Tacchino arrosto, Prosciutto Crudo sgrassato. Riportami eventuali salumi non presenti di cui non puoi fare a meno.',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q26',
    text: 'CONDIMENTI - Ti interessa anche l\'avocado come alternativa all\'olio EVO?',
    type: 'radio',
    required: true,
    options: ['Sì avocado', 'No avocado'],
  },
  {
    id: 'q27',
    text: 'VERDURA - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Cotte (Broccolo, Cavolfiore, Verza, Cime di rapa, Funghi, Cicoria, Bietola, Spinaci, Carciofi, Zucchine, Peperoni, Melanzane, Fagiolini), Crude (Iceberg, Trocadero, Gentile, Romana, Rucola, Valeriana, Radicchio, Finocchi, Pomodori, Indivia belga, Sedano, Carote, Cetrioli)',
    placeholder: 'Scrivi solo quelle che non vuoi nel piano',
  },
  {
    id: 'q28',
    text: 'CARBOIDRATI - tipologie che NON gradisci (lascia vuoto se gradisci tutto):',
    type: 'textarea',
    required: false,
    hint: 'Pasta, cereale in chicco (riso, farro...), patate, pane, derivati secchi (Crostini integrali Buitoni, fette WASA, Gallette di Farro/Kamut/Riso/Mais)',
    placeholder: 'Scrivi solo quelli che non vuoi nel piano',
  },
  {
    id: 'q29',
    text: 'Consumi almeno 3 volte a settimana il pesce azzurro fresco?',
    type: 'radio',
    required: true,
    options: ['Sì', 'No'],
    hint: 'Esempi: Suri, Sarde, Alici, Sgombro fresco, Pesce Spada, Lanzardo, Tonno fresco, Palamita, Lampuga, Ricciola, Sugarello, Alaccia, Aguglia, Aringa...',
  },
  {
    id: 'q30',
    text: 'Quali pasti principali (colazione, pranzo, cena) consumi a casa e quali fuori durante la settimana?',
    type: 'textarea',
    required: true,
    placeholder: '1) Quante volte a settimana fuori? 2) Dove (Mensa, Bar, Gastronomia, Ristorante, porti da casa)? 3) Considereresti portarli da casa o preferisci orientamenti per gestione fuori?',
  },
  {
    id: 'q31',
    text: 'Quanti pasti fai abitualmente ogni giorno?',
    type: 'textarea',
    required: true,
    placeholder: '1) Quali esattamente (colazione, pranzo, cena, spuntini...)? 2) Se non fai 5 pasti (colazione, pranzo, cena + 2 spuntini), saresti disposto/a a farne almeno 5?',
  },
  {
    id: 'q32',
    text: 'Riguardo alla tipologia di colazione:',
    type: 'textarea',
    required: true,
    placeholder: '1) Preferisci dolce, salata o entrambe? 2) Necessità particolari (alimento che non può mancare, abbinamento indispensabile...)?',
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
    placeholder: '1) Quanti caffè al giorno? 2) Amari o dolcificati (zucchero/Stevia/Eritritolo)? 3) Considereresti dolcificanti acalorici naturali?',
  },
  {
    id: 'q35',
    text: 'Se consumi spuntini durante il giorno (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    placeholder: '1) Cosa consumi abitualmente? 2) Necessità particolari (alimento indispensabile, spuntini pratici fuori casa...)?',
  },
  {
    id: 'q36',
    text: 'Riguardo al pranzo:',
    type: 'textarea',
    required: true,
    placeholder: '1) Consumi primo (pasta/riso) o secondo (pietanza) o entrambi? 2) È importante chiudere con frutta fresca? 3) Necessità particolari?',
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
    placeholder: '1) Bevi alcolici? 2) Quotidianamente o solo weekend? 3) Quantità (bicchieri vino, birre piccole/grandi, drink)? 4) Potresti farne a meno o ridurli?',
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
    placeholder: '1) Quante volte a settimana fuori? 2) Dove (Mensa, Bar, Gastronomia, Ristorante, porti da casa)? 3) Considereresti portarli da casa o preferisci orientamenti per gestione fuori?',
  },
  {
    id: 'q52',
    text: 'Quanti pasti fai abitualmente ogni giorno?',
    type: 'textarea',
    required: true,
    placeholder: '1) Quali esattamente (colazione, pranzo, cena, spuntini...)? 2) Se non fai 5 pasti, saresti disposto/a a farne almeno 5?',
  },
  {
    id: 'q53',
    text: 'Riguardo alla tipologia di colazione:',
    type: 'textarea',
    required: true,
    placeholder: '1) Preferisci dolce, salata o entrambe? 2) Necessità particolari?',
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
    placeholder: '1) Quanti caffè al giorno? 2) Amari o dolcificati? 3) Considereresti dolcificanti acalorici naturali?',
  },
  {
    id: 'q56',
    text: 'Se consumi spuntini durante il giorno (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    placeholder: '1) Cosa consumi abitualmente? 2) Necessità particolari?',
  },
  {
    id: 'q57',
    text: 'Riguardo al pranzo:',
    type: 'textarea',
    required: true,
    placeholder: '1) Consumi primo o secondo o entrambi? 2) È importante chiudere con frutta fresca? 3) Necessità particolari?',
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
    placeholder: '1) Bevi alcolici? 2) Quotidianamente o solo weekend? 3) Quantità? 4) Potresti farne a meno o ridurli?',
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
    placeholder: '1) Quante volte a settimana fuori? 2) Dove? 3) Considereresti portarli da casa?',
  },
  {
    id: 'q71',
    text: 'Quanti pasti fai abitualmente ogni giorno?',
    type: 'textarea',
    required: true,
    placeholder: '1) Quali esattamente? 2) Se non fai 5 pasti, saresti disposto/a a farne almeno 5?',
  },
  {
    id: 'q72',
    text: 'Riguardo alla tipologia di colazione:',
    type: 'textarea',
    required: true,
    placeholder: '1) Preferisci dolce, salata o entrambe? 2) Necessità particolari?',
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
    placeholder: '1) Quanti caffè al giorno? 2) Amari o dolcificati? 3) Considereresti dolcificanti acalorici naturali?',
  },
  {
    id: 'q75',
    text: 'Se consumi spuntini durante il giorno (se non li consumi scrivi "NO"):',
    type: 'textarea',
    required: true,
    placeholder: '1) Cosa consumi abitualmente? 2) Necessità particolari?',
  },
  {
    id: 'q76',
    text: 'Riguardo al pranzo:',
    type: 'textarea',
    required: true,
    placeholder: '1) Consumi primo o secondo o entrambi? 2) È importante chiudere con frutta fresca? 3) Necessità particolari?',
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
    placeholder: '1) Bevi alcolici? 2) Quotidianamente o solo weekend? 3) Quantità? 4) Potresti farne a meno o ridurli?',
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
