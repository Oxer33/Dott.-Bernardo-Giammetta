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
import { parseISO } from 'date-fns';
import { z } from 'zod';

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
    
    // Se admin e specifica un userId, prenota per quell'utente
    if (targetUserId && session.user.role === 'ADMIN') {
      bookingUserId = targetUserId;
    }
    
    // Verifica possibilità di prenotare
    const duration = type === 'FIRST_VISIT' 
      ? VISIT_DURATION.FIRST_VISIT 
      : VISIT_DURATION.FOLLOW_UP;
      
    const canBook = await canUserBook(
      bookingUserId, 
      parseISO(startTime), 
      duration
    );
    
    if (!canBook.canBook) {
      return NextResponse.json(
        { success: false, error: canBook.reason },
        { status: 400 }
      );
    }
    
    // Crea appuntamento
    const appointment = await createAppointment(
      bookingUserId,
      parseISO(startTime),
      type,
      notes
    );
    
    // TODO: Invia email di conferma al paziente e notifica al dottore
    
    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appuntamento prenotato con successo!',
    });
    
  } catch (error) {
    console.error('Errore creazione appuntamento:', error);
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
