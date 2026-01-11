# 📝 TODO LIST - Dott. Bernardo Giammetta Website

## ✅ COMPLETATO

### Struttura Base
- [x] Setup progetto Next.js 14 con TypeScript
- [x] Configurazione Tailwind CSS con design system custom
- [x] File configurazione (package.json, tsconfig, next.config, etc.)
- [x] Variabili ambiente (.env.example)
- [x] Gitignore configurato

### Design System
- [x] Palette colori (sage, cream, blush, rose)
- [x] Typography (Inter, Playfair Display, Clash Display)
- [x] Stili globali CSS con utility classes
- [x] Componenti glassmorphism e animazioni

### Layout
- [x] Root Layout con SEO metadata e Schema.org
- [x] Navbar sticky con glassmorphism
- [x] Footer con link e social
- [x] Providers (NextAuth + Theme)

### Homepage
- [x] HeroSection con animazioni Framer Motion
- [x] AboutPreview con split layout
- [x] ServicesGrid in stile Bento
- [x] StatsCounter con numeri animati
- [x] TestimonialsCarousel con Embla
- [x] BlogPreview con cards moderne
- [x] **ContactSection** con form ricontatto (22/12/2024)
- [x] CTASection finale

### Sistema Autenticazione
- [x] NextAuth configurazione
- [x] Google OAuth provider
- [x] Prisma Adapter per sessioni
- [x] Estensione tipi per ruoli e whitelist
- [x] API route [...nextauth]
- [x] **Credentials Provider** per login email/password (22/12/2024)
- [x] **Pagina /registrati** con form completo
- [x] **API /api/auth/register** con bcrypt (12 rounds)
- [x] **Sistema verifica email** con token (24h scadenza)
- [x] **API /api/auth/verify-email** per conferma account

### Database
- [x] Schema Prisma completo
- [x] Modello User con whitelist e ruoli
- [x] Modello Appointment con stati
- [x] Modello TimeBlock (ricorrenti/occasionali)
- [x] Modello EmailLog per tracking
- [x] Modello BlogPost (preparato)
- [x] Modello ContactMessage (preparato)

### Sistema Agenda
- [x] Utility functions (lib/agenda.ts)
- [x] Generazione fasce orarie base
- [x] Calcolo disponibilità con blocchi
- [x] Verifica permessi prenotazione
- [x] Creazione/cancellazione appuntamenti
- [x] Gestione blocchi orari admin
- [x] API /api/agenda/availability
- [x] API /api/agenda/appointments (CRUD)
- [x] Componente AgendaCalendar
- [x] Pagina /agenda
- [x] **Verifica whitelist** per prenotazioni (22/12/2024)
- [x] **Limite 1 prenotazione attiva** per paziente
- [x] **Email conferma** a paziente e dottore

### Sistema Email
- [x] Configurazione Resend
- [x] Template conferma prenotazione (10 varianti)
- [x] Template cancellazione (varianti)
- [x] Template reminder 1 settimana
- [x] Template reminder 1 giorno
- [x] Template followup 25 giorni
- [x] Template urgente 60 giorni
- [x] API cron per reminders automatici
- [x] **Nodemailer per SMTP Aruba** (22/12/2024)
- [x] **AWS SES service** alternativo
- [x] **Email verifica account** per nuovi utenti
- [x] **Email conferma prenotazione** a paziente e dottore

### Documentazione
- [x] ARCHITETTURA.md
- [x] TODO.md

---

## 🔄 IN CORSO

### Deploy AWS Amplify
- [x] Configurazione Prisma per PostgreSQL
- [x] Modello NutriBot: deepseek/deepseek-r1-0528:free
- [x] Fix pagina /accedi (auth.ts JWT senza database)
- [x] Script setup-database per build Amplify
- [x] Endpoint /api/db/init per diagnosi database
- [x] Endpoint /api/test-nutribot per debug completo
- [x] Pagine legali (privacy, cookie, termini)
- [x] Favicon SVG rotonda con logo BG
- [x] Creato amplify.yml per configurazione deploy
- [x] Esposto variabili env in next.config.js per Amplify
- [x] Variabili ambiente configurate su Amplify Console
- [x] Account master (papa.danilo91tp@gmail.com + bernardogiammetta@gmail.com)
- [x] Pagina agenda protetta (solo whitelist/admin)
- [ ] **Creare tabelle su AWS RDS** (POST /api/db/init)
- [ ] Test finale su produzione

### Area Personale (/profilo) ✅ NUOVO
- [x] Pagina profilo con gestione nome/cognome
- [x] Nota per usare dati reali
- [x] Card stato account (ruolo, whitelist)
- [x] Link rapidi a servizi e contatti

### Questionario Alimentare (/profilo/questionario) ✅ NUOVO
- [x] 35 domande estratte da my-questionnaire
- [x] Sezioni: Generalità, Stile di Vita, Cliniche, Obiettivo, ecc.
- [x] Progress bar e navigazione domande
- [x] Salvataggio locale (localStorage)
- [x] Jump to question

### NutriBot Miglioramenti ✅ NUOVO
- [x] Formattazione Markdown (grassetto, corsivo, link)
- [x] Prompt sistema: MAI consigli nutrizionali
- [x] Risposta standard per domande su alimentazione

### UI/UX Miglioramenti ✅ AGGIORNATO 26/12/2024
- [x] Splash screen durata 4s (aumentato 1.5s)
- [x] **PWA Install Prompt** per mobile/tablet
- [x] **MasterBookingModal** per account medico (blocchi, durata, pazienti)
- [x] **Feste italiane** escluse dall'agenda (domeniche, Pasqua, patrono Bologna)

### Account Master - Modifiche 26/12/2024 ✅ NUOVO
- [x] **MasterDashboard** semplificato: solo richieste in attesa + oggi + domani
- [x] **AdminDashboard** menu responsive con flex-wrap per mobile
- [x] **AdminDashboard** bottone Dashboard (primo) + Statistiche (ultimo)
- [x] Rimossi bottoni busta/ingranaggio inutili da header admin
- [x] **AppointmentsList** responsive: cards su mobile, tabella su desktop
- [x] **MasterBookingModal** ricerca include pazienti in attesa whitelist
- [x] **AgendaCalendar** mostra nome/cognome paziente nelle caselle per master
- [x] **AgendaCalendar** note blocchi con tooltip per master
- [x] **AgendaCalendar** nascosta descrizione per master
- [x] **AgendaCalendar** "Vai alla data" per master e whitelist
- [x] **TimeBlocksManager** rimosso + dal bottone "Nuovo Blocco"

### Miglioramenti UI/UX - 27/12/2024 ✅ NUOVO
- [x] **Navbar** click fuori chiude menu utente desktop
- [x] **MasterDashboard** bottoni navigazione rapida (6 bottoni come admin)
- [x] **MasterDashboard** bottone Agenda dedicato
- [x] **AppointmentsList** fix layout quando si apre tastiera mobile
- [x] **AdminStats** sezione Statistiche completa con grafici:
  - Visite completate (settimana/mese/anno) con trend
  - Visite cancellate (settimana/mese/anno)
  - Picchi affluenza (fascia oraria, giorno, mese)
  - Grafici distribuzione oraria/settimanale/mensile
  - Trend ultimi 6 mesi con confronto completate/cancellate
  - Statistiche pazienti (totali, approvati, in attesa, nuovi)
  - Tasso di completamento annuale
- [x] **WhitelistManager** bottoni responsive su più righe
- [x] **WhitelistManager** filtri avanzati pazienti in attesa con/senza visite
- [x] **API appointments** master può prenotare per pazienti in attesa
- [x] **AgendaCalendar** date picker limitato anni 2020-2099, precompilato
- [x] **PullToRefresh** nuovo componente refresh swipe-down su mobile
- [x] **API stats** nuovo endpoint statistiche complete `/api/admin/stats`

### Bug Fixes e Miglioramenti - 27/12/2024 (Sessione 2) ✅ NUOVO
- [x] **canUserBook** master può prenotare per pazienti non in whitelist (solo warning)
- [x] **canUserBook** master può inserire appuntamenti su date passate
- [x] **AppointmentsList** tasto modifica appuntamento (cambio data/ora)
- [x] **AppointmentsList** note autosalvanti con onBlur (niente più click conferma)
- [x] **AppointmentsList** colori diversi per durata (60min normale, 90min scuro, 120min rosso)
- [x] **AppointmentsList** fix overflow card mobile
- [x] **MasterDashboard** card "In attesa con visita effettuata"
- [x] **AdminDashboard** bottone Agenda aggiunto
- [x] **AdminDashboard** navigazione con query string `?tab=` funzionante
- [x] **Middleware** rate limiting auth aumentato (da 10 a 30 req/min)
- [x] **API whitelist-expiry** dopo 12 mesi senza visite paziente torna in attesa
- [x] **LoadingSpinner** con varianti (default, leaf, dots, pulse)
- [x] **Skeleton loaders** per card, table, page
- [x] **ErrorMessage** e **ApiError** components
- [x] **Toast notification system** con provider
- [x] **ConfirmDialog** per azioni distruttive
- [x] **FormInput** con validazione, password toggle, icone
- [x] **FormTextarea** con contatore caratteri
- [x] **FormCheckbox** con label e descrizione
- [x] **Select/Dropdown** con placeholder e validazione
- [x] **RadioGroup** con opzioni
- [x] **Modal** con varianti dimensione + Drawer laterale
- [x] **Tabs** con varianti (default, pills, underline)
- [x] **Tooltip** con posizioni e delay + InfoTooltip
- [x] **Badge** etichette colorate + StatusDot
- [x] **Card** con varianti (default, outlined, elevated, glass)
- [x] **StatCard**, **FeatureCard**, **ProfileCard**
- [x] **Accordion** collapsible + FAQAccordion
- [x] **Pagination** con varianti + usePagination hook
- [x] **SearchInput** con debounce + suggestions
- [x] **OptimizedImage** con blur placeholder e lazy loading

### ⚡ FIX CRITICI Master Account - 27/12/2024 (Sessione 3) ✅ NUOVO
- [x] **agenda.ts** usa `isMasterAccount()` da config.ts (lista completa 4 account)
- [x] **agenda.ts** master ESENTE da TUTTI i controlli - ritorna subito OK
- [x] **api/agenda/appointments** master può prenotare per qualsiasi userId
- [x] **Rimosso MASTER_EMAIL singolo** - ora usa lista MASTER_ACCOUNTS
- [x] **Master può prenotare date PASSATE** ✓
- [x] **Master può prenotare nelle prossime 48h** (no limite preavviso) ✓
- [x] **Master può prenotare per pazienti NON in whitelist** ✓
- [x] **AgendaMasterView** nuovo componente vista agenda semplificata master
- [x] **Icona blocchi orari** da Clock a Lock (AdminDashboard, MasterDashboard)
- [x] **AppointmentsList** modal modifica con selezione durata (60/90/120 min)
- [x] **AdminStats** card maschi/femmine con percentuali
- [x] **AdminStats** ricerca paziente + statistiche individuali + stato Ultimato
- [x] **API patient-stats** nuovo endpoint statistiche singolo paziente
- [x] **Mobile** disabilitato zoom (userScalable: false)
- [x] **Auto-whitelist** paziente dopo prima visita completata
- [x] **whitelist-expiry** esecuzione settimanale, esclude Ultimati

### ⚡ FIX CRITICI Master Account - 28/12/2024 (Sessione 4) ✅ NUOVO
- [x] **FIX ROOT CAUSE**: `session.user.email` non veniva copiata dal token JWT
- [x] **auth.ts** ora copia `token.email` -> `session.user.email` esplicitamente
- [x] **isMasterAccount()** fix confronto case-insensitive con `.some()`
- [x] **Rimosso bernardogiammetta@gmail.com** da MASTER_ACCOUNTS (email sbagliata)
- [x] **Modal modifica appuntamento** - data e ora separati con fasce orarie
- [x] **Modal inserimento** - data/ora evidenti come titolo principale
- [x] **Colori agenda differenziati**: 60min=lilla, 90min=viola scuro, 120min=rosso
- [x] **AppointmentsList** fix salvataggio modifica (formato data ISO corretto)

### ⚡ FIX CRITICI Master Account - 28/12/2024 (Sessione 5) ✅ NUOVO
- [x] **MASTER_OVERRIDE flag**: bypass garantito per master indipendente da email
- [x] **isMaster doppio controllo**: `isMasterAccount(email) || role === 'ADMIN'`
- [x] **canUserBook**: riconosce 'MASTER_OVERRIDE' come caller per bypass totale
- [x] **Reschedule parsing robusto**: validazione data con try/catch e logging

### 🔐 AWS Cognito Integration - 30/12/2024 (Sessione 6) ✅ COMPLETATO
- [x] **CognitoProvider** aggiunto a NextAuth (backend, non esposto agli utenti)
- [x] **Gruppi Cognito**: utenti nel gruppo "master" configurati su AWS
- [x] **Riconoscimento automatico master**: via email in MASTER_ACCOUNTS (config.ts)
- [x] **Variabili ambiente**: COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER
- [x] **App Client Cognito**: `nextauth-client` con client_secret creato
- [x] **Gruppo "master"**: creato con 3 utenti (Danilo, Dr. Giammetta, La Pulena)
- [x] **Variabili Amplify**: tutte configurate correttamente
- [x] **UX pulita**: rimosso pulsante AWS visibile, solo Google e Email/Password
- [x] **Navbar fix**: pulsante "Accedi" ora va a /accedi invece di Google diretto
- [x] **Google OAuth fix**: aggiunto callback URL CloudFront a Google Cloud Console

### 🔧 FIX CRITICI Master Bypass - 30/12/2024 (Sessione 7) ✅ COMPLETATO
- [x] **ROOT CAUSE 1**: JWT callback ricalcola SEMPRE il ruolo (non solo al primo login)
  - Prima: ruolo calcolato solo al primo login e mai aggiornato
  - Ora: ruolo ricalcolato ad ogni request per riflettere modifiche a MASTER_ACCOUNTS
- [x] **ROOT CAUSE 2**: `createAppointment` ora accetta e passa `callerEmail`
  - Prima: chiamava canUserBook senza callerEmail, ignorando bypass master
  - Ora: passa correttamente callerEmail per permettere bypass
- [x] **ROOT CAUSE 3**: API passa `MASTER_OVERRIDE` a createAppointment
  - Garantisce che il bypass master funzioni in entrambi i check di canUserBook
- [x] **Reset loading Google button**: stato resettato quando utente torna sulla pagina

### 🔐 FIX CRITICI Pazienti & Email - 02/01/2026 (Sessione 8) ✅ COMPLETATO
- [x] **BUG CRITICO RISOLTO**: Pazienti in whitelist non potevano prenotare
  - **Root cause**: JWT callback impostava `isWhitelisted = isMaster` (sempre false per pazienti!)
  - **Fix**: JWT ora legge `isWhitelisted` dal database per pazienti normali
  - Effetto immediato: pazienti possono prenotare subito dopo essere messi in whitelist
- [x] **Verifica email obbligatoria**: blocco prenotazioni per utenti con email non verificata
  - Solo per utenti registrati con email/password (non OAuth)
  - Messaggio chiaro: "Devi verificare la tua email prima di prenotare"
- [x] **Storico visite completo** nell'area personale paziente:
  - Visite completate con stato (Completata, Non presentato)
  - Visite cancellate in sezione separata
  - Scrollabile fino a 50 appuntamenti
- [x] **Sistema email già esistente verificato**:
  - ✅ Verifica email con token (register + verify-email)
  - ✅ Log email in database (modello EmailLog)
  - ✅ Cron reminders (1 settimana, 1 giorno, followup 25/60 giorni)
  - ✅ Template email variati (50 varianti per sembrare scritti a mano)
- [x] **Integrazione AWS SES**: email automatica quando paziente viene approvato in whitelist

### 🔐 AWS Cognito & SES - 03/01/2026 (Sessione 9) ✅ COMPLETATO
- [x] **Nuovo User Pool Cognito creato**: `eu-north-1_Xi3V8ZVoy`
  - App Client: `bernardogiammetta.com-patients` (ID: `1ecaje9g00o1kpsl3jvmll456q`)
  - Attributi: email, given_name, family_name, birthdate, gender
  - Registrazione self-service abilitata
  - Verifica email obbligatoria
- [x] **AWS SES configurato**:
  - Dominio `bernardogiammetta.com` verificato
  - DKIM configurato con successo
  - 3 record CNAME aggiunti su Aruba DNS
  - Richiesta accesso produzione inviata (caso #176743190600620)
- [x] **Variabili ambiente aggiornate** in `.env.example`:
  - `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET`, `COGNITO_ISSUER` (nuovo User Pool)
  - `AWS_SES_ACCESS_KEY_ID`, `AWS_SES_SECRET_ACCESS_KEY`, `AWS_SES_FROM_EMAIL`, `AWS_SES_REGION`

#### ⚠️ AZIONI RICHIESTE SU AWS AMPLIFY:
1. **Recupera Client Secret** dalla console Cognito:
   - Vai su Cognito > User Pools > `eu-north-1_Xi3V8ZVoy`
   - App integration > App clients > `bernardogiammetta.com-patients`
   - Mostra client secret e copialo
2. **Aggiorna variabili su Amplify Console**:
   ```
   COGNITO_CLIENT_ID=1ecaje9g00o1kpsl3jvmll456q
   COGNITO_CLIENT_SECRET=<il-secret-recuperato>
   COGNITO_ISSUER=https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Xi3V8ZVoy
   ```
3. **Attendi approvazione SES**: produzione (caso #176743190600620)

### 🔧 Fix Sistema Fatturazione Avanzato - 11/01/2026 (Sessione 25) ✅ COMPLETATO
- [x] **Rimosso /api/debug/env**: endpoint debug non più accessibile in produzione
- [x] **Rimossi file obsoleti**: questionnaire-data.ts e QuestionnaireForm.tsx (unificati in questionnaire-config.ts)
- [x] **API /api/fatture**: GET lista fatture con statistiche, POST crea nuova fattura
- [x] **API /api/fatture/expense-types**: GET/POST/DELETE per gestione nature spesa persistenti
- [x] **API /api/fatture/next-number**: genera numero fattura progressivo corretto (es: 1/2026, 2/2026...)
- [x] **Schema Prisma aggiornato**: aggiunto InvoiceItem (righe fattura) e ExpenseType (nature spesa)
- [x] **NuovaFattura migliorato**: bottone elimina nature spesa, salvataggio su API, numero incrementale automatico
- [x] **ElencoFatture migliorato**: statistiche settimana/mese/anno, ricerca data in formati multipli (01/2026, gennaio, etc.)
- [x] **Bottoni funzionanti**: visualizza, modifica stato, stampa (browser), scarica PDF (in sviluppo)
- [ ] **TODO: Migrare database**: eseguire `npx prisma db push` per applicare nuovi modelli
- [ ] **TODO: Generazione PDF professionale**: implementare come in Autofatturazione STS

### 🔧 Sistema Fatturazione + Fix UI - 10/01/2026 (Sessione 24) ✅ COMPLETATO
- [x] **Rimossa fascia ridondante /agenda admin**: header "Agenda Appuntamenti" inutile rimosso
- [x] **Bottone Apri spostato a sinistra**: nelle card pazienti ora è all'estremo sinistro
- [x] **Modal conferma Rimuovi/Elimina**: avviso che rimuovi toglie accesso, elimina è irreversibile
- [x] **Sezione billing migliorata**: differenziazione nascita (CF) vs residenza (fattura)
- [x] **CF ultima casella**: con dicitura "Modificare solo in caso di errore del calcolo automatico"
- [x] **(Whatsapp o SMS) al numero**: aggiunto in /area-personale e /profilo paziente
- [x] **Link Fatture in tutti i menu**: AgendaMasterView, MasterDashboard, AdminDashboard, PatientProfileView
- [x] **Pagina /fatture creata**: con sottosezioni Nuova Fattura e Elenco Fatture
- [x] **NuovaFattura component**: ricerca paziente, nature spesa, calcolo ENPAB 4%, marca bollo >77.47€
- [x] **ElencoFatture component**: ricerca, statistiche, visualizza/modifica/stampa fatture

### 🔧 UI Admin + Calcolo CF Automatico - 10/01/2026 (Sessione 23) ✅ COMPLETATO
- [x] **Fix grassetto q17 modal admin**: formatBoldText anche alle risposte textarea
- [x] **Ridotto spazio /agenda paziente**: py-6 invece di section class
- [x] **Elenchi puntati modal questionari**: bulletPoints visibili sia in admin che paziente
- [x] **Menu navigazione categorie modal**: aggiunto menu per navigare tra sezioni (admin + paziente)
- [x] **Dashboard master: whitelist->Elenco pazienti**: rinominato nel menu navigazione
- [x] **Rimossa fascia inutile Dashboard admin**: header con bottoni Agenda/Blacklist ridondanti
- [x] **Rimossa fascia inutile /admin**: stessa fascia ridondante rimossa
- [x] **Menu navigazione admin uniforme**: aggiunto in /admin/paziente/[id] per uniformità
- [x] **Componente ComuneAutocomplete**: autocomplete per ricerca comuni italiani
- [x] **Sistema calcolo CF**: lib/codice-fiscale.ts + lib/comuni-italiani.ts + componente UI
- [x] **Integrato ComuneAutocomplete nel questionario**: luogo nascita e città con autocomplete + calcolo provincia automatico

### 🔧 Profilo Paziente + Questionari + Agenda - 10/01/2026 (Sessione 22) ✅ COMPLETATO
- [x] **Fix grassetto opzioni radio q17**: le opzioni ora mostrano grassetto invece di asterischi
- [x] **Modal admin questionari migliorato**: testo completo domande, categorie, filtro stile alimentare
- [x] **Fix salvataggio profilo paziente**: ora funziona correttamente con tutti i campi
- [x] **Dati anagrafici in /profilo**: luogo nascita, codice fiscale, indirizzo, città, CAP, email contatto
- [x] **Input telefono solo numeri**: rimosso +39 dal placeholder, accetta solo cifre
- [x] **Ridotto spazio fascia viola/menu**: py-6 invece di section class
- [x] **Questionari visibili in /profilo paziente**: lista con bottone "occhio" per visualizzare
- [x] **Modal readonly questionari paziente**: stesso formato admin, divide per categorie, mostra testo completo
- [x] **Time shift 48h agenda paziente**: l'agenda dei pazienti parte dalla settimana con 48h minime, bottone indietro disabilitato

### 🔧 Questionario Testi Originali + Admin - 10/01/2026 (Sessione 21) ✅ COMPLETATO
- [x] **Fix bug radio q17**: confronto esatto invece di solo prima parola (tutte iniziavano con "Vuoi")
- [x] **Admin visualizza questionari**: modal con dettagli completi (commonAnswers, dietAnswers, billingData)
- [x] **Textarea sempre visibili**: rimosse condizioni, ora sempre mostrate per note aggiuntive
- [x] **Dati questionario -> profilo**: mappatura corretta campi billing (billingBirthPlace, ecc.)
- [x] **Testo telefono esatto**: "Scrivimi il Numero di Cellulare per tenerci sempre in contatto..."
- [x] **Supporto grassetto**: formatBoldText() converte **testo** in <strong>testo</strong>
- [x] **Testi originali q5-q17**: aggiornati con testi completi e parole chiave in grassetto
- [x] **Testi originali q19-q42**: onnivori con testi completi e grassetti
- [x] **Testi originali q45-q63**: vegetariani con testi completi e grassetti
- [x] **Testi originali q66-q82**: vegani con testi completi e grassetti

### 🔧 Questionario + Admin UX V2 - 10/01/2026 (Sessione 20) ✅ COMPLETATO
- [x] **Domanda q11 (ciclo)**: modificato per scrivere "y" se maschio invece di "non applicabile"
- [x] **Domanda q17 (obiettivo)**: nuovo tipo `radio-with-textarea` con 3 opzioni radio + textarea note
- [x] **Radio button uniformi**: aggiunto `min-h-[60px]` per uniformare altezza radio stile alimentare
- [x] **BulletPoints fuori placeholder**: tutte le domande preferenze (onnivori, vegetariani, vegani)
- [x] **Rimossa emoji lampadina**: hint ora senza 💡 per serietà professionale
- [x] **Blacklist dinamico agenda**: rosso solo se ci sono pazienti, altrimenti grigio
- [x] **Filtri visite admin**: aggiunto filtro "Completati" + contatori per ogni filtro
- [x] **Sezione preferenze sempre visibile**: con avviso arancione se stile alimentare non selezionato
- [x] **Label sezioni arancione**: se visitata ma incompleta
- [x] **Contorno arancione domande**: se required ma mancante

### 🔧 Questionario + Admin UX - 10/01/2026 (Sessione 19) ✅ COMPLETATO
- [x] **Bottone Blacklist menu admin**: aggiunto in dashboard e agenda (rosso con badge)
- [x] **Filtri visite paziente admin**: tutti/confermati/cancellati in PatientProfileView
- [x] **Questionario sez.1 semplificata**: solo numero telefono + email contatto
- [x] **Validazione telefono**: solo numeri (no lettere/simboli)
- [x] **Email contatto**: campo separato con dicitura "Inserisci email dove comunicare informazioni e materiali utili al percorso"
- [x] **Domanda q5 (percorso alimentare)**: radio Sì/No + textarea condizionale "Scrivi qui"
- [x] **Domanda q6 (lavoro)**: placeholder semplificato "Scrivi qui"
- [x] **Domanda q8 (attività fisica)**: elenco puntato FUORI dalla textarea, placeholder "Scrivi qui"
- [x] **Domanda q9 (fumo)**: radio Sì/No + textarea condizionale "numero di sigarette al giorno indicativo"
- [x] **Domande q10, q11, q15, q16, q17**: elenchi puntati spostati fuori dal placeholder
- [x] **Nuovo tipo Question**: `textarea-with-radio` con `radioOptions`, `conditionalOnRadio`, `bulletPoints`
- [x] **Campo contactEmail**: nuovo campo DB per email comunicazioni (può differire da email login)
- [x] **Admin vista paziente**: mostra email login + email contatto separatamente
- ⚠️ **Data nascita/sesso registrazione**: già configurato su AWS Cognito (obbligatorio alla registrazione)

### 🔧 UX Miglioramenti + Navigazione - 09/01/2026 (Sessione 18) ✅ COMPLETATO
- [x] **Recidivi DB**: nuovo campo `blacklistCount` per tracciare storico rientri blacklist
- [x] **Questionario modificabile**: dati profilo editabili (nome, telefono, data nascita) tranne email
- [x] **Whitelist → Elenco Pazienti**: rinominato tab admin
- [x] **Bottone Apri paziente**: in elenco pazienti → apre /admin/paziente/[id]
- [x] **Pagina admin paziente**: nuova pagina con dati, appuntamenti e questionari
- [x] **Card questionari in /profilo**: rimossa card stato account, aggiunta card questionari
- [x] **Navigazione paziente**: bottoni Agenda/Area personale/Profilo in tutte le pagine paziente
- [x] **Rimosso bottone Prenota**: dalla card appuntamento in area-personale

### 🔧 Questionario Prima Visita - 09/01/2026 (Sessione 17) ✅ COMPLETATO
- [x] **Schema DB Questionario**: nuovo modello `Questionnaire` con campi per risposte JSON
- [x] **Configurazione domande**: file `questionnaire-config.ts` con tutte le 80+ domande
- [x] **Logica condizionale**: domande diverse per ONNIVORO/VEGETARIANO/VEGANO
- [x] **API questionario**: GET (lista questionari) + POST (crea nuovo, NON modificabile)
- [x] **Form dinamico**: componente `QuestionnaireFormNew` con navigazione sezioni
- [x] **Dati precompilati**: nome, email, telefono, data nascita dal profilo
- [x] **Avviso massivo**: banner arancione in area-personale se ha visita ma NO questionario
- [x] **Card questionari**: nella sidebar per vedere/creare nuovi questionari
- [x] **Copia questionario**: possibilità di creare nuovo partendo dal precedente
- [x] **Email reminder**: 2 giorni prima della visita se questionario non compilato
- [x] **Privacy consent**: checkbox obbligatoria per autorizzazione trattamento dati

### 🔧 Fix Blacklist UI + Orari - 07/01/2026 (Sessione 16) ✅ COMPLETATO
- [x] **Menu duplicato rimosso**: BlacklistManager ora senza menu interno (usa quello di AdminDashboard)
- [x] **Bottone Blacklist dinamico**: contatore + rosso solo se ci sono pazienti in blacklist
- [x] **Fix orari definitivo**: serializzazione date senza Z nel server component
- [x] **Testo corretto**: "Prossimo appuntamento" (singolare)
- [x] **Cancella solo whitelist**: bottone nascosto per pazienti non in whitelist
- [x] **Logica whitelist/blacklist**: confermata mutualmente esclusiva

### 🔧 UX Paziente + Blacklist Manager - 07/01/2026 (Sessione 15) ✅ COMPLETATO
- [x] **Fix orari area-personale definitivo**: regex per rimuovere `.000Z` oltre a `Z`
- [x] **Bottone "Elimina nota"**: in entrambi i modal (agenda + area-personale)
- [x] **Placeholder note aggiornato**: "Scrivi qui ciò che vorresti modificare o aggiungere al piano"
- [x] **Testo bottone note**: "Aggiungi note (modifiche al piano, richieste specifiche...)"
- [x] **Card riorganizzata**: "Cancella appuntamento" in alto a destra con durata
- [x] **Sezione Blacklist admin**: nuovo tab + componente BlacklistManager + API
- [x] **Fix reset contatore blacklist**: SEMPRE aggiorna whitelistedAt quando admin prenota
- [x] **Stato appuntamento**: "Cancellato dal paziente" invece di "Cancellato"

### 🔧 Sistema Note Paziente - 07/01/2026 (Sessione 14) ✅ COMPLETATO
- [x] **Fix orari area-personale definitivo**: rimuovo "Z" da stringhe ISO per evitare conversione UTC
- [x] **Blacklist migliorata**: conta solo cancellazioni di appuntamenti FUTURI + reset con whitelistedAt
- [x] **Documentazione blacklist**: sezione dettagliata in ARCHITETTURA.md
- [x] **Finestra note dopo prenotazione**: modal con note multiple + bottone "Aggiungi nota"
- [x] **API note**: `/api/agenda/appointments/[id]/notes` (PUT/GET)
- [x] **Modifica note da area-personale**: bottone "Aggiungi/Modifica note" + visualizzazione note esistenti
- [x] **Modal note area-personale**: stesso stile del modal agenda

### 🔧 FIX Orari e Card Paziente - 07/01/2026 (Sessione 13) ✅ COMPLETATO
- [x] **Fix orario +1h card agenda**: API ora usa `toLocalISOString()` per evitare conversione UTC
- [x] **Fix errore cancellazione card**: URL corretto `/api/agenda/appointments/{id}` (non query param)
- [x] **Refresh card dopo cancellazione**: `cache: 'no-store'` + `status=upcoming`
- [x] **Fix orari area-personale**: usa `parseISO()` invece di `new Date()`
- [x] **Orario visite cancellate**: aggiunto "ore HH:mm" accanto alla data
- [x] **Fix orario storico visite**: stesso fix con `parseDate()` helper
- [x] **File SERVIZIO MAIL**: documentazione completa sistema email + gitignore
- [x] **Avviso anti-spam**: rimossa frase "contatta studio", aggiunto avviso in area-personale

### 🔧 FIX Account Paziente - 07/01/2026 (Sessione 12) ✅ COMPLETATO
- [x] **Fix critico "Utente non trovato"**: JWT ora salva `dbId` (ID database) invece di `token.sub` (ID Cognito)
- [x] **Auto-whitelist admin**: quando admin crea appuntamento per paziente in blacklist, lo riporta in whitelist
- [x] **Auto-complete availability**: aggiunto anche in `/api/agenda/availability` (non solo admin)
- [x] **Regole paziente**: solo 60min, tipo forzato a FOLLOW_UP, 48h anticipo
- [x] **Card "Il tuo prossimo appuntamento"**: data/ora + bottoni "Vai alla data" (verde) e "Annulla" (rosso)
- [x] **Conferma cancellazione**: richiesta conferma con avviso anti-spam gentile

### 🔧 FIX Gestione Appuntamenti - 07/01/2026 (Sessione 11) ✅ COMPLETATO
- [x] **Fix orario UTC**: `toLocalISOString()` per evitare conversione UTC nell'API
- [x] **Fix tipo visita 120min**: mostrato come "Visita Approfondita" con badge rosa
- [x] **Fix orario modal modifica**: usa metodi locali invece di `toISOString()`
- [x] **Nuovi filtri temporali**: Domani, Prossima settimana, Prossimo mese
- [x] **Tooltip note in agenda**: note appuntamento visibili al passaggio mouse
- [x] **Scritta date centrata**: "2 febbraio - 8 febbraio 2026" centrata e grande
- [x] **Fix benvenuto paziente**: "Benvenuto/a NOME_PAZIENTE" in area personale
- [x] **Bottone pazienti**: da "Annulla (tracciato)" a "Cancella appuntamento"
- [x] **Rimosso menu**: "I miei appuntamenti" dal menu (ridondante)
- [x] **Blacklist prenotazione**: blocco alla prenotazione, non alla cancellazione
- [x] **Bottoni admin lista**: "Annullato dal paziente" e "Eliminato da me"
- [x] **Bottoni modal agenda**: "Annullato dal paziente" e "Eliminato da me"
- [x] **Fix admin inserimento**: validazione datetime più flessibile (senza Z)
- [x] **Modal semplificato**: rimossi dropdown orari e "Crea Blocco" per appuntamenti esistenti
- [x] **Tipo visita con durata**: 60min=Controllo, 90min=Prima Visita, 120min=Visita Approfondita
- [x] **Modifica tipo automatico**: reschedule aggiorna anche il campo `type`
- [x] **Auto-complete passati**: appuntamenti passati diventano COMPLETED automaticamente
- [x] **Asterisco note**: `*` accanto al nome se c'è nota in agenda
- [x] **COMPLETED visibili**: appuntamenti completati visibili in agenda con simbolo €
- [x] **Bottone "Non pagato"**: € rosso per riportare da COMPLETED a CONFIRMED

### 🔄 Migrazione UI a Cognito - 03/01/2026 (Sessione 9 - Parte 2) ✅ COMPLETATO
- [x] **Nuova pagina `/accedi`**:
  - Login unificato tramite Cognito hosted UI
  - Rimosse form email/password locali
  - UI/UX mantenuta con design system esistente
  - Gestione errori OAuth
- [x] **Nuova pagina `/registrati`**:
  - Redirect a Cognito per registrazione self-service
  - Info vantaggi registrazione
  - Flow: Registrati → Verifica Email → Prenota
- [x] **Backup vecchie pagine**:
  - Salvate in `DA CANCELLARE/` (non tracciato da git)

### 🔐 Architettura Due Pool Cognito - 03/01/2026 (Sessione 10) ✅ COMPLETATO
**IMPORTANTE: Pool separati per sicurezza e regole di accesso diverse!**

#### Pool ADMIN (dr-giammetta-master)
- **User Pool ID**: `eu-north-1_essCzamqc`
- **Client ID**: `70ks8clo1fo29shce517nc082v`
- **Scopo**: Staff medico con accesso completo al database
- **Permessi**: Può inserire visite nel passato, modificare tutto
- **Login**: `/admin/login` → usa provider `cognito-admin`

#### Pool PATIENTS (dr.giammetta-patients)
- **User Pool ID**: `eu-north-1_Xi3V8ZVoy`
- **Client ID**: `1ecaje9g00o1kpsl3jvmll456q`
- **Scopo**: Pazienti con regole prenotazione limitate
- **Permessi**: Regole prenotazione (es. 48h anticipo), solo visite future
- **Login**: `/accedi` → usa provider `cognito-patients`
- **Registrazione**: `/registrati` → Cognito self-service

#### Modifiche codice:
- [x] `next.config.js`: Nuove variabili `COGNITO_ADMIN_*` e `COGNITO_PATIENTS_*`
- [x] `auth.ts`: Due provider Cognito separati (`cognito-admin`, `cognito-patients`)
- [x] `/accedi`: Usa `signIn('cognito-patients')`
- [x] `/registrati`: Usa `signIn('cognito-patients')`
- [x] `/admin/login`: Nuova pagina per staff con `signIn('cognito-admin')`
- [x] `/admin`: Redirect a `/admin/login` se non autenticato
- [x] Debug endpoint aggiornato per nuove variabili

#### Variabili Amplify (aggiornate dall'utente):
```
COGNITO_ADMIN_CLIENT_ID=70ks8clo1fo29shce517nc082v
COGNITO_ADMIN_USER_POOL_ID=eu-north-1_essCzamqc
COGNITO_ADMIN_ISSUER=https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_essCzamqc

COGNITO_PATIENTS_CLIENT_ID=1ecaje9g00o1kpsl3jvmll456q
COGNITO_PATIENTS_USER_POOL_ID=eu-north-1_Xi3V8ZVoy
COGNITO_PATIENTS_ISSUER=https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Xi3V8ZVoy
```

---

## ✅ COMPLETATO (Pagine e Admin)

### Pagine Create
- [x] Pagina Chi Sono (/chi-sono)
  - Timeline carriera animata
  - Galleria certificazioni
  - Valori e filosofia
  - Hero section con statistiche
- [x] Pagina Servizi (/servizi)
  - Cards glassmorphism per ogni servizio
  - Process steps (come funziona)
  - FAQ interattive con accordion
- [x] Pagina Blog (/blog)
  - Hero con ricerca
  - Griglia articoli con filtri
  - Sidebar con categorie e tag
- [x] Pagina Contatti (/contatti)
  - Form contatto con validazione
  - Mappa placeholder (pronta per Google Maps)
  - Informazioni studio e orari
  - Pulsante WhatsApp

### Pannello Admin (/admin) ✅ AGGIORNATO 20/12/2024
- [x] Dashboard overview con statistiche REALI (API /api/admin/appointments)
- [x] Lista appuntamenti con filtri + azioni (conferma, cancella, completa, elimina)
- [x] Modifica note appuntamenti inline
- [x] Gestione whitelist utenti REALE (API /api/admin/patients)
- [x] Elimina pazienti dal database
- [x] Gestione blocchi orari REALE (API /api/admin/timeblocks)
- [x] Modal aggiungi/modifica blocchi orari
- [x] Navigazione a tab
- [x] RIMOSSI TUTTI I DATI MOCK - ora usa solo dati reali dal database

### SEO e Performance ✅
- [x] Sitemap dinamica
- [x] Robots.txt
- [x] Manifest.json per PWA

### Miglioramenti UI ✅
- [x] Loading skeletons per tutte le pagine
- [x] Error boundaries (error.tsx, global-error.tsx)
- [x] 404 e 500 pages custom (not-found.tsx)
- [x] Breadcrumbs con Schema.org
- [x] Scroll to top button
- [x] Cookie consent banner GDPR

### SEO & Performance ✅
- [x] Sitemap.xml dinamico
- [x] Robots.txt
- [x] Meta tags per tutte le pagine
- [x] Schema.org per tutte le pagine
- [x] Google Analytics 4 (pronto, serve API key)
- [ ] Open Graph images (da creare con designer)
- [ ] Lighthouse optimization
- [ ] Image optimization con placeholder blur

### Integrazioni ✅
- [ ] Google Maps per sede (placeholder pronto)
- [x] Google Analytics 4 (componente creato)
- [ ] Google Search Console (da configurare)
- [x] Schema.org per tutte le pagine
- [ ] CMS (Sanity o Contentful) per blog
- [x] NutriBot AI Assistant (OpenRouter + DeepSeek)

### Area Personale ✅ AGGIORNATO 20/12/2024
- [x] Dashboard Master (papa.danilo91tp@gmail.com, bernardogiammetta@gmail.com)
- [x] Dashboard Pazienti (whitelist)
- [x] Vista Guest (non autenticati)
- [x] Logica ruoli differenziati
- [x] Auto-upgrade account master al login (ADMIN + whitelist)
- [x] Menu mobile con link Area Personale e Appuntamenti
- [x] **4 account master** (papa.danilo91tp, bernardogiammetta, dr.giammettabernardo, accomodationlapulena)
- [x] Precaricamento risorse durante splash screen
- [x] Favicon dinamica con bordi arrotondati (icon.tsx)
- [x] API gestione pazienti completa (/api/admin/patients)

### Testing ✅
- [x] Unit tests per utility functions (jest.config.js, utils.test.ts)
- [x] Configurazione Jest con React Testing Library
- [ ] Integration tests per API
- [ ] E2E tests con Playwright
- [ ] Test responsività mobile

### Utilities e Hooks ✅ AGGIORNATO 24/12/2024
- [x] **api-utils.ts**: retry logic, rate limiting, error handling
- [x] **validations.ts**: schemi Zod centralizzati
- [x] **constants.ts**: routes, roles, limiti, messaggi
- [x] **security.ts**: sanitizzazione input, rate limit, auth helpers
- [x] **error-handler.ts**: gestione centralizzata errori con ApiError
- [x] **db-utils.ts**: retry DB, transazioni, health check, paginazione
- [x] **cache.ts**: sistema caching in-memory con TTL
- [x] **form-validation.ts**: validazione avanzata (CF, P.IVA, password strength)
- [x] **italian-holidays.ts**: feste italiane + Pasqua variabile
- [x] **useApi hook**: fetch con cache e retry
- [x] **useDebounce hook**: debounce valori e callback
- [x] **useThrottle hook**: throttle funzioni
- [x] **useLocalStorage hook**: persistenza stato
- [x] **useMediaQuery hook**: responsive design
- [x] **useClickOutside hook**: detect click fuori elemento
- [x] **useIntersectionObserver hook**: lazy loading
- [x] **usePagination hook**: gestione paginazione
- [x] **Middleware sicurezza**: security headers (XSS, clickjacking, HSTS)

### Deploy ✅
- [x] Setup Vercel (vercel.json)
- [x] CI/CD con GitHub Actions (.github/workflows/ci.yml)
- [ ] Configurazione dominio
- [ ] SSL/HTTPS (automatico con Vercel)
- [ ] Backup automatico database

---

## 🐛 BUG NOTI

### Database AWS (IN RISOLUZIONE)
- CloudShell non può raggiungere Aurora Serverless v2
- Soluzione: usare EC2 temporaneo nella stessa VPC per eseguire `prisma db push`

### NutriBot
- Cambiato modello a `deepseek/deepseek-r1-0528:free` - da testare dopo redeploy

---

## ⚠️ LIMITI PRODUZIONE (DA CONFIGURARE)

### AWS SES (Simple Email Service)
- **Stato attuale**: Sandbox Mode (limite 200 email/giorno)
- **Azione richiesta**: Richiedere uscita da Sandbox per produzione
- **Come fare**:
  1. Accedere a AWS Console > SES > Account Dashboard
  2. Cliccare "Request production access"
  3. Compilare form con use case (transactional emails)
  4. Attendere approvazione (24-48h)
- **Limite produzione**: 50.000 email/giorno (dopo approvazione)
- **Costo**: ~$0.10 per 1000 email

### Rate Limiting API
- `/api/contact`: 5 richieste/minuto per IP
- `/api/auth/register`: 3 richieste/minuto per IP
- `/api/agenda/appointments`: 10 richieste/minuto per utente
- **Nota**: Aumentare in base al traffico reale

### Database RDS
- **Istanza**: db.t3.medium (2 vCPU, 4GB RAM)
- **Connessioni max**: 100 simultanee
- **Azione**: Monitorare e scalare se necessario

---

## 💡 IDEE FUTURE (DA NON FARE)

- [ ] Sistema recensioni integrato
- [x] Chat bot per FAQ (NutriBot implementato!)
- [ ] App mobile (React Native)
- [ ] Integrazione con calendari esterni (Google Calendar sync)
- [ ] Sistema di notifiche push
- [ ] Dark mode toggle
- [ ] Multilingua (IT/EN)
- [ ] Sistema di pagamento online per prenotazioni
- [ ] Video consulenze online
- [x] Area riservata pazienti con storico visite

---

## 📊 PRIORITÀ (AGGIORNATO)

### ✅ Completato
1. ~~Installare dipendenze e testare build~~
2. ~~Pagina Chi Sono~~
3. ~~Pagina Contatti~~
4. ~~Pannello Admin base~~
5. ~~Pagina Servizi~~
6. ~~Sistema Blog~~
7. ~~SEO optimization~~
8. ~~Analytics~~

### Da Fare (Optional)
1. Open Graph images (richiede designer)
2. Lighthouse optimization
3. Testing con Playwright
4. Deploy su Vercel/AWS
5. Dark mode
6. Multilingua

---

*Ultimo aggiornamento: 10 Gennaio 2026 - 11:00*
