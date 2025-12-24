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

### UI/UX Miglioramenti ✅ AGGIORNATO 23/12/2024
- [x] Splash screen durata 4s (aumentato 1.5s)
- [x] **PWA Install Prompt** per mobile/tablet
- [x] **MasterBookingModal** per account medico (blocchi, durata, pazienti)
- [x] **Feste italiane** escluse dall'agenda (domeniche, Pasqua, patrono Bologna)
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
- Le tabelle non sono ancora create nel database

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

## 💡 IDEE FUTURE

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

*Ultimo aggiornamento: 24 Dicembre 2024 - 20:30*
