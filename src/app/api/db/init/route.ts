// =============================================================================
// API ENDPOINT INIZIALIZZAZIONE DATABASE - DOTT. BERNARDO GIAMMETTA
// Endpoint per verificare/inizializzare la connessione al database
// PROTETTO: Solo admin possono accedere
// =============================================================================

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isMasterAccount } from '@/lib/config';
import { db } from '@/lib/db';

// Forza rendering dinamico
export const dynamic = 'force-dynamic';

// =============================================================================
// GET - Verifica stato database
// =============================================================================

export async function GET() {
  // SICUREZZA: Solo admin può vedere stato database
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isMasterAccount(session.user.email)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  
  try {
    // Tenta una query semplice per verificare la connessione
    const result = await db.$queryRaw`SELECT 1 as connected`;
    
    // Conta gli utenti per verificare che le tabelle esistano
    const userCount = await db.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connesso e funzionante',
      stats: {
        connected: true,
        userCount,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Database init error:', error);
    
    // Identifica il tipo di errore
    let errorType = 'unknown';
    let suggestion = '';
    
    if (error.code === 'P1001') {
      errorType = 'connection_failed';
      suggestion = 'Verifica che DATABASE_URL sia corretto e che il database sia raggiungibile';
    } else if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      errorType = 'tables_missing';
      suggestion = 'Le tabelle non esistono. Esegui prisma db push da CloudShell o EC2';
    } else if (error.code === 'P1000') {
      errorType = 'auth_failed';
      suggestion = 'Credenziali database non valide. Verifica username e password';
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType,
      suggestion,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// =============================================================================
// POST - Crea le tabelle nel database
// =============================================================================

export async function POST() {
  // SICUREZZA: Solo admin può inizializzare database
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isMasterAccount(session.user.email)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  
  try {
    // Crea le tabelle usando raw SQL
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "image" TEXT,
        "phone" TEXT,
        "isWhitelisted" BOOLEAN NOT NULL DEFAULT false,
        "whitelistedAt" TIMESTAMP(3),
        "role" TEXT NOT NULL DEFAULT 'PATIENT',
        "emailVerified" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastVisitAt" TIMESTAMP(3)
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT NOT NULL PRIMARY KEY,
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
        "session_state" TEXT
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "sessionToken" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "expires" TIMESTAMP(3) NOT NULL
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Appointment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "startTime" TIMESTAMP(3) NOT NULL,
        "duration" INTEGER NOT NULL DEFAULT 60,
        "type" TEXT NOT NULL DEFAULT 'FOLLOW_UP',
        "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "cancelledAt" TIMESTAMP(3)
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "TimeBlock" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "dayOfWeek" INTEGER,
        "startTime" TEXT NOT NULL,
        "endTime" TEXT NOT NULL,
        "specificDate" TIMESTAMP(3),
        "note" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "EmailLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT,
        "toEmail" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "templateId" INTEGER NOT NULL,
        "appointmentId" TEXT,
        "status" TEXT NOT NULL DEFAULT 'SENT',
        "subject" TEXT NOT NULL,
        "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "BlogPost" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ContactMessage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Inserisci account master
    await db.$executeRaw`
      INSERT INTO "User" ("id", "email", "name", "isWhitelisted", "role", "createdAt", "updatedAt")
      VALUES ('master-danilo', 'papa.danilo91tp@gmail.com', 'Danilo Papa', true, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("email") DO UPDATE SET "isWhitelisted" = true, "role" = 'ADMIN'
    `;

    await db.$executeRaw`
      INSERT INTO "User" ("id", "email", "name", "isWhitelisted", "role", "createdAt", "updatedAt")
      VALUES ('master-bernardo', 'bernardogiammetta@gmail.com', 'Dott. Bernardo Giammetta', true, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("email") DO UPDATE SET "isWhitelisted" = true, "role" = 'ADMIN'
    `;

    return NextResponse.json({
      success: true,
      message: 'Database inizializzato con successo! Tabelle create.',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Database init POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Verifica che DATABASE_URL sia configurato correttamente',
    }, { status: 500 });
  }
}
