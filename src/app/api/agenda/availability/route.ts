// =============================================================================
// API: DISPONIBILITÀ AGENDA - DOTT. BERNARDO GIAMMETTA
// Endpoint per ottenere la disponibilità delle fasce orarie
// GET /api/agenda/availability?date=2024-01-15&days=7
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWeekAvailability, getDayAvailability } from '@/lib/agenda';
import { parseISO, startOfDay } from 'date-fns';

// =============================================================================
// GET - Ottieni disponibilità
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Parametri query
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const daysParam = searchParams.get('days');
    
    // Data di partenza (default: oggi)
    const startDate = dateParam 
      ? startOfDay(parseISO(dateParam))
      : startOfDay(new Date());
    
    // Numero di giorni (default: 7)
    const days = daysParam ? parseInt(daysParam, 10) : 7;
    
    // Verifica se l'utente è admin per mostrare note private
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';
    
    // Se richiesto un solo giorno
    if (days === 1) {
      const availability = await getDayAvailability(startDate, isAdmin);
      return NextResponse.json({
        success: true,
        data: availability,
      });
    }
    
    // Altrimenti ritorna la settimana
    const availability = await getWeekAvailability(startDate, days, isAdmin);
    
    return NextResponse.json({
      success: true,
      data: availability,
    });
    
  } catch (error) {
    console.error('Errore nel recupero disponibilità:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore nel recupero della disponibilità' 
      },
      { status: 500 }
    );
  }
}
