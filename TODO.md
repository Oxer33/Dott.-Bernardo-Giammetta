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
- [x] CTASection finale

### Sistema Autenticazione
- [x] NextAuth configurazione
- [x] Google OAuth provider
- [x] Prisma Adapter per sessioni
- [x] Estensione tipi per ruoli e whitelist
- [x] API route [...nextauth]

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

### Sistema Email
- [x] Configurazione Resend
- [x] Template conferma prenotazione (10 varianti)
- [x] Template cancellazione (varianti)
- [x] Template reminder 1 settimana
- [x] Template reminder 1 giorno
- [x] Template followup 25 giorni
- [x] Template urgente 60 giorni
- [x] API cron per reminders automatici

### Documentazione
- [x] ARCHITETTURA.md
- [x] TODO.md

---

## 🔄 IN CORSO

### Installazione e Test ✅ COMPLETATO
- [x] npm install dipendenze
- [x] prisma generate
- [x] prisma db push
- [x] Test build dev
- [x] Fix errori (font, resend null checks, tipi)
- [x] Server avviato su http://localhost:3000

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

### Pannello Admin (/admin) ✅
- [x] Dashboard overview con statistiche
- [x] Lista appuntamenti con filtri
- [x] Gestione whitelist utenti
- [x] Gestione blocchi orari (ricorrenti e occasionali)
- [x] Navigazione a tab

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

### Area Personale ✅
- [x] Dashboard Master (accomodationlapulena@gmail.com)
- [x] Dashboard Pazienti (whitelist)
- [x] Vista Guest (non autenticati)
- [x] Logica ruoli differenziati

### Testing ✅
- [x] Unit tests per utility functions (jest.config.js, utils.test.ts)
- [x] Configurazione Jest con React Testing Library
- [ ] Integration tests per API
- [ ] E2E tests con Playwright
- [ ] Test responsività mobile

### Deploy ✅
- [x] Setup Vercel (vercel.json)
- [x] CI/CD con GitHub Actions (.github/workflows/ci.yml)
- [ ] Configurazione dominio
- [ ] SSL/HTTPS (automatico con Vercel)
- [ ] Backup automatico database

---

## 🐛 BUG NOTI

*Nessun bug noto al momento - dipendenze non ancora installate*

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

*Ultimo aggiornamento: 19 Dicembre 2026*
