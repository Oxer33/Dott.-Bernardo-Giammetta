-- =============================================================================
-- SQL SCHEMA - DOTT. BERNARDO GIAMMETTA
-- Esegui questo script su AWS CloudShell con psql per creare le tabelle
-- =============================================================================
-- 
-- ISTRUZIONI:
-- 1. Apri AWS CloudShell
-- 2. Installa psql: sudo yum install postgresql15 -y
-- 3. Connettiti: psql "postgresql://postgres:PASSWORD@database-agenda.cluster-xxx.eu-north-1.rds.amazonaws.com:5432/postgres"
-- 4. Copia e incolla questo script
-- 5. Digita \q per uscire
--
-- NOTA: Sostituisci PASSWORD con la password URL-encoded
-- =============================================================================

-- Tabella User (utenti e pazienti)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "isWhitelisted" BOOLEAN NOT NULL DEFAULT false,
    "whitelistedAt" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVisitAt" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Tabella Account (NextAuth OAuth)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Tabella Session (NextAuth sessioni)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");

-- Tabella VerificationToken (NextAuth)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Tabella Appointment (appuntamenti)
CREATE TABLE IF NOT EXISTS "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "type" TEXT NOT NULL DEFAULT 'FOLLOW_UP',
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),
    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Appointment_startTime_idx" ON "Appointment"("startTime");
CREATE INDEX IF NOT EXISTS "Appointment_userId_idx" ON "Appointment"("userId");
CREATE INDEX IF NOT EXISTS "Appointment_status_idx" ON "Appointment"("status");

-- Tabella TimeBlock (blocchi orari del dottore)
CREATE TABLE IF NOT EXISTS "TimeBlock" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "specificDate" TIMESTAMP(3),
    "note" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimeBlock_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "TimeBlock_type_idx" ON "TimeBlock"("type");
CREATE INDEX IF NOT EXISTS "TimeBlock_dayOfWeek_idx" ON "TimeBlock"("dayOfWeek");
CREATE INDEX IF NOT EXISTS "TimeBlock_specificDate_idx" ON "TimeBlock"("specificDate");

-- Tabella EmailLog (log email inviate)
CREATE TABLE IF NOT EXISTS "EmailLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "toEmail" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "appointmentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "subject" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "EmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "EmailLog_userId_idx" ON "EmailLog"("userId");
CREATE INDEX IF NOT EXISTS "EmailLog_type_idx" ON "EmailLog"("type");
CREATE INDEX IF NOT EXISTS "EmailLog_sentAt_idx" ON "EmailLog"("sentAt");

-- Tabella BlogPost (articoli blog)
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "readingTime" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "BlogPost_slug_idx" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "BlogPost_published_idx" ON "BlogPost"("published");
CREATE INDEX IF NOT EXISTS "BlogPost_category_idx" ON "BlogPost"("category");

-- Tabella ContactMessage (messaggi contatto)
CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContactMessage_read_idx" ON "ContactMessage"("read");
CREATE INDEX IF NOT EXISTS "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- =============================================================================
-- VERIFICA: Controlla che tutte le tabelle siano state create
-- =============================================================================
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
