// =============================================================================
// API: APPUNTAMENTI - DOTT. BERNARDO GIAMMETTA
// Endpoint per creare e gestire appuntamenti
// POST /api/agenda/appointments - Crea appuntamento
// GET /api/agenda/appointments - Lista appuntamenti utente
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAppointment, canUserBook, VISIT_DURATION } from '@/lib/agenda';
import { parseISO, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { z } from 'zod';
import { sendBookingConfirmationToPatient, sendBookingNotificationToDoctor } from '@/lib/nodemailer';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// SCHEMA VALIDAZIONE
// =============================================================================

const createAppointmentSchema = z.object({
  startTime: z.string().datetime(),
  type: z.enum(['FIRST_VISIT', 'FOLLOW_UP']).default('FOLLOW_UP'),
  notes: z.string().optional(),
  // Per admin: può prenotare per un altro utente
  userId: z.string().optional(),
});

// =============================================================================
// POST - Crea nuovo appuntamento
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticazione
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Devi effettuare il login per prenotare' },
        { status: 401 }
      );
    }
    
    // Parse e valida body
    const body = await request.json();
    const validationResult = createAppointmentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dati non validi',
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }
    
    const { startTime, type, notes, userId: targetUserId } = validationResult.data;
    
    // Determina per chi è la prenotazione
    let bookingUserId = session.user.id;
    
    // Se admin/master e specifica un userId, prenota per quell'utente
    // CRITICO: Master deve poter prenotare per qualsiasi paziente
    const isMaster = isMasterAccount(session.user.email);
    
    // DEBUG: Log per verificare stato master
    console.log('[MASTER DEBUG] Session email:', session.user.email);
    console.log('[MASTER DEBUG] isMaster result:', isMaster);
    console.log('[MASTER DEBUG] targetUserId:', targetUserId);
    console.log('[MASTER DEBUG] startTime:', startTime);
    if (targetUserId && (session.user.role === 'ADMIN' || isMaster)) {
      bookingUserId = targetUserId;
    }
    
    // Recupera utente dal database
    const bookingUser = await db.user.findUnique({
      where: { id: bookingUserId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isWhitelisted: true,
        emailVerified: true,
        maxActiveBookings: true,
      },
    });

    if (!bookingUser) {
      return NextResponse.json(
        { success: false, error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Verifica che l'utente sia whitelistato (o sia admin/master che prenota)
    // PUNTO 9: Master può sempre prenotare per qualsiasi paziente (anche in attesa)
    const isAdmin = session.user.role === 'ADMIN' || isMasterAccount(session.user.email);
    
    // Se non è admin E il paziente per cui si prenota non è whitelisted, blocca
    // Ma se è admin, può prenotare per chiunque
    if (!isAdmin && !bookingUser.isWhitelisted) {
      return NextResponse.json(
        { success: false, error: 'Il tuo account non è ancora abilitato alle prenotazioni. Attendi l\'approvazione.' },
        { status: 403 }
      );
    }

    // Verifica email verificata (per utenti con password)
    // Skip per utenti OAuth (hanno emailVerified = null ma sono OK)
    // Commento: per ora non blocchiamo, ma segnaliamo

    // Conta prenotazioni attive dell'utente
    const activeBookingsCount = await db.appointment.count({
      where: {
        userId: bookingUserId,
        status: 'CONFIRMED',
        startTime: { gte: new Date() },
      },
    });

    // Punto 7-8: Master ha libertà totale MA deve evitare duplicati accidentali
    // Verifica che non ci sia già un appuntamento per questo paziente alla stessa data/ora
    const existingAppointmentSameTime = await db.appointment.findFirst({
      where: {
        userId: bookingUserId,
        startTime: parseISO(startTime),
        status: { not: 'CANCELLED' },
      },
    });
    
    if (existingAppointmentSameTime) {
      return NextResponse.json(
        { success: false, error: 'Questo paziente ha già un appuntamento a questo orario.' },
        { status: 400 }
      );
    }

    // Verifica limite prenotazioni (default 1 per whitelistati, illimitato per admin)
    // Master può inserire più appuntamenti per lo stesso paziente (es. visite future)
    const maxBookings = isAdmin ? 999 : (bookingUser.maxActiveBookings || 1);
    if (activeBookingsCount >= maxBookings) {
      return NextResponse.json(
        { success: false, error: `Hai già ${activeBookingsCount} prenotazione/i attiva/e. Puoi prenotare una nuova visita solo dopo aver completato quella esistente.` },
        { status: 400 }
      );
    }

    // Verifica possibilità di prenotare (slot libero, orario valido, ecc.)
    const duration = type === 'FIRST_VISIT' 
      ? VISIT_DURATION.FIRST_VISIT 
      : VISIT_DURATION.FOLLOW_UP;
    
    // Passa l'email del chiamante per verifiche master (punti 1, 8, 9)
    const canBook = await canUserBook(
      bookingUserId, 
      parseISO(startTime), 
      duration,
      session.user.email || undefined
    );
    
    if (!canBook.canBook) {
      return NextResponse.json(
        { success: false, error: canBook.reason },
        { status: 400 }
      );
    }
    
    // Log warning se paziente non in whitelist (solo avviso, non blocco)
    if (canBook.warning) {
      console.log(`[BOOKING WARNING] ${canBook.warning} - Paziente: ${bookingUser.email}`);
    }
    
    // Crea appuntamento
    const appointment = await createAppointment(
      bookingUserId,
      parseISO(startTime),
      type,
      notes
    );
    
    // Formatta data e ora per email
    const appointmentDate = format(parseISO(startTime), 'EEEE d MMMM yyyy', { locale: it });
    const appointmentTime = format(parseISO(startTime), 'HH:mm');
    const appointmentType = type === 'FIRST_VISIT' ? 'Prima Visita (90 min)' : 'Visita di Controllo (60 min)';

    // Invia email di conferma al paziente
    await sendBookingConfirmationToPatient({
      patientEmail: bookingUser.email,
      patientName: bookingUser.name || 'Paziente',
      appointmentDate,
      appointmentTime,
      appointmentType,
    });

    // Invia notifica al dottore
    await sendBookingNotificationToDoctor({
      patientName: bookingUser.name || 'Paziente',
      patientEmail: bookingUser.email,
      patientPhone: bookingUser.phone || undefined,
      appointmentDate,
      appointmentTime,
      appointmentType,
    });
    
    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appuntamento prenotato con successo! Ti abbiamo inviato un\'email di conferma.',
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Errore creazione appuntamento:', error);
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore nella prenotazione' 
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Lista appuntamenti utente
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Verifica autenticazione
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'upcoming', 'past', 'all'
    const includeAll = searchParams.get('all') === 'true'; // Solo admin
    
    // Costruisci query
    const now = new Date();
    let whereClause: any = {};
    
    // Se admin e richiede tutti
    if (session.user.role === 'ADMIN' && includeAll) {
      // Nessun filtro utente
    } else {
      whereClause.userId = session.user.id;
    }
    
    // Filtro per stato temporale
    if (status === 'upcoming') {
      whereClause.startTime = { gte: now };
      whereClause.status = 'CONFIRMED';
    } else if (status === 'past') {
      whereClause.startTime = { lt: now };
    }
    
    const appointments = await db.appointment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        startTime: status === 'past' ? 'desc' : 'asc',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: appointments,
    });
    
  } catch (error) {
    console.error('Errore recupero appuntamenti:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero degli appuntamenti' },
      { status: 500 }
    );
  }
}
