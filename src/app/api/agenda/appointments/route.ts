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

// Helper per formattare data senza conversione UTC
// Restituisce formato ISO locale (senza Z finale)
function toLocalISOString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
import { it } from 'date-fns/locale';
import { z } from 'zod';
import { sendBookingConfirmationToPatient, sendBookingNotificationToDoctor } from '@/lib/nodemailer';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// SCHEMA VALIDAZIONE
// =============================================================================

const createAppointmentSchema = z.object({
  // Accetta sia formato ISO con Z che senza (es. 2024-01-06T11:00:00 o 2024-01-06T11:00:00.000Z)
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Formato data/ora non valido',
  }),
  type: z.enum(['FIRST_VISIT', 'FOLLOW_UP']).default('FOLLOW_UP'),
  notes: z.string().optional(),
  // Per admin: può prenotare per un altro utente
  userId: z.string().optional(),
  // Durata personalizzata (60, 90, 120 minuti) - se non specificata usa default dal tipo
  duration: z.number().min(30).max(180).optional(),
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
    
    const { startTime, type, notes, userId: targetUserId, duration: customDuration } = validationResult.data;
    
    // Determina per chi è la prenotazione
    let bookingUserId = session.user.id;
    
    // Se admin/master e specifica un userId, prenota per quell'utente
    // CRITICO: Master deve poter prenotare per qualsiasi paziente
    // Usa ENTRAMBI i controlli: email E ruolo (per retrocompatibilità sessioni)
    const isMaster = isMasterAccount(session.user.email) || session.user.role === 'ADMIN';
    
    console.log('[MASTER CHECK] email:', session.user.email, 'role:', session.user.role, 'isMaster:', isMaster);
    
    if (targetUserId && isMaster) {
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
        whitelistedAt: true, // Per sistema blacklist: azzera contatore cancellazioni
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
    // NOTA: isMaster già include controllo ruolo, quindi lo usiamo direttamente
    const isAdmin = isMaster;
    
    // Se non è admin E il paziente per cui si prenota non è whitelisted, blocca
    // Ma se è admin, può prenotare per chiunque
    if (!isAdmin && !bookingUser.isWhitelisted) {
      return NextResponse.json(
        { success: false, error: 'Il tuo account non è ancora abilitato alle prenotazioni. Attendi l\'approvazione.' },
        { status: 403 }
      );
    }
    
    // REGOLA: Pazienti possono prenotare SOLO visite da 60 minuti (Controllo)
    // Solo admin può prenotare 90min (Prima Visita) o 120min (Visita Approfondita)
    if (!isAdmin && customDuration && customDuration !== 60) {
      return NextResponse.json(
        { success: false, error: 'Puoi prenotare solo visite di controllo da 60 minuti. Per altri tipi di visita, contatta lo studio.' },
        { status: 403 }
      );
    }
    
    // Forza tipo FOLLOW_UP per pazienti (non possono scegliere FIRST_VISIT)
    const finalType = isAdmin ? type : 'FOLLOW_UP';

    // Verifica email verificata (per utenti registrati con password)
    // Skip per utenti OAuth (non hanno password, usano Google)
    // IMPORTANTE: Blocchiamo solo se l'utente ha password MA non ha verificato email
    if (bookingUser.email && !isMaster) {
      // Verifica se l'utente ha una password (registrazione email/password)
      const userWithPassword = await db.user.findUnique({
        where: { id: bookingUserId },
        select: { password: true, emailVerified: true },
      });
      
      // Se ha password ma non ha verificato email, blocca
      if (userWithPassword?.password && !userWithPassword.emailVerified) {
        return NextResponse.json(
          { success: false, error: 'Devi verificare la tua email prima di prenotare. Controlla la tua casella di posta.' },
          { status: 403 }
        );
      }
    }

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
        startTime: new Date(startTime),
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

    // ==========================================================================
    // SISTEMA BLACKLIST ANTI-SPAM
    // Regole:
    // 1. Conta solo cancellazioni di appuntamenti FUTURI (startTime > cancelledAt)
    // 2. Conta solo cancellazioni degli ultimi 30 giorni
    // 3. Il contatore si AZZERA quando admin prenota per il paziente (whitelistedAt)
    // 4. Limite: 3 cancellazioni = blocco prenotazione (deve contattare studio)
    // ==========================================================================
    if (!isAdmin) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Costruisci la query base
      const cancellationQuery: any = {
        userId: bookingUserId,
        status: 'CANCELLED',
        cancelledAt: {
          gte: thirtyDaysAgo,
        },
      };
      
      // Se il paziente è stato riportato in whitelist da admin,
      // considera solo le cancellazioni DOPO quella data
      if (bookingUser.whitelistedAt) {
        const whitelistedDate = new Date(bookingUser.whitelistedAt);
        // Se whitelistedAt è più recente di 30 giorni fa, usa quella come data di partenza
        if (whitelistedDate > thirtyDaysAgo) {
          cancellationQuery.cancelledAt = {
            gte: whitelistedDate,
          };
        }
      }
      
      // Recupera le cancellazioni per filtrarle manualmente
      // (dobbiamo verificare che startTime > cancelledAt, cioè appuntamento ERA futuro)
      const recentCancellations = await db.appointment.findMany({
        where: cancellationQuery,
        select: {
          id: true,
          startTime: true,
          cancelledAt: true,
        },
      });
      
      // Filtra: conta solo cancellazioni di appuntamenti che erano FUTURI al momento della cancellazione
      const futureCancellations = recentCancellations.filter(apt => {
        if (!apt.cancelledAt) return false;
        return apt.startTime > apt.cancelledAt; // L'appuntamento era futuro quando è stato cancellato
      });
      
      if (futureCancellations.length >= 3) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Hai raggiunto il limite di 3 prenotazioni cancellate negli ultimi 30 giorni. Per prenotare nuovamente, contatta lo studio al numero 392 0979135.` 
          },
          { status: 400 }
        );
      }
    }

    // Verifica possibilità di prenotare (slot libero, orario valido, ecc.)
    // Usa durata personalizzata se fornita (es. 120min), altrimenti default dal tipo
    const duration = customDuration || (type === 'FIRST_VISIT' 
      ? VISIT_DURATION.FIRST_VISIT 
      : VISIT_DURATION.FOLLOW_UP);
    
    // Passa l'email del chiamante per verifiche master (punti 1, 8, 9)
    // IMPORTANTE: Se è master, passa un flag esplicito
    const canBook = await canUserBook(
      bookingUserId, 
      new Date(startTime), 
      duration,
      isMaster ? 'MASTER_OVERRIDE' : (session.user.email || undefined)
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
    // CRITICO: Passa callerEmail per bypass master nel secondo check di canUserBook
    // Usa finalType per garantire che pazienti usino FOLLOW_UP
    const appointment = await createAppointment(
      bookingUserId,
      new Date(startTime),
      finalType,
      notes,
      isMaster ? 'MASTER_OVERRIDE' : (session.user.email || undefined),
      customDuration // Passa durata personalizzata (es. 120min)
    );
    
    // AUTO-WHITELIST: Se admin crea appuntamento per utente non in whitelist,
    // significa che il paziente ha contattato il medico -> riporta in whitelist
    if (isMaster && !bookingUser.isWhitelisted) {
      await db.user.update({
        where: { id: bookingUserId },
        data: { 
          isWhitelisted: true, 
          whitelistedAt: new Date(),
        },
      });
      console.log(`[AUTO-WHITELIST] Paziente ${bookingUser.email} riportato in whitelist da admin`);
    }
    
    // Formatta data e ora per email
    const appointmentDate = format(new Date(startTime), 'EEEE d MMMM yyyy', { locale: it });
    const appointmentTime = format(new Date(startTime), 'HH:mm');
    const appointmentType = finalType === 'FIRST_VISIT' ? 'Prima Visita (90 min)' : 'Visita di Controllo (60 min)';

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
      appointment: { id: appointment.id }, // Per finestra note paziente
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
    
    // Converti le date nel formato locale (senza UTC)
    const formattedAppointments = appointments.map(apt => ({
      ...apt,
      startTime: toLocalISOString(apt.startTime),
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedAppointments,
    });
    
  } catch (error) {
    console.error('Errore recupero appuntamenti:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero degli appuntamenti' },
      { status: 500 }
    );
  }
}
