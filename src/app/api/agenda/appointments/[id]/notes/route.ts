// =============================================================================
// API NOTES - DOTT. BERNARDO GIAMMETTA
// PUT /api/agenda/appointments/[id]/notes - Aggiorna note appuntamento
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMasterAccount } from '@/lib/config';

// =============================================================================
// PUT - Aggiorna note appuntamento
// =============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const appointmentId = params.id;
    const { notes } = await request.json();

    // Verifica che l'appuntamento esista
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appuntamento non trovato' },
        { status: 404 }
      );
    }

    // Verifica permessi: deve essere il proprietario O admin
    const isMaster = session.user.role === 'ADMIN' || 
      (session.user.email && isMasterAccount(session.user.email));
    
    const isOwner = appointment.userId === session.user.id ||
      appointment.user?.email === session.user.email;

    if (!isOwner && !isMaster) {
      return NextResponse.json(
        { success: false, error: 'Non hai i permessi per modificare questo appuntamento' },
        { status: 403 }
      );
    }

    // Pazienti possono modificare note solo di appuntamenti CONFIRMED (futuri)
    if (!isMaster && appointment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { success: false, error: 'Puoi modificare le note solo per appuntamenti futuri confermati' },
        { status: 403 }
      );
    }

    // Aggiorna le note
    const updated = await db.appointment.update({
      where: { id: appointmentId },
      data: { notes: notes || null },
    });

    return NextResponse.json({
      success: true,
      appointment: updated,
    });

  } catch (error) {
    console.error('Errore aggiornamento note:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel salvataggio delle note' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Recupera note appuntamento
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const appointmentId = params.id;

    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        notes: true,
        status: true,
        userId: true,
        user: {
          select: { email: true },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appuntamento non trovato' },
        { status: 404 }
      );
    }

    // Verifica permessi
    const isMaster = session.user.role === 'ADMIN' || 
      (session.user.email && isMasterAccount(session.user.email));
    
    const isOwner = appointment.userId === session.user.id ||
      appointment.user?.email === session.user.email;

    if (!isOwner && !isMaster) {
      return NextResponse.json(
        { success: false, error: 'Non hai i permessi per vedere questo appuntamento' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      notes: appointment.notes,
      status: appointment.status,
    });

  } catch (error) {
    console.error('Errore recupero note:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero delle note' },
      { status: 500 }
    );
  }
}
