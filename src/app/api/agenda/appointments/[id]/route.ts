// =============================================================================
// API: SINGOLO APPUNTAMENTO - DOTT. BERNARDO GIAMMETTA
// Endpoint per gestire un singolo appuntamento
// GET /api/agenda/appointments/[id] - Dettagli appuntamento
// DELETE /api/agenda/appointments/[id] - Cancella appuntamento
// PATCH /api/agenda/appointments/[id] - Modifica appuntamento (admin)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { cancelAppointment } from '@/lib/agenda';
import { z } from 'zod';

// =============================================================================
// GET - Dettagli appuntamento
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
    
    const appointment = await db.appointment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
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
    if (appointment.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accesso non autorizzato' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: appointment,
    });
    
  } catch (error) {
    console.error('Errore recupero appuntamento:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nel recupero dell\'appuntamento' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Cancella appuntamento
// Supporta due modalità:
// - Annulla (tracciato): imposta status CANCELLED (default)
// - Elimina (non tracciato): rimuove completamente dal DB (?hard=true)
// =============================================================================

export async function DELETE(
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
    
    // Verifica se è eliminazione hard (non tracciata) - solo admin
    const { searchParams } = new URL(request.url);
    const isHardDelete = searchParams.get('hard') === 'true';
    
    if (isHardDelete) {
      // Eliminazione non tracciata - solo admin può farlo
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Solo l\'admin può eliminare completamente un appuntamento' },
          { status: 403 }
        );
      }
      
      // Elimina completamente dal database
      await db.appointment.delete({
        where: { id: params.id },
      });
      
      return NextResponse.json({
        success: true,
        message: 'Appuntamento eliminato definitivamente',
      });
    }
    
    // Annullamento tracciato (default)
    // Passa email invece di ID per compatibilità con Cognito
    const cancelled = await cancelAppointment(params.id, session.user.id, session.user.email);
    
    // TODO: Invia email di conferma cancellazione al paziente e notifica al dottore
    
    return NextResponse.json({
      success: true,
      data: cancelled,
      message: 'Appuntamento annullato con successo',
    });
    
  } catch (error) {
    console.error('Errore cancellazione appuntamento:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore nella cancellazione' 
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH - Modifica appuntamento (solo admin)
// =============================================================================

const updateAppointmentSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
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
    
    // Solo admin può modificare
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Solo l\'amministratore può modificare gli appuntamenti' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const validationResult = updateAppointmentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Dati non validi' },
        { status: 400 }
      );
    }
    
    const updateData: any = { ...validationResult.data };
    
    // Se viene impostato come completato, aggiorna anche lastVisitAt dell'utente
    if (updateData.status === 'COMPLETED') {
      const appointment = await db.appointment.findUnique({
        where: { id: params.id },
        select: { userId: true, startTime: true },
      });
      
      if (appointment) {
        await db.user.update({
          where: { id: appointment.userId },
          data: { lastVisitAt: appointment.startTime },
        });
      }
    }
    
    const updated = await db.appointment.update({
      where: { id: params.id },
      data: updateData,
    });
    
    return NextResponse.json({
      success: true,
      data: updated,
    });
    
  } catch (error) {
    console.error('Errore modifica appuntamento:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nella modifica dell\'appuntamento' },
      { status: 500 }
    );
  }
}
