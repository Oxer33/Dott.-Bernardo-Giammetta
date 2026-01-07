# 🏗️ ARCHITETTURA PROGETTO - Dott. Bernardo Giammetta

## 📋 Panoramica

Sito web professionale per il Dott. Bernardo Giammetta, Biologo Nutrizionista.
Design ultra-moderno ispirato a metodo-ongaro.com con sistema di prenotazione avanzato.

---

## 🛠️ Stack Tecnologico

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| **Next.js** | 14+ | Framework React con App Router |
| **React** | 18+ | UI Library |
| **TypeScript** | 5+ | Type Safety |
| **Tailwind CSS** | 3.4+ | Styling utility-first |
| **Framer Motion** | 11+ | Animazioni fluide |
| **Prisma** | 5+ | ORM per database (PostgreSQL su AWS RDS) |
| **NextAuth** | 4+ | Autenticazione OAuth |
| **Resend** | 3+ | Email transazionali |
| **date-fns** | 3+ | Manipolazione date |
| **Zod** | 3+ | Validazione schema |

---

## 📁 Struttura Cartelle

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── agenda/        # Gestione appuntamenti
│   │   │   ├── availability/   # GET disponibilità
│   │   │   └── appointments/   # CRUD appuntamenti
│   │   ├── cron/          # Job schedulati (reminders)
│   │   └── db/            # Endpoint diagnosi database
│   │       └── init/      # GET verifica connessione DB
│   ├── agenda/            # Pagina prenotazioni
│   ├── privacy/           # Privacy Policy
│   ├── cookie/            # Cookie Policy
│   ├── termini/           # Termini e Condizioni
│   ├── chi-sono/          # Pagina about (TODO)
│   ├── servizi/           # Pagina servizi (TODO)
│   ├── blog/              # Sistema blog (TODO)
│   ├── contatti/          # Form contatti (TODO)
│   ├── admin/             # Pannello admin (TODO)
│   ├── layout.tsx         # Root layout con providers
│   ├── page.tsx           # Homepage
│   └── globals.css        # Stili globali
│
├── components/            # Componenti React
│   ├── home/              # Componenti homepage
│   │   ├── HeroSection.tsx
│   │   ├── AboutPreview.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── StatsCounter.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── BlogPreview.tsx
│   │   └── CTASection.tsx
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── agenda/            # Componenti agenda
│   │   └── AgendaCalendar.tsx
│   ├── ui/                # Componenti UI riutilizzabili (20+)
│   │   ├── index.ts           # Export centralizzato
│   │   ├── Button.tsx         # Pulsanti con varianti
│   │   ├── FormInput.tsx      # Input, Textarea, Checkbox
│   │   ├── Select.tsx         # Select, RadioGroup
│   │   ├── SearchInput.tsx    # Ricerca con debounce
│   │   ├── Modal.tsx          # Modal, Drawer
│   │   ├── Tabs.tsx           # Tabs con varianti
│   │   ├── Tooltip.tsx        # Tooltip, Badge, StatusDot
│   │   ├── Card.tsx           # Card, StatCard, ProfileCard
│   │   ├── Accordion.tsx      # Accordion, FAQ
│   │   ├── Pagination.tsx     # Paginazione con hook
│   │   ├── LoadingSpinner.tsx # Spinner, Skeleton
│   │   ├── ErrorMessage.tsx   # Errori, EmptyState
│   │   ├── Toast.tsx          # Notifiche toast
│   │   ├── ConfirmDialog.tsx  # Dialog conferma
│   │   ├── OptimizedImage.tsx # Immagini ottimizzate
│   │   └── Toaster.tsx        # Toast container
│   └── providers/         # Context providers
│       └── Providers.tsx
│
├── lib/                   # Utilities e configurazioni
│   ├── utils.ts           # Funzioni helper generiche
│   ├── db.ts              # Prisma client singleton
│   ├── db-utils.ts        # Retry DB, transazioni, health check
│   ├── auth.ts            # NextAuth configurazione
│   ├── agenda.ts          # Logica gestione agenda
│   ├── italian-holidays.ts # Feste italiane + Pasqua
│   ├── email.ts           # Sistema email con template
│   ├── nodemailer.ts      # SMTP Aruba per email
│   ├── aws-ses.ts         # AWS SES alternativo
│   ├── api-utils.ts       # Retry, rate limit, error handling
│   ├── security.ts        # Sanitizzazione, rate limit, auth
│   ├── error-handler.ts   # Gestione centralizzata errori
│   ├── cache.ts           # Sistema caching in-memory
│   ├── validations.ts     # Schemi Zod centralizzati
│   ├── form-validation.ts # Validazione form avanzata (CF, P.IVA)
│   ├── constants.ts       # Routes, roles, limiti, messaggi
│   ├── config.ts          # Configurazione app e master accounts
│   └── nutribot.ts        # NutriBot AI (OpenRouter + DeepSeek)
│
├── hooks/                 # Custom React Hooks
│   ├── index.ts           # Export centralizzato
│   ├── useApi.ts          # Fetch con cache e retry
│   └── useDebounce.ts     # Debounce, throttle, localStorage, mediaQuery
│
scripts/
└── setup-database.js      # Script auto-setup DB per build Amplify
│
└── types/                 # TypeScript types (TODO)
    └── index.ts

prisma/
└── schema.prisma          # Database schema

public/                    # Asset statici (TODO)
├── images/
└── fonts/
```

---

## 🗄️ Database Schema

### Modelli Principali

1. **User** - Utenti (pazienti e admin)
   - Autenticazione Google OAuth
   - Flag whitelist per prenotazioni
   - Ruolo (ADMIN/PATIENT)

2. **Appointment** - Appuntamenti
   - Collegato a User
   - Durata: 60min (controllo) / 90min (prima visita)
   - Stati: CONFIRMED, CANCELLED, COMPLETED, NO_SHOW

3. **TimeBlock** - Blocchi orari
   - RECURRING: impegni settimanali ricorrenti
   - OCCASIONAL: impegni una tantum
   - Note private per admin

4. **EmailLog** - Log email inviate
   - Tracking template usati
   - Evita duplicati

5. **BlogPost** - Articoli blog (preparato per CMS)

6. **ContactMessage** - Messaggi form contatti

---

## 🔐 Sistema Autenticazione

- **Provider**: Google OAuth via NextAuth
- **Sessioni**: Database-backed (Prisma Adapter)
- **Whitelist**: Solo utenti approvati possono prenotare
- **Ruoli**: ADMIN (dottore) / PATIENT (paziente)

### Flusso Autenticazione:
1. Utente clicca "Accedi con Google"
2. NextAuth gestisce OAuth flow
3. Account creato/aggiornato in database
4. Sessione salvata con dati custom (role, whitelist)

---

## 📅 Sistema Agenda

### Regole Business:
- **Fasce orarie**: 30 minuti ciascuna
- **Prima visita**: 90 min (3 slot consecutivi)
- **Visita controllo**: 60 min (2 slot consecutivi)
- **Preavviso minimo**: 48 ore
- **Limite prenotazioni**: 1 per utente alla volta
- **Orari studio**: 08:00 - 20:00

### Tipi di Blocco:
1. **Ricorrente**: stesso orario ogni settimana (es. ogni mercoledì 10-12)
2. **Occasionale**: specifica data e ora (es. 15 gennaio 14-16)

### Privacy:
- Vista pubblica: mostra slot liberi/occupati senza nomi
- Vista admin: mostra dettagli pazienti e note

---

## 📧 Sistema Email

### Template Variati (50+ varianti)
Per sembrare scritte a mano, ogni tipo di email ha multiple varianti:

1. **Conferma prenotazione** (10 varianti)
2. **Cancellazione** (10 varianti)
3. **Reminder 1 settimana** (10 varianti)
4. **Reminder 1 giorno** (10 varianti)
5. **Followup 25 giorni** (10 varianti)
6. **Urgente 60 giorni** (10 varianti)

### Cron Job:
- Endpoint: `/api/cron/reminders`
- Da chiamare giornalmente (Vercel Cron o esterno)
- Invia reminder automatici basati su date appuntamenti

---

## 🚫 Sistema Blacklist Anti-Spam

### Logica di Funzionamento:
Il sistema previene abusi nelle prenotazioni contando le cancellazioni di appuntamenti **futuri**.

### Regole:
1. **Conteggio**: Solo cancellazioni di appuntamenti che erano FUTURI al momento della cancellazione
   - Verifica: `startTime > cancelledAt`
   - NON conta cancellazioni di appuntamenti già passati

2. **Finestra temporale**: Ultimi 30 giorni dalla data della cancellazione

3. **Reset contatore**: Il contatore si AZZERA quando:
   - Admin/Master crea un appuntamento per il paziente
   - Viene aggiornato `whitelistedAt` con la data corrente
   - Le cancellazioni precedenti a `whitelistedAt` vengono ignorate

4. **Limite**: 3 cancellazioni di appuntamenti futuri in 30 giorni = BLOCCO
   - Il paziente deve contattare lo studio per prenotare
   - Messaggio: "Hai raggiunto il limite di 3 prenotazioni cancellate..."

### Flusso:
```
[Paziente prenota] 
    ↓
[Sistema controlla cancellazioni recenti]
    ↓
[Query: cancellazioni dopo MAX(whitelistedAt, 30gg fa)]
    ↓
[Filtra: solo dove startTime > cancelledAt]
    ↓
[Se count >= 3 → BLOCCO]
[Se count < 3 → OK prenotazione]
```

### Codice chiave: `src/app/api/agenda/appointments/route.ts`

---

## 🎨 Design System

### Palette Colori:
```css
--sage-500: #86A788   /* Verde salvia principale */
--cream-50: #FFFDEC   /* Crema sfondo */
--blush-200: #FFE2E2  /* Rosa tenue */
--rose-300: #FFCFCF   /* Rosa accento */
```

### Typography:
- **Display**: Playfair Display (headings)
- **Body**: Inter (testo)
- **Accent**: Clash Display (per variazioni)

### Effetti:
- Glassmorphism per cards e navbar
- Gradienti sottili
- Ombre morbide (shadow-soft)
- Animazioni Framer Motion

---

## 🔄 Flusso Dati

```
[Client] 
    ↓ fetch API
[API Route]
    ↓ validate con Zod
[Lib functions (agenda.ts, email.ts)]
    ↓ query
[Prisma ORM]
    ↓
[Database SQLite/PostgreSQL]
```

---

## 🚀 Deploy

### Sviluppo Locale:
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Produzione (AWS Amplify):
```bash
# Variabili ambiente richieste su Amplify:
DATABASE_URL=postgresql://...  # AWS RDS Aurora PostgreSQL
OPENROUTER_API_KEY=sk-or-v1-...  # Per NutriBot
NEXTAUTH_SECRET=...  # Chiave segreta sessioni
NEXTAUTH_URL=https://...amplifyapp.com
GOOGLE_CLIENT_ID=...  # OAuth
GOOGLE_CLIENT_SECRET=...  # OAuth
```

### Creazione Tabelle Database:
```bash
# Da EC2 nella stessa VPC del database:
export DATABASE_URL="postgresql://..."
npx prisma db push
```

---

## ⚠️ Note Importanti

1. **Variabili Ambiente**: Copiare `.env.example` in `.env.local`
2. **Database**: SQLite in dev, PostgreSQL in prod
3. **OAuth**: Configurare Google Cloud Console per credenziali
4. **Email**: Configurare dominio su Resend
5. **Cron**: Configurare job esterno per reminders

---

## 👤 Ruoli e Permessi

| Azione | PATIENT | ADMIN |
|--------|---------|-------|
| Vedere agenda pubblica | ✅ | ✅ |
| Prenotare (se whitelist) | ✅ | ✅ |
| Cancellare proprio appuntamento | ✅ | ✅ |
| Vedere tutti gli appuntamenti | ❌ | ✅ |
| Modificare appuntamenti | ❌ | ✅ |
| Gestire blocchi orari | ❌ | ✅ |
| Gestire whitelist | ❌ | ✅ |
| Creare prima visita | ❌ | ✅ |

---

---

## 🧩 Componenti UI (Aggiornato 23/12/2024)

### Form Components
| Componente | Descrizione |
|------------|-------------|
| `FormInput` | Input con validazione, password toggle, icone |
| `FormTextarea` | Textarea con contatore caratteri |
| `FormCheckbox` | Checkbox con label e descrizione |
| `Select` | Dropdown con placeholder e validazione |
| `RadioGroup` | Gruppo radio con opzioni |
| `SearchInput` | Input ricerca con debounce e suggestions |

### Feedback Components
| Componente | Descrizione |
|------------|-------------|
| `LoadingSpinner` | Varianti: default, leaf, dots, pulse |
| `Skeleton` | Skeleton loaders per card, table, page |
| `ErrorMessage` | Errori con varianti e retry |
| `Toast` | Sistema notifiche con provider |
| `ConfirmDialog` | Dialog conferma azioni distruttive |

### Layout Components
| Componente | Descrizione |
|------------|-------------|
| `Card` | Varianti: default, outlined, elevated, glass |
| `StatCard` | Card per statistiche con trend |
| `ProfileCard` | Card profilo con avatar |
| `Modal` | Modale con varianti dimensione |
| `Drawer` | Modale laterale (left/right) |
| `Tabs` | Varianti: default, pills, underline |
| `Accordion` | Collapsible con animazioni |

### Data Display
| Componente | Descrizione |
|------------|-------------|
| `Pagination` | Paginazione con hook usePagination |
| `Tooltip` | Tooltip con posizioni e delay |
| `Badge` | Etichette colorate |
| `StatusDot` | Indicatore stato online/offline |
| `OptimizedImage` | Immagini con blur placeholder |

---

## 🪝 Custom Hooks

| Hook | Descrizione |
|------|-------------|
| `useApi` | Fetch con cache, retry e gestione errori |
| `useMutation` | Mutation con invalidazione cache |
| `useDebounce` | Debounce valori |
| `useDebounceCallback` | Debounce funzioni |
| `useThrottle` | Throttle funzioni |
| `useLocalStorage` | Persistenza stato in localStorage |
| `useMediaQuery` | Responsive design (isMobile, isTablet, isDesktop) |
| `useClickOutside` | Detect click fuori elemento |
| `useIntersectionObserver` | Lazy loading e animazioni scroll |
| `usePagination` | Gestione paginazione |

---

*Ultimo aggiornamento: 07 Gennaio 2026 - 14:55*
